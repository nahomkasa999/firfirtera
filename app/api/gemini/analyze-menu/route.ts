import { NextRequest, NextResponse } from 'next/server';
import { analyzeMenuImage } from '@/lib/gemini';
import { prisma } from '@/lib/db';
import { getAuthenticatedUserId } from '@/lib/userService';

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId(prisma, request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload JPEG, PNG, or WEBP image.' },
        { status: 400 }
      );
    }

    // Validate file size (20MB limit for inline data)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 20MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Analyze menu image
    const menuItems = await analyzeMenuImage(base64Image, file.type);

    if (menuItems.length === 0) {
      return NextResponse.json(
        { error: 'No menu items found in the image. Please try a different image.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ menuItems });
  } catch (error: any) {
    console.error('Error in analyze-menu route:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    });
    
    // Return more specific error messages
    let errorMessage = error.message || 'Failed to analyze menu image';
    let statusCode = 500;
    
    // Check for specific error types
    if (error.message?.includes('GEMINI_API_KEY') || error.message?.includes('not set')) {
      errorMessage = 'Gemini API key is not configured. Please check your environment variables.';
      statusCode = 500;
    } else if (error.message?.includes('API key') || error.message?.includes('invalid') || error.message?.includes('unauthorized')) {
      errorMessage = 'Invalid Gemini API key. Please check your configuration.';
      statusCode = 401;
    } else if (error.message?.includes('quota') || error.message?.includes('limit') || error.message?.includes('rate limit')) {
      errorMessage = 'API quota exceeded. Please try again later.';
      statusCode = 429;
    } else if (error.message?.includes('model') || error.message?.includes('not found')) {
      errorMessage = 'The selected Gemini model is not available. Please try a different model.';
      statusCode = 400;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: statusCode }
    );
  }
}

