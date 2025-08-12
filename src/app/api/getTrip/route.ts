import { NextResponse } from "next/server";
import dbConnect from "../../../../dbConnect/dbConnect";
import Trip from "../../../../models/trip";
import mongoose from "mongoose";
export interface TripResponse {
  _id: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalBudget: number;
  sections: {
    name: string;
    budget: number;
    daysToStay: number;
    dateRange: string;
  }[];
}
export async function GET(request: Request) {
  try {
    await dbConnect();
   
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get("userEmail");
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "userEmail query parameter is required" },
        { status: 400 }
      );
    }

    const count = await Trip.countDocuments({ userEmail });
    console.log(`Found ${count} trips for email: ${userEmail}`);

    // Define the type for the lean document
    interface LeanTrip {
      _id: mongoose.Types.ObjectId;
      destination: string;
      startDate: Date;
      endDate: Date;
      totalDays: number;
      totalBudget: number;
      sections?: {
        name: string;
        budget: number;
        daysToStay: number;
        dateRange: string;
        isEditable?: boolean;
      }[];
      createdAt: Date;
      updatedAt: Date;
    }

    const trips = await Trip.find({ userEmail })
      .sort({ createdAt: -1 })
      .lean<LeanTrip[]>()
      .then(docs => docs.map(doc => ({
        _id: doc._id.toString(),
        destination: doc.destination,
        startDate: doc.startDate.toISOString(),
        endDate: doc.endDate.toISOString(),
        totalDays: doc.totalDays,
        totalBudget: doc.totalBudget,
        sections: (doc.sections || []).map(section => ({
          name: section.name,
          budget: section.budget,
          daysToStay: section.daysToStay,
          dateRange: section.dateRange,
        })),
      })));

    return NextResponse.json({ success: true, trips });
  } catch (error: unknown) {
    console.error("Error fetching trips:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch trips";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// Explicitly declare that there are no other exports
export const dynamic = 'force-dynamic';