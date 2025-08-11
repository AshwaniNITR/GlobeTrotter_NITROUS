// import mongoose from 'mongoose';

// const TripSectionSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   budget: { type: Number, required: true },
//   daysToStay: { type: Number, required: true },
//   dateRange: { type: String, required: true },
//   isEditable: { type: Boolean, default: false }
// }, { timestamps: true });

// const TripSchema = new mongoose.Schema({
//   destination: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   totalDays: { type: Number, required: true },
//   totalBudget: { type: Number, required: true },
//   userEmail: { type: String }, // Optional: store email if available
//   sections: [TripSectionSchema]
// }, { timestamps: true });

// export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);
import mongoose from 'mongoose';
import { TripSection } from '../types/trips';

const TripSectionSchema = new mongoose.Schema<TripSection>({
  name: { type: String, required: true },
  budget: { type: Number, required: true },
  daysToStay: { type: Number, required: true },
  dateRange: { type: String, required: true },
  isEditable: { type: Boolean, default: false }
}, { timestamps: true });

const TripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalDays: { type: Number, required: true },
  totalBudget: { type: Number, required: true },
  userEmail: { type: String },
  sections: [TripSectionSchema]
}, { timestamps: true });

export default mongoose.models.Trip || mongoose.model('Trip', TripSchema);