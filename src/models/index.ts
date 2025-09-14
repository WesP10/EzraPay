import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  userId: string;
  name: string;
  email: string;
  school: string;
  netId: string;
  photo: ObjectId | null;
}

export interface Wallet {
  _id?: ObjectId;
  userId: string;
  publicKey: string;
  privateKey: string;
  createdAt: Date;
}

export interface Photo {
  _id?: ObjectId;
  userId: string;
  data: Buffer;
  mimeType: string;
  createdAt: Date;
}

export interface PasswordRequirements {
  hasLowerCase: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  requirements: PasswordRequirements;
}
