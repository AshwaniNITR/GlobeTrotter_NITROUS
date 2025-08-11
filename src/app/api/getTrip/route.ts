import { NextResponse } from 'next/server';
import dbConnect from '../../../../dbConnect/dbConnect';
import Trip from '../../../../models/trip';

export async function GET(request: Request) {
    try {
        await dbConnect();

        // Extract userEmail from query parameters
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('userEmail');

        if (!userEmail) {
            return NextResponse.json(
                { success: false, error: 'userEmail query parameter is required' },
                { status: 400 }
            );
        }

        // Fetch trips filtered by userEmail and sorted by newest first
        const trips = await Trip.find({ userEmail })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ success: true, trips });
    } catch (error: unknown) {
        console.error('Error fetching trips:', error);
        let errorMessage = 'Failed to fetch trips';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}