import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import User from '../../../../models/userModel';
import connectMongo from '../../../../dbConnect/dbConnect';
import { OAuth2Client } from 'google-auth-library';
import { generateTokens } from '../../../../helpers/getToken';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    await connectMongo();
    const reqBody = await request.json();
    const { email, password, googleToken } = reqBody;

    if (googleToken) {
      // Google OAuth login flow
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload?.email_verified || !payload.email) {
        return NextResponse.json(
          { error: 'Google account not verified or email missing' },
          { status: 401 }
        );
      }

      const googleEmail = payload.email.toLowerCase();

      // Find existing user by email or Google ID
      const existingUser = await User.findOne({
        $or: [
          { email: googleEmail },
          { googleId: payload.sub }
        ]
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: 'No account found. Please sign up first.' },
          { status: 404 }
        );
      }

      // Check if user signed up with email but trying to login with Google
      if (existingUser.authProvider === 'email' && !existingUser.googleId) {
        return NextResponse.json(
          { 
            error: 'Account exists with email/password. Please login with your password or link your Google account.',
            provider: 'email'
          },
          { status: 409 }
        );
      }

      // Update Google ID if user exists but doesn't have it stored
      if (!existingUser.googleId && existingUser.authProvider === 'google') {
        existingUser.googleId = payload.sub;
        await existingUser.save();
      }

      // Generate new tokens
      const tokenPayload = {
        userId: existingUser._id.toString(),
        email: existingUser.email,
        username: existingUser.username
      };

      const { accessToken, refreshToken } = generateTokens(tokenPayload);

      // Store new refresh token in database
      existingUser.refreshToken = refreshToken;
      await existingUser.save();

      // Set refresh token as httpOnly cookie
      const response = NextResponse.json({
        success: true,
        message: 'Google login successful',
        accessToken,
        user: {
          id: existingUser._id,
          email: existingUser.email,
          username: existingUser.username,
          isVerified: existingUser.isVerified,
          profilePicture: existingUser.profilePicture
        }
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return response;

    } else {
      // Regular email/password login flow
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      
      console.log(`Email: ${email}, Password: ${password}`);
      const normalizedEmail = email.toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select('+password +refreshToken');
      console.log(`User found: ${user ? 'Yes' : 'No'}`);
      console.log(user);

      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Check if user signed up with Google but trying to login with password
      if (user.authProvider === 'google' && !user.password) {
        return NextResponse.json(
          { 
            error: 'Account exists with Google. Please login with Google.',
            provider: 'google'
          },
          { status: 409 }
        );
      }

      // Verify password
      if (!user.password) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Optional: Check if email is verified
      if (!user.isVerified) {
        return NextResponse.json(
          { 
            error: 'Please verify your email before logging in',
            needsVerification: true
          },
          { status: 403 }
        );
      }

      // Generate new tokens
      const tokenPayload = {
        userId: user._id.toString(),
        email: user.email,
        username: user.username
      };

      const { accessToken, refreshToken } = generateTokens(tokenPayload);

      // Store new refresh token in database
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as httpOnly cookie
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        accessToken,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified,
          profilePicture: user.profilePicture
        }
      });

      response.cookies.set('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return response;
    }
  } catch (error: unknown) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during login',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}