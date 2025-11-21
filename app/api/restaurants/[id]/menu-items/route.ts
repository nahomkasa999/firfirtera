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

    const { id: restaurantId } = await params;
    const body = await request.json();
    const { menuItems } = body;

    if (!Array.isArray(menuItems)) {
      return NextResponse.json(
        { error: 'menuItems must be an array' },
        { status: 400 }
      );
    }

    // Validate restaurant exists
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }

    // Validate menu items
    for (const item of menuItems) {
      if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Each menu item must have a valid name' },
          { status: 400 }
        );
      }
      if (item.price !== null && item.price !== undefined) {
        if (typeof item.price !== 'number' || item.price < 0) {
          return NextResponse.json(
            { error: 'Menu item price must be a non-negative number' },
            { status: 400 }
          );
        }
      }
    }

    // Create menu items in bulk
    const createdItems = await prisma.menuItem.createMany({
      data: menuItems.map((item) => ({
        restaurantId,
        name: item.name.trim(),
        price: item.price !== null && item.price !== undefined ? item.price : null,
        description: item.description?.trim() || null,
        imageUrl: item.imageUrl?.trim() || null,
        category: item.category || null,
      })),
    });

    // Fetch created items with their IDs
    const allMenuItems = await prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { createdAt: 'desc' },
      take: menuItems.length,
    });

    return NextResponse.json(
      { menuItems: allMenuItems, count: createdItems.count },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating menu items:', error);
    return NextResponse.json(
      { error: 'Failed to create menu items' },
      { status: 500 }
    );
  }
}

