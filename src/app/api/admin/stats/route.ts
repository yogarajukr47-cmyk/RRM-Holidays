import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET: Dashboard stats (admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user as { role?: string }).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [
      totalUsers,
      totalBookings,
      totalEnquiries,
      totalReviews,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      newEnquiries,
      pendingReviews,
      totalRevenue,
    ] = await Promise.all([
      db.user.count(),
      db.booking.count(),
      db.enquiry.count(),
      db.review.count(),
      db.booking.count({ where: { status: 'pending' } }),
      db.booking.count({ where: { status: 'confirmed' } }),
      db.booking.count({ where: { status: 'completed' } }),
      db.booking.count({ where: { status: 'cancelled' } }),
      db.enquiry.count({ where: { status: 'new' } }),
      db.review.count({ where: { isApproved: false } }),
      db.booking.aggregate({
        where: { status: 'completed' },
        _sum: { totalPrice: true },
      }),
    ]);

    const recentBookings = await db.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });

    const recentEnquiries = await db.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      totalUsers,
      totalBookings,
      totalEnquiries,
      totalReviews,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      newEnquiries,
      pendingReviews,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentBookings,
      recentEnquiries,
    });
  } catch (error: unknown) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
