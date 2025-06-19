// oneUser.js or oneUser.ts if using TypeScript
import { Schema, model } from 'mongoose';

const LogSchema = new Schema(
  {
    priority: {
      type: String,
      enum: ['warning', 'error', 'info'], // Enforce allowed values
      required: [true, 'priority is mandatory'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'description is mandatory'],
      trim: true,
    },
    comments: {
      type: String,
      trim: true,
      default: '', // Optional: ensures it's always a string
    },
  },
  {
    timestamps: true,
  }
);

export default model('Log', LogSchema);
