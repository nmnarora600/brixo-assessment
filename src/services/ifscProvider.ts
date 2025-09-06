export interface IfscData {
  code: string;
  bank?: string;
  branch?: string;
  address?: string;
  contact?: string;
  city?: string;
  district?: string;
  state?: string;
  centre?: string;
  rtgs?: boolean;
  neft?: boolean;
  imps?: boolean;
  micr?: string | null;
  swift?: string | null;
  iso3166?: string | null;
  provider: string;
}

export interface IfscProvider {
  name: string;
  getByCode(code: string): Promise<IfscData | null>;
}
