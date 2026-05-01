import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '../../../../lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';
import { sendVerificationCode } from '../../../../lib/twilio';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const address = formData.get('address');
    const password = formData.get('password');
    const aadharImage = formData.get('aadharImage');
    
    if (!name || !email || !phone || !address || !password || !aadharImage) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    let aadharPicPath = '';
    
    if (aadharImage) {
      const bytes = await aadharImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const fileName = `${Date.now()}_${aadharImage.name.replace(/\s/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      try {
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        aadharPicPath = `/uploads/${fileName}`;
      } catch (error) {
        console.error('Error saving file:', error);
        return NextResponse.json(
          { message: 'Error uploading Aadhaar image' },
          { status: 500 }
        );
      }
    }
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        address,
        password: hashedPassword,
        aadharPic: aadharPicPath,
      },
    });
    
    try {
      await sendVerificationCode(phone);
    } catch (error) {
      console.error('Error sending verification code:', error);
    }
    
    return NextResponse.json(
      { message: 'User registered successfully', user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}