import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../../lib/db';
import {sendApplicationUpdate} from '../../../../../lib/twilio';

export async function PATCH(request, { params }) {
  try {
    console.log("Starting application status update");
    const session = await getServerSession();
    
    if (!session) {
      console.log("No session found");
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
   
    const isAdmin = 
      session.user.role === 'ADMIN' || 
      session.user.email === 'admin@adoptapaw.com';
    
    if (!isAdmin) {
      console.log("Not admin", session.user);
      return NextResponse.json(
        { message: 'Forbidden - Admin role required' },
        { status: 403 }
      );
    }
    
    const applicationId = params.id;
    console.log("Processing application ID:", applicationId);
    
   
    const data = await request.json();
    console.log("Request data:", data);
    
    const { status, homeVisitDate, finalVisitDate } = data;
    
    const validStatuses = [
      'SUBMITTED',
      'HOME_VISIT_SCHEDULED',
      'HOME_VISIT_COMPLETED',
      'FINAL_VISIT_SCHEDULED',
      'COMPLETED',
      'REJECTED',
    ];
    
    if (!validStatuses.includes(status)) {
      console.log("Invalid status:", status);
      return NextResponse.json(
        { message: 'Invalid status value' },
        { status: 400 }
      );
    }
    
    
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: true,
        dog: true,
      },
    });
    
    if (!application) {
      console.log("Application not found");
      return NextResponse.json(
        { message: 'Application not found' },
        { status: 404 }
      );
    }
    
    console.log("Found application:", application.id);
    
    
    const updateData = { status };
    
    if (status === 'HOME_VISIT_SCHEDULED' && homeVisitDate) {
      updateData.homeVisitDate = new Date(homeVisitDate);
    }
    
    if (status === 'FINAL_VISIT_SCHEDULED' && finalVisitDate) {
      updateData.finalVisitDate = new Date(finalVisitDate);
    }
    
    if (status === 'COMPLETED') {
    
      await prisma.dog.update({
        where: { id: application.dogId },
        data: { status: 'ADOPTED' },
      });
      console.log("Updated dog status to ADOPTED");
    }
    
  
    console.log("Updating application with:", updateData);
    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        user: true,
        dog: true,
      },
    });
    
    console.log("Application updated successfully");
    
  
    try {
      if (application.user.phone) {
        console.log("Sending notification to:", application.user.phone);
        await sendApplicationUpdate(
          application.user.phone,
          status,
          application.dog.name
        );
        console.log("Notification sent");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    
    }
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.toString() },
      { status: 500 }
    );
  }
}