import mongoose from 'mongoose';

interface TripSection {
  name: string;
  budget: number;
  daysToStay: number;
  dateRange: string;
  isEditable?: boolean;
}

interface TripDocument extends mongoose.Document {
  destination: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalBudget: number;
  userEmail?: string;
  sections: TripSection[];
}

const TripSectionSchema = new mongoose.Schema<TripSection>({
  name: { type: String, required: true },
  budget: { type: Number, required: true },
  daysToStay: { type: Number, required: true },
  dateRange: { type: String, required: true },
  isEditable: { type: Boolean, default: false }
}, { timestamps: true });

const TripSchema = new mongoose.Schema<TripDocument>({
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalBudget: { type: Number, required: true },
  userEmail: { type: String },
  sections: [TripSectionSchema]
}, { timestamps: true });

export default mongoose.models.Trip || mongoose.model<TripDocument>('Trip', TripSchema);