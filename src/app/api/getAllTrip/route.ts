import { NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect/dbConnect";
import Trip from "../../../../models/trip";
import mongoose from "mongoose";

// Define interfaces for your data structure
interface TripSection {
  name: string;
  budget: number;
  daysToStay: number;
  dateRange: string;
  isEditable?: boolean;
}

interface LeanTrip extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  destination: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  totalBudget: number;
  userEmail: string;
  sections?: TripSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TripResponse {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  userEmail: string;
  sections: TripSection[];
  createdAt: string;
  updatedAt: string;
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const trips = await Trip.find({})
      .sort({ createdAt: -1 })
      .lean<LeanTrip[]>()
      .then(docs => docs.map(doc => {
        // Explicitly type the section parameter
        const sections: TripSection[] = (doc.sections || []).map((section: TripSection) => ({
          name: section.name,
          budget: section.budget,
          daysToStay: section.daysToStay,
          dateRange: section.dateRange,
          ...(section.isEditable !== undefined && { isEditable: section.isEditable })
        }));

        return {
          _id: doc._id.toString(),
          destination: doc.destination,
          startDate: doc.startDate.toISOString(),
          endDate: doc.endDate.toISOString(),
          totalDays: doc.totalDays,
          totalBudget: doc.totalBudget,
          userEmail: doc.userEmail,
          sections,
          createdAt: doc.createdAt.toISOString(),
          updatedAt: doc.updatedAt.toISOString(),
        };
      }));

    return NextResponse.json({ 
      success: true, 
      trips: Array.isArray(trips) ? trips : [] 
    });
  } catch (error: unknown) {
    console.error("Error fetching trips:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch trips",
        trips: []
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';