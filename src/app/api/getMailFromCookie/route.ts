import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "../../../../dbConnect/dbConnect";
import User from "../../../../models/userModel"; // adjust path to your model

export async function GET() {
  try {
    // Connect to DB
    await connectDB();

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "No token found" }), { status: 401 });
    }

    // Decode token without verifying
    const decoded = jwt.decode(token) as { email?: string } | null;

    if (!decoded || !decoded.email) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 400 });
    }

    // Find user in DB using email
    const user = await User.findOne({ email: decoded.email }).select("profilePicture email username additionalInfo");
    console.log("User found:", user);

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ 
      email: user.email,
      username: user.username,
      profilePic: user.profilePicture,
      additionalInfo: user.additionalInfo
    }), { status: 200 });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
