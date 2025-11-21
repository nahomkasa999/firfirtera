import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // For now, return all meals. In production, filter by user
    const allMeals = await prisma.mealRequest.findMany({
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
      orderBy: {
        mealTime: 'asc',
      },
    });

    // Split into organized and joined (for now, just return all as organized)
    // In production, filter based on authenticated user
    const organized = allMeals;
    const joined = allMeals.filter((meal) => meal.participants.length > 0);

    return NextResponse.json({ organized, joined });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      description,
      totalCost,
      splitAmount,
      requiredParticipants,
      mealTime,
      mealTimeText,
      restaurantId,
      menuItemId,
      genderPreferences,
    } = body;

    // For now, use a default user ID. In production, get from auth
    const defaultUserId = '123456789'; // From seed data

    const expiresAt = new Date(new Date(mealTime).getTime() - 2 * 60 * 60 * 1000); // 2 hours before

    const meal = await prisma.mealRequest.create({
      data: {
        organizerId: defaultUserId,
        description,
        totalCost: totalCost.toString(),
        splitAmount: splitAmount.toString(),
        requiredParticipants,
        mealTime: new Date(mealTime),
        mealTimeText: mealTimeText || null,
        restaurantId: restaurantId || null,
        menuItemId: menuItemId || null,
        genderPreferences: genderPreferences ? JSON.stringify(genderPreferences) : null,
        expiresAt,
        status: 'OPEN',
        currentParticipants: 1, // Organizer counts as first participant
      },
      include: {
        restaurant: true,
        menuItem: true,
      },
    });

    return NextResponse.json({ meal });
  } catch (error) {
    console.error('Error creating meal:', error);
    return NextResponse.json(
      { error: 'Failed to create meal' },
      { status: 500 }
    );
  }
}

