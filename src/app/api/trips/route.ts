// import { NextResponse } from 'next/server';
// import dbConnect from '../../../../dbConnect/dbConnect';
// import Trip from '../../../../models/trip';

// export async function POST(request: Request) {
//   try {
//     await dbConnect();
//     const data = await request.json();
    
//     const trip = await Trip.create(data);
    
//     return NextResponse.json({ 
//       success: true,
//       tripId: trip._id.toString() 
//     });
//   } catch (error: any) {
//     console.error('Error creating trip:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Failed to create trip' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     await dbConnect();
//     const { searchParams } = new URL(request.url);
//     const tripId = searchParams.get('id');
//     const data = await request.json();
    
//     if (!tripId) {
//       return NextResponse.json(
//         { success: false, error: 'Trip ID is required' },
//         { status: 400 }
//       );
//     }

//     const updatedTrip = await Trip.findByIdAndUpdate(
//       tripId,
//       { $set: data },
//       { new: true }
//     );

//     if (!updatedTrip) {
//       return NextResponse.json(
//         { success: false, error: 'Trip not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json({ 
//       success: true,
//       tripId: updatedTrip._id.toString() 
//     });
//   } catch (error: any) {
//     console.error('Error updating trip:', error);
//     return NextResponse.json(
//       { success: false, error: error.message || 'Failed to update trip' },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from 'next/server';
import dbConnect from '../../../../dbConnect/dbConnect';
// If you meant to use the Trip model, import from the models directory:
import Trip from '../../../../models/trip';
import type { CreateTripRequest, ApiResponse, TripDocument } from '../../../../types/trips';

export async function POST(request: Request): Promise<NextResponse<ApiResponse<{ tripId: string }>>> {
  try {
    await dbConnect();
    const data = await request.json() as CreateTripRequest;
    
    const trip = await Trip.create(data);
    
    return NextResponse.json({ 
      success: true,
      data: {
        tripId: trip._id.toString() 
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create trip';
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request): Promise<NextResponse<ApiResponse<{ tripId: string }>>> {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('id');
    const data = await request.json() as Partial<CreateTripRequest>;
    
    if (!tripId) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      tripId,
      { $set: data },
      { new: true }
    );

    if (!updatedTrip) {
      return NextResponse.json(
        { success: false, error: 'Trip not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      data: {
        tripId: updatedTrip._id.toString() 
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update trip';
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}