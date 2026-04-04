import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: All reviews (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const reviews = await db.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    return NextResponse.json(reviews);
  } catch (error: unknown) {
    console.error('Admin get reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// PUT: Approve/reject review (admin)
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isApproved } = body;

    if (!id || isApproved === undefined) {
      return NextResponse.json(
        { error: 'Review ID and approval status are required' },
        { status: 400 }
      );
    }

    const review = await db.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json(review);
  } catch (error: unknown) {
    console.error('Admin update review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
