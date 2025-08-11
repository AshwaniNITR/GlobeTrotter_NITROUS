import { NextResponse } from "next/server";
import  connectMongo  from "../../../../dbConnect/dbConnect";
import User from "../../../../models/userModel";

export async function GET() {
  try {
    await connectMongo();
    const data = await User.find({});
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
