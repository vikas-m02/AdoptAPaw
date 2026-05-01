
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '../../../../lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const session = await getServerSession();
    
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
    
    const formData = await request.formData();
    
    
    const name = formData.get('name');
    const breed = formData.get('breed');
    const age = formData.get('age');
    const gender = formData.get('gender');
    const location = formData.get('location');
    const contactNumber = formData.get('contactNumber');
    const ownerName = formData.get('ownerName');
    const status = formData.get('status');
    const dogImage = formData.get('dogImage');
    let imageUrl = formData.get('imageUrl') || '/images/dog-placeholder.jpg';
    
   
    const requiredFields = ['name', 'breed', 'age', 'gender', 'location', 'contactNumber', 'ownerName', 'status'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    
    if (dogImage && dogImage.size > 0) {
      const bytes = await dogImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `dog_${Date.now()}_${dogImage.name.replace(/\s/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        imageUrl = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Error saving dog image:', error);
       
      }
    }
    
  
    const newDog = await prisma.dog.create({
      data: {
        name,
        breed,
        age,
        gender,
        location,
        contactNumber,
        ownerName,
        status,
        imageUrl,
      },
    });
    
    return NextResponse.json(newDog, { status: 201 });
  } catch (error) {
    console.error('Error adding dog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}