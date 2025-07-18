import mongoose, { Schema, Document, models, model } from 'mongoose';

export enum UserRole {
  PATIENT = 'patient',
  PHARMACY = 'pharmacy',
  GOVERNMENT = 'government',
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profile?: {
    age?: number;
    gender?: string;
    address?: string;
    phone?: string;
  };
  pharmacyInfo?: {
    name: string;
    licenseNumber: string;
    address: string;
    contact: string;
  };
  governmentInfo?: {
    department: string;
  };
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  profile: {
    age: Number,
    gender: String,
    address: String,
    phone: String,
  },
  pharmacyInfo: {
    name: String,
    licenseNumber: String,
    address: String,
    contact: String,
  },
  governmentInfo: {
    department: String,
  },
}, { timestamps: true });

export const User = models.User || model<IUser>('User', UserSchema);

export interface IMedicine extends Document {
  pharmacyId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  stock: number;
  price: number;
  manufacturer?: string;
  expiryDate?: Date;
}

const MedicineSchema = new Schema<IMedicine>({
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  stock: { type: Number, required: true },
  price: { type: Number, required: true },
  manufacturer: String,
  expiryDate: Date,
}, { timestamps: true });

export const Medicine = models.Medicine || model<IMedicine>('Medicine', MedicineSchema);

export interface IPrescription extends Document {
  patientId: mongoose.Types.ObjectId;
  imageUrl: string;
  ocrText?: string;
  uploadedAt: Date;
}

const PrescriptionSchema = new Schema<IPrescription>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  ocrText: String,
  uploadedAt: { type: Date, default: Date.now },
});

export const Prescription = models.Prescription || model<IPrescription>('Prescription', PrescriptionSchema);

export interface IReceipt extends Document {
  patientId: mongoose.Types.ObjectId;
  imageUrl: string;
  ocrText?: string;
  uploadedAt: Date;
}

const ReceiptSchema = new Schema<IReceipt>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  ocrText: String,
  uploadedAt: { type: Date, default: Date.now },
});

export const Receipt = models.Receipt || model<IReceipt>('Receipt', ReceiptSchema);

export interface IReward extends Document {
  patientId: mongoose.Types.ObjectId;
  points: number;
  description?: string;
  earnedAt: Date;
}

const RewardSchema = new Schema<IReward>({
  patientId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  points: { type: Number, required: true },
  description: String,
  earnedAt: { type: Date, default: Date.now },
});

export const Reward = models.Reward || model<IReward>('Reward', RewardSchema);

export interface IMarketplace extends Document {
  name: string;
  description?: string;
  price: number;
  pharmacyId: mongoose.Types.ObjectId;
  imageUrl?: string;
  createdAt: Date;
}

const MarketplaceSchema = new Schema<IMarketplace>({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  pharmacyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export const Marketplace = models.Marketplace || model<IMarketplace>('Marketplace', MarketplaceSchema); 