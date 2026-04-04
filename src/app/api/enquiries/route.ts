import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: User's enquiries
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enquiries = await db.enquiry.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(enquiries);
  } catch (error: unknown) {
    console.error('Get enquiries error:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

// POST: Submit enquiry
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { name, email, phone, destination, travelDate, travellers, message } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    const enquiry = await db.enquiry.create({
      data: {
        userId: session?.user?.id || null,
        name,
        email: email || null,
        phone: phone || null,
        destination: destination || null,
        travelDate: travelDate || null,
        travellers: travellers || null,
        message: message || null,
        status: 'new',
      },
    });

    return NextResponse.json(enquiry, { status: 201 });
  } catch (error: unknown) {
    console.error('Create enquiry error:', error);
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 });
  }
}
