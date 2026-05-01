
import { NextResponse } from 'next/server';

import prisma from '../../../../lib/db';

export async function POST(request) {
  try {
    const { email, verified } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { verified: true },
    });
    
    return NextResponse.json(
      { message: 'User verified successfully', success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}