import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const meal = await prisma.mealRequest.findUnique({
      where: { id },
      include: {
        restaurant: true,
        menuItem: true,
        organizer: {
          select: {
            telegramId: true,
            username: true,
            firstName: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                telegramId: true,
                username: true,
                firstName: true,
              },
            },
          },
        },
      },
    });

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ meal });
  } catch (error) {
    console.error('Error fetching meal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meal' },
      { status: 500 }
    );
  }
}

