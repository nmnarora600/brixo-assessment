import { Ifsc } from '../models/Ifsc';
import { redis } from '../cache';
import { config } from '../config';
import { RazorpayIfscProvider } from './providers/razorpayProvider';
import { IfscProvider, IfscData } from './ifscProvider';

const providers: IfscProvider[] = [
  new RazorpayIfscProvider(),
  // Add more providers here in failover order
];

const isValidIfsc = (code: string) => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(code);

export async function getIfsc(code: string, forceRefresh = false): Promise<IfscData> {
  const normalized = code.trim().toUpperCase();
  if (!isValidIfsc(normalized)) {
    throw Object.assign(new Error('Invalid IFSC format'), { status: 400 });
  }

  const cacheKey = `ifsc:${normalized}`;
//check redis
  if (!forceRefresh) {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  }

  // DB lookup
  const doc = await Ifsc.findOne({ code: normalized }).lean();
  const now = new Date();
  const staleMs = config.business.staleDays * 24 * 60 * 60 * 1000;

  if (doc && !forceRefresh) {
    const isStale = now.getTime() - new Date(doc.lastUpdated).getTime() > staleMs;
    if (!isStale) {
      await redis.set(cacheKey, JSON.stringify(doc), 'EX', config.business.redisTtlSeconds);
      return doc as any;
    }
  }

  // Fetch from providers
  let fetched: IfscData | null = null;
  let lastError: any = null;
  for (const p of providers) {
    try {
      const data = await p.getByCode(normalized);
      if (data) { fetched = data; break; }
    } catch (e) {
      lastError = e;
    }
  }
  if (!fetched) {
    if (doc) {
      // if provider failed but we have stale doc, return it with a hint
      await redis.set(cacheKey, JSON.stringify(doc), 'EX', config.business.redisTtlSeconds);
      return doc as any;
    }
    const err: any = new Error('IFSC code not found');
    err.status = 404;
    throw err;
  }

  // Upsert DB
  const toSave = {
    ...fetched,
    lastUpdated: now
  };
  await Ifsc.updateOne({ code: normalized }, { $set: toSave }, { upsert: true });

  // Cache
  await redis.set(cacheKey, JSON.stringify(toSave), 'EX', config.business.redisTtlSeconds);

  return toSave as any;
}
