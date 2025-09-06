import mongoose, { Schema, Document } from 'mongoose';

export interface IfscDoc extends Document {
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
  lastUpdated: Date;
  provider: string;
}

const IfscSchema = new Schema<IfscDoc>({
  code: { type: String, required: true, unique: true, index: true },
  bank: String,
  branch: String,
  address: String,
  contact: String,
  city: String,
  district: String,
  state: String,
  centre: String,
  rtgs: Boolean,
  neft: Boolean,
  imps: Boolean,
  micr: { type: String, default: null },
  swift: { type: String, default: null },
  iso3166: { type: String, default: 'IN' },
  lastUpdated: { type: Date, required: true, default: () => new Date() },
  provider: { type: String, required: true, default: 'razorpay' }
}, { timestamps: true });

export const Ifsc = mongoose.model<IfscDoc>('Ifsc', IfscSchema);
