import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Approved reviews (public)
export async function GET() {
  try {
    const reviews = await db.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reviews);
  } catch (error: unknown) {
    console.error('Get reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

// POST: Submit review (auth required)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trip, rating, quote, name } = body;

    if (!trip || !rating || !quote || !name) {
      return NextResponse.json(
        { error: 'Trip, rating, quote, and name are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    const review = await db.review.create({
      data: {
        userId: session.user.id,
        trip,
        rating: Number(rating),
        quote,
        name,
        isApproved: false,
      },
    });

    return NextResponse.json(
      { message: 'Review submitted! It will appear after approval.', review },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Create review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
