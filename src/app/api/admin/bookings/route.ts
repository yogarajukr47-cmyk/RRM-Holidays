import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: All bookings (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await db.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true, phone: true } } },
    });

    return NextResponse.json(bookings);
  } catch (error: unknown) {
    console.error('Admin get bookings error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// PUT: Update booking status (admin)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, adminNotes, totalPrice } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    const updateData: Record<string, unknown> = { status };
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (totalPrice !== undefined) updateData.totalPrice = Number(totalPrice);

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(booking);
  } catch (error: unknown) {
    console.error('Admin update booking error:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
