import { UserRole } from './models';
import { Types } from 'mongoose';

export interface UserDTO {
  _id?: string;
  name: string;
  email: string;
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

export interface MedicineDTO {
  _id?: string;
  pharmacyId: string | Types.ObjectId;
  name: string;
  description?: string;
  stock: number;
  price: number;
  manufacturer?: string;
  expiryDate?: Date | string;
}

export interface PrescriptionDTO {
  _id?: string;
  patientId: string | Types.ObjectId;
  imageUrl: string;
  ocrText?: string;
  uploadedAt?: Date | string;
}

export interface ReceiptDTO {
  _id?: string;
  patientId: string | Types.ObjectId;
  imageUrl: string;
  ocrText?: string;
  uploadedAt?: Date | string;
}

export interface RewardDTO {
  _id?: string;
  patientId: string | Types.ObjectId;
  points: number;
  description?: string;
  earnedAt?: Date | string;
}

export interface MarketplaceDTO {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  pharmacyId: string | Types.ObjectId;
  imageUrl?: string;
  createdAt?: Date | string;
} 