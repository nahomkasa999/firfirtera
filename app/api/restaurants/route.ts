import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/userService';

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      include: {
        menuItems: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurants' },
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
    const { name, location } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Restaurant name is required' },
        { status: 400 }
      );
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        name: name.trim(),
        location: location?.trim() || null,
      },
      include: {
        menuItems: true,
      },
    });

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}

