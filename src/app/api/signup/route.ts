import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"; // ✅ Added UploadApiResponse type
import bcrypt from "bcryptjs";
import User, { IUser } from "../../../../models/userModel"; // ✅ Assuming IUser interface is exported
import connectMongo from "../../../../dbConnect/dbConnect";
import { OAuth2Client } from "google-auth-library";
import { generateTokens } from "../../../../helpers/getToken";
import { sendEmail } from "../../../../helpers/mailer";
import { serialize } from "cookie";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await connectMongo();

    const formData = await request.formData();
    const googleToken = formData.get("googleToken") as string | null;

    if (googleToken) {
      // Google Signup
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload?.email_verified || !payload.email) {
        return NextResponse.json(
          { error: "Google account not verified or email missing" },
          { status: 401 }
        );
      }

      let profilePictureUrl = payload.picture || "";
      const profileImage = formData.get("profileImage") as File | null;

      if (profileImage && profileImage.size > 0) {
        try {
          const arrayBuffer = await profileImage.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const result: UploadApiResponse = await new Promise(
            (resolve, reject) => {
              // ✅ Typed
              cloudinary.uploader
                .upload_stream(
                  {
                    folder: "profile-pictures",
                    resource_type: "auto",
                    transformation: [
                      {
                        width: 400,
                        height: 400,
                        crop: "fill",
                        gravity: "face",
                      },
                      { quality: "auto", fetch_format: "auto" },
                    ],
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                  }
                )
                .end(buffer);
            }
          );

          profilePictureUrl = result.secure_url;
        } catch (uploadError: unknown) {
          // ✅ Unknown instead of any
          console.error("Image upload error:", uploadError);
        }
      }

      const existingUser = await User.findOne({
        $or: [
          { email: payload.email.toLowerCase() },
          { googleId: payload.sub },
        ],
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 409 }
        );
      }

      // Username will be required from client formData
      const username = formData.get("username") as string;
      if (!username?.trim()) {
        return NextResponse.json(
          { error: "Username is required" },
          { status: 400 }
        );
      }

      const newUser = new User({
        username: username.trim(),
        email: payload.email.toLowerCase(),
        googleId: payload.sub,
        isVerified: true,
        authProvider: "google",
        profilePicture: profilePictureUrl,
      });

      const savedUser = await newUser.save();
      const { password: _pw, ...userResponse } = savedUser.toObject(); // ✅ Renamed unused var

      return NextResponse.json({ success: true, user: userResponse });
    } else {
      // Regular Signup
      const username = formData.get("username") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const city = formData.get("city") as string;
      const country = formData.get("country") as string;
      const password = formData.get("password") as string;
      const additionalInfo = formData.get("additionalInfo") as string;
      const profileImage = formData.get("profileImage") as File | null;

      if (!username?.trim() || !email?.trim() || !password?.trim()) {
        return NextResponse.json(
          { error: "Username, email, and password are required" },
          { status: 400 }
        );
      }

      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        );
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      let profilePictureUrl = "";
      if (profileImage && profileImage.size > 0) {
        try {
          if (!profileImage.type.startsWith("image/")) {
            return NextResponse.json(
              { error: "Invalid file type. Please upload an image file." },
              { status: 400 }
            );
          }

          if (profileImage.size > 5 * 1024 * 1024) {
            return NextResponse.json(
              {
                error:
                  "Image size too large. Please upload an image under 5MB.",
              },
              { status: 400 }
            );
          }

          const arrayBuffer = await profileImage.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const result: UploadApiResponse = await new Promise(
            (resolve, reject) => {
              // ✅ Typed
              cloudinary.uploader
                .upload_stream(
                  {
                    folder: "profile-pictures",
                    resource_type: "auto",
                    transformation: [
                      {
                        width: 400,
                        height: 400,
                        crop: "fill",
                        gravity: "face",
                      },
                      { quality: "auto", fetch_format: "auto" },
                    ],
                  },
                  (error, result) => {
                    if (error) reject(error);
                    else resolve(result as UploadApiResponse);
                  }
                )
                .end(buffer);
            }
          );

          profilePictureUrl = result.secure_url;
        } catch (uploadError: unknown) {
          // ✅ unknown instead of any
          console.error("Image upload error:", uploadError);
          return NextResponse.json(
            { error: "Failed to upload image. Please try again." },
            { status: 500 }
          );
        }
      }

      const newUser = new User({
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone: phone?.trim() || "",
        location: {
          city: city?.trim() || "",
          country: country?.trim() || "",
        },
        additionalInfo: additionalInfo?.trim() || "",
        isVerified: false,
        authProvider: "email",
        profilePicture: profilePictureUrl,
      });

      const savedUser = await newUser.save();
      const tokenPayload = {
        userId: savedUser._id.toString(),
        email: savedUser.email,
        username: savedUser.username,
      };

      const { accessToken, refreshToken } = generateTokens(tokenPayload);

      // Store refresh token
      savedUser.refreshToken = refreshToken;
      await savedUser.save();

      // Send verification email
      await sendEmail({
        email: savedUser.email,
        emailType: "VERIFY",
        userId: savedUser._id.toString(),
      });

      const { password: _pw2, ...userResponse } = savedUser.toObject(); // ✅ renamed unused var

      // Set access token in cookies (HTTP-only)
      // const headers = new Headers();
      // headers.append(
      //   'Set-Cookie',
      //   serialize('accessToken', accessToken, {
      //     httpOnly: true,
      //     secure: process.env.NODE_ENV === 'production',
      //     maxAge: 60 * 30,
      //     path: '/'
      //   })
      // );

      const response = NextResponse.json({ success: true, user: userResponse });
response.cookies.set('accessToken', accessToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // less restrictive for cross-origin requests
  path: '/',
  domain: '.globe-trotter-nitrous.vercel.app', // note the dot for subdomain coverage
  maxAge: 7 * 24 * 60 * 60, // in seconds
});


      return response;
    }
  } catch (error: unknown) {
    // ✅ unknown instead of any
    console.error("Signup error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name?: string }).name === "ValidationError"
    ) {
      const validationErrors = Object.values(
        (error as unknown as { errors: Record<string, { message: string }> })
          .errors
      ).map((err) => err.message);
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred during signup",
      },
      { status: 500 }
    );
  }
}
