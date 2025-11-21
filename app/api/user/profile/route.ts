import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // For now, return a default user. In production, get from auth
    const defaultUserId = '123456789'; // From seed data

    const user = await prisma.user.findUnique({
      where: { telegramId: defaultUserId },
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

export async function PUT(request: Request) {
  try {
    // For now, use default user. In production, get from auth
    const defaultUserId = '123456789';
    const body = await request.json();

    const user = await prisma.user.update({
      where: { telegramId: defaultUserId },
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

