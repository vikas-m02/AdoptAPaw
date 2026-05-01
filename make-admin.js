
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function makeAdmin() {
  try {
   
    await prisma.user.upsert({
      where: { email: 'admin@adoptapaw.com' },
      update: {
        role: 'ADMIN',
        verified: true
      },
      create: {
        name: 'Admin User',
        email: 'admin@adoptapaw.com',
        password: await require('bcryptjs').hash('admin', 10),
        phone: '+919876543210',
        address: 'AdoptAPaw HQ, Bangalore',
        verified: true,
        role: 'ADMIN'
      }
    });
    

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@adoptapaw.com' }
    });
    
    console.log('Admin account:', admin);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

makeAdmin();