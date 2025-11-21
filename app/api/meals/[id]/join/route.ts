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

    // Check if meal exists
    const meal = await prisma.mealRequest.findUnique({
      where: { id: mealId },
    });

    if (!meal) {
      return NextResponse.json(
        { error: 'Meal not found' },
        { status: 404 }
      );
    }

    // Check if user is the organizer (organizer is already a participant)
    if (meal.organizerId === userId) {
      return NextResponse.json(
        { error: 'You are already the organizer of this meal' },
        { status: 400 }
      );
    }

    // Check if already a participant
    const existingParticipant = await prisma.participant.findUnique({
      where: {
        mealRequestId_userId: {
          mealRequestId: mealId,
          userId: userId,
        },
      },
    });

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Already joined this meal' },
        { status: 400 }
      );
    }

    // Check if meal is full
    if (meal.currentParticipants >= meal.requiredParticipants) {
      return NextResponse.json(
        { error: 'Meal is full' },
        { status: 400 }
      );
    }

    // Add participant
    await prisma.participant.create({
      data: {
        mealRequestId: mealId,
        userId: userId,
        status: 'PENDING',
      },
    });

    // Update meal participant count
    const updatedMeal = await prisma.mealRequest.update({
      where: { id: mealId },
      data: {
        currentParticipants: meal.currentParticipants + 1,
        status:
          meal.currentParticipants + 1 >= meal.requiredParticipants
            ? 'FULL'
            : meal.status,
      },
    });

    return NextResponse.json({ success: true, meal: updatedMeal });
  } catch (error) {
    console.error('Error joining meal:', error);
    return NextResponse.json(
      { error: 'Failed to join meal' },
      { status: 500 }
    );
  }
}

