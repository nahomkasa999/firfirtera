import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mealId = params.id;
    // For now, use a default user ID. In production, get from auth
    const defaultUserId = '123456789'; // From seed data

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
    if (meal.organizerId !== defaultUserId) {
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

