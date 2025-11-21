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

    const user = await prisma.user.findUnique({
      where: { telegramId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        location: user.location,
        campus: user.campus,
        gender: user.gender,
        collegeYear: user.collegeYear,
        department: user.department,
        religion: user.religion,
      },
      noShowCount: user.noShowCount,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(prisma, request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const user = await prisma.user.update({
      where: { telegramId: userId },
      data: {
        location: body.location,
        campus: body.campus,
        gender: body.gender,
        collegeYear: body.collegeYear,
        department: body.department,
        religion: body.religion,
      },
    });

    return NextResponse.json({
      user: {
        id: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        location: user.location,
        campus: user.campus,
        gender: user.gender,
        collegeYear: user.collegeYear,
        department: user.department,
        religion: user.religion,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

