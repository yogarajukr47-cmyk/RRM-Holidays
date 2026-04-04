import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Single booking
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const booking = await db.booking.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error: unknown) {
    console.error('Get booking error:', error);
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

// PUT: Update booking (cancel)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Only allow cancelling pending bookings
    if (status === 'cancelled') {
      const existing = await db.booking.findFirst({
        where: { id, userId: session.user.id },
      });

      if (!existing) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      }

      if (existing.status !== 'pending') {
        return NextResponse.json(
          { error: 'Only pending bookings can be cancelled' },
          { status: 400 }
        );
      }
    }

    const booking = await db.booking.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(booking);
  } catch (error: unknown) {
    console.error('Update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
