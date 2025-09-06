import { IfscProvider, IfscData } from '../ifscProvider';
import { http } from '../../utils/httpClient';
import { config } from '../../config';

export class RazorpayIfscProvider implements IfscProvider {
  public name = 'razorpay';

  async getByCode(code: string): Promise<IfscData | null> {
    try {
      const url = `${config.providers.razorpayBase}/${encodeURIComponent(code)}`;
      const res = await http.get(url, { validateStatus: () => true });
      if (res.status === 404) return null;
      if (res.status >= 200 && res.status < 300 && typeof res.data === 'object') {
        const d = res.data;
        return {
          code: d.IFSC || code,
          bank: d.BANK,
          branch: d.BRANCH,
          address: d.ADDRESS,
          contact: d.CONTACT,
          city: d.CITY,
          district: d.DISTRICT,
          state: d.STATE,
          centre: d.CENTRE,
          rtgs: d.RTGS,
          neft: d.NEFT,
          imps: d.IMPS,
          micr: d.MICR ?? null,
          swift: d.SWIFT ?? null,
          iso3166: 'IN',
          provider: this.name
        };
      }
      throw new Error(`Unexpected response from provider: ${res.status}`);
    } catch (err) {
      throw err;
    }
  }
}
