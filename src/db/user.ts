import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  OTP?: string;
  OTPExpires?: Date;  // Critical for security
  lastPayment?: {
    date: Date;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
  };
  expirationDate?:Date|null,   //
  active: boolean;
  createdAt: Date;    // Auto-track user signup time
  updatedAt: Date;    // Auto-track last update
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is mandatory'],
      trim: true,
      lowercase: true,       // Normalize email case
      unique: true,          // Prevent duplicate emails
      match: [/.+\@.+\..+/, 'Please enter a valid email'], // Basic validation
    },
    password: {
      type: String,
      required: [true, 'Password is mandatory'],
      minlength: [8, 'Password must be at least 8 characters'],
    },
    OTP: {
      type: String,
      trim: true,
    },
    OTPExpires: {
      type: Date,            // Automatically clear expired OTPs
    },
    lastPayment: {
      date: Date,
      amount: Number,
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], // Restrict values
        default: 'pending',
      },
    },
    expirationDate: {
      type: Date,            
      default: null,
    },
    active: {
      type: Boolean,
      default: false,         // New users are inactive by default
    },
  },
  { timestamps: true }       // Auto-adds `createdAt` and `updatedAt`
);

export const User = model<IUser>('User', UserSchema);