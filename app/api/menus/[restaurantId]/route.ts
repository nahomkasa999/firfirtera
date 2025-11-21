import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { restaurantId: string } }
) {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { restaurantId: params.restaurantId },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

