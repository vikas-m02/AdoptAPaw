import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../lib/db';
import { sendApplicationUpdate } from '../../../lib/twilio';

export async function GET(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const url = new URL(request.url);
    const dogId = url.searchParams.get('dogId');
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    const query = { userId: user.id };
    
    if (dogId) {
      query.dogId = dogId;
    }
    
    const applications = await prisma.application.findMany({
      where: query,
      include: {
        dog: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { dogId } = await request.json();
    
    if (!dogId) {
      return NextResponse.json(
        { message: 'Dog ID is required' },
        { status: 400 }
      );
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    if (!user.verified) {
      return NextResponse.json(
        { message: 'Account is not verified' },
        { status: 400 }
      );
    }
    
    const dog = await prisma.dog.findUnique({
      where: { id: dogId },
    });
    
    if (!dog) {
      return NextResponse.json(
        { message: 'Dog not found' },
        { status: 404 }
      );
    }
    
    if (dog.status !== 'AVAILABLE') {
      return NextResponse.json(
        { message: 'This dog is not available for adoption' },
        { status: 400 }
      );
    }
    
    const existingApplication = await prisma.application.findFirst({
      where: {
        userId: user.id,
        dogId: dog.id,
      },
    });
    
    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied to adopt this dog' },
        { status: 400 }
      );
    }
    
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        dogId: dog.id,
        status: 'SUBMITTED',
      },
      include: {
        dog: true,
      },
    });
    
    try {
      await sendApplicationUpdate(user.phone, 'SUBMITTED', dog.name);
    } catch (error) {
      console.error('Error sending SMS notification:', error);
    }
    
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}