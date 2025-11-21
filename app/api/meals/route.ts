import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/userService';

export async function GET(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(prisma, request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Split into organized and joined based on authenticated user
    const organized = allMeals.filter((meal) => meal.organizerId === userId);
    const joined = allMeals.filter((meal) => 
      meal.participants.some((p) => p.userId === userId)
    );

    return NextResponse.json({ organized, joined });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(prisma, request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
      menuItemIds,
      genderPreferences,
    } = body;

    const expiresAt = new Date(new Date(mealTime).getTime() - 2 * 60 * 60 * 1000); // 2 hours before

    const meal = await prisma.mealRequest.create({
      data: {
        organizerId: userId,
        description,
        totalCost: totalCost.toString(),
        splitAmount: splitAmount.toString(),
        requiredParticipants,
        mealTime: new Date(mealTime),
        mealTimeText: mealTimeText || null,
        restaurantId: restaurantId || null,
        menuItemId: menuItemId || (menuItemIds && menuItemIds.length > 0 ? menuItemIds[0] : null), // Use first item if array provided
        genderPreferences: genderPreferences || null, // PostgreSQL Json type handles this directly
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

