// types/trip.ts
import mongoose from 'mongoose';

export interface TripSection {
  _id?: mongoose.Types.ObjectId;
  name: string;
  budget: number;
  daysToStay: number;
  dateRange: string;
  isEditable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TripDocument extends mongoose.Document {
  destination: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalBudget: number;
  userEmail?: string;
  sections: TripSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTripRequest {
  destination: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalBudget: number;
  userEmail?: string;
  sections: Omit<TripSection, '_id' | 'createdAt' | 'updatedAt'>[];
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}