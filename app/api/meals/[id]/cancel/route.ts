import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/userService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = await getAuthenticatedUserId(prisma, request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: mealId } = await params;

    const meal = await prisma.mealRequest.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    // Check if user is the organizer
    if (meal.organizerId !== userId) {
      return NextResponse.json(
        { error: 'Only the organizer can cancel this meal' },
        { status: 403 }
      );
    }

    // Update meal status
    const updatedMeal = await prisma.mealRequest.update({
      where: { id: mealId },
      data: {
        status: 'CANCELLED',
      },
    });

    return NextResponse.json({ success: true, meal: updatedMeal });
  } catch (error) {
    console.error('Error cancelling meal:', error);
    return NextResponse.json(
      { error: 'Failed to cancel meal' },
      { status: 500 }
    );
  }
}

