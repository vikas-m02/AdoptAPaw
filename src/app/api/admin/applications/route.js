import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/db';


export async function GET(request) {
  try {
    const session = await getServerSession();
    
    console.log("Admin API session:", session);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
  
    const isAdmin = 
      session.user.role === 'ADMIN' || 
      session.user.email === 'admin@adoptapaw.com';
    
    if (!isAdmin) {
      return NextResponse.json(
        { message: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }
    
 
    const applicationCount = await prisma.application.count();
    
    if (applicationCount === 0) {
   
      await createSampleApplications();
    }
    
    const applications = await prisma.application.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            verified: true,
          },
        },
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
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}


async function createSampleApplications() {
  try {
    
    const user = await prisma.user.findFirst({
      where: {
        role: 'USER'
      }
    });
    
   
    const dog = await prisma.dog.findFirst({
      where: {
        status: 'AVAILABLE'
      }
    });
    
    if (!user || !dog) {
      console.log('Cannot create sample applications: no users or available dogs found');
      return;
    }
    
    
    await prisma.application.create({
      data: {
        userId: user.id,
        dogId: dog.id,
        status: 'SUBMITTED',
      }
    });
    
    console.log('Created sample application for testing');
  } catch (error) {
    console.error('Error creating sample application:', error);
  }
}