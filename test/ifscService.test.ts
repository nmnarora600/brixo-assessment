import nock from 'nock';
import mongoose from 'mongoose';
import { getIfsc } from '../src/services/ifscService';
import { Ifsc } from '../src/models/Ifsc';
import { config } from '../src/config';
import { redis } from '../src/cache';

// Simple function to ensure Docker Compose is up


// Use a different DB for tests
beforeAll(async () => {

  config.mongoUri = 'mongodb://127.0.0.1:27017/brixo_ifsc_test';
  await mongoose.connect(config.mongoUri);
  await redis.flushall();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await redis.quit();
});

afterEach(async () => {
  await Ifsc.deleteMany({});
  await redis.flushall();
  nock.cleanAll();
});

describe('getIfsc', () => {
  it('fetches from provider and stores in DB + cache', async () => {
    const code = 'HDFC0CAGSBK';
    const scope = nock(config.providers.razorpayBase)
      .get(`/${code}`)
      .reply(200, {
        IFSC: code,
        BANK: 'HDFC Bank',
        BRANCH: 'AGAR',
        ADDRESS: 'Address',
        CITY: 'AGAR',
        DISTRICT: 'AGAR',
        STATE: 'MP',
        NEFT: true,
        RTGS: true,
        IMPS: true
      });

    const res = await getIfsc(code);
    expect(res.code).toBe(code);
    expect(res.bank).toBe('HDFC Bank');
    expect(scope.isDone()).toBe(true);

    const inDb = await Ifsc.findOne({ code });
    expect(inDb).not.toBeNull();

    const cached = await redis.get(`ifsc:${code}`);
    expect(cached).not.toBeNull();
  });

  it('returns from DB when fresh without calling provider', async () => {
    const code = 'HDFC0CAGSBK';
    await Ifsc.create({ code, bank: 'HDFC', lastUpdated: new Date(), provider: 'razorpay' });
    const res = await getIfsc(code);
    expect(res.bank).toBe('HDFC');
  });

  it('returns 404 when not found', async () => {
    const code = 'HDFC0XXXXXX';
    const scope = nock(config.providers.razorpayBase).get(`/${code}`).reply(404);
    await expect(getIfsc(code)).rejects.toMatchObject({ status: 404 });
    expect(scope.isDone()).toBe(true);
  });
});
