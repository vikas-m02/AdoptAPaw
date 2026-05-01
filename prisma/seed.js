// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await prisma.application.deleteMany({});
    await prisma.dog.deleteMany({});
    await prisma.user.deleteMany({});

    console.log("Creating admin user...");
    const adminPassword = await bcrypt.hash("admin", 10);

    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@adoptapaw.com",
        password: adminPassword,
        phone: "+919876543210",
        address: "AdoptAPaw HQ, Bangalore",
        verified: true,
        role: "ADMIN",
      },
    });

    console.log("Creating sample dogs...");
    const dogs = [
      {
        name: "Rocky",
        breed: "German Shepherd",
        age: "2 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543214",
        ownerName: "Happy Tails",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/79/232779-050-6B0411D7/German-Shepherd-dog-Alsatian.jpg",
      },
      {
        name: "Bella",
        breed: "Pomeranian",
        age: "1.5 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543215",
        ownerName: "City Shelter",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/41/233841-050-4FFECCF1/Pomeranian-dog.jpg",
      },
      {
        name: "Charlie",
        breed: "Dalmatian",
        age: "2.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543216",
        ownerName: "Animal Friends",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/47/236047-050-F06BFC5E/Dalmatian-dog.jpg",
      },
      {
        name: "Luna",
        breed: "Shih Tzu",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543217",
        ownerName: "Pet Pals",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/03/234203-050-C3D47B4B/Shih-tzu-dog.jpg",
      },
      {
        name: "Tiger",
        breed: "Boxer",
        age: "3 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543218",
        ownerName: "Doggy Den",
        status: "AVAILABLE",
        imageUrl: "https://media-be.chewy.com/wp-content/uploads/2021/04/18144454/iStock-1257560195-821x615.jpg",
      },
      {
        name: "Milo",
        breed: "Indie",
        age: "2 months",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543219",
        ownerName: "Stray Love",
        status: "AVAILABLE",
        imageUrl: "https://static.toiimg.com/thumb/imgsize-23456,msid-112428207,width-600,resizemode-4/112428207.jpg",
      },
      {
        name: "Coco",
        breed: "Pug",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543220",
        ownerName: "Pet Planet",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/34/233234-050-1649BFA9/Pug-dog.jpg",
      },
      {
        name: "Oscar",
        breed: "Siberian Husky",
        age: "2.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543221",
        ownerName: "Snow Tails",
        status: "AVAILABLE",
        imageUrl: "https://www.dogster.com/wp-content/uploads/2023/09/siberian-husky-dog-standing-on-grass_Edalin-Photography_Shutterstock.jpg",
      },
      {
        name: "Zoe",
        breed: "Cocker Spaniel",
        age: "6 months",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543222",
        ownerName: "Rescue Hub",
        status: "AVAILABLE",
        imageUrl: "https://a-us.storyblok.com/f/1016262/1104x676/01b6a4230e/cocker-spaniel.webp",
      },
      {
        name: "Rex",
        breed: "Rottweiler",
        age: "4 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543223",
        ownerName: "Guardian Paws",
        status: "AVAILABLE",
        imageUrl: "https://image.petmd.com/files/styles/978x550/public/2023-12/rottweiler.jpg",
      },
      {
        name: "Nala",
        breed: "Chihuahua",
        age: "2 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543224",
        ownerName: "Cute Companions",
        status: "AVAILABLE",
        imageUrl: "https://apupabove.com/cdn/shop/articles/Chihuahua_2ab3f5c4-9781-48ed-8119-7f780902c133_1200x1200.jpg?v=1742407300",
      },
      {
        name: "Simba",
        breed: "Doberman",
        age: "3.5 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543225",
        ownerName: "WatchDog Shelter",
        status: "AVAILABLE",
        imageUrl: "https://pet-health-content-media.chewy.com/wp-content/uploads/2024/09/11181054/202104doberman-pinscher-dog-breed.jpg",
      },
      {
        name: "Rosie",
        breed: "French Bulldog",
        age: "1.2 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543226",
        ownerName: "Tiny Tails",
        status: "AVAILABLE",
        imageUrl: "https://image.petmd.com/files/styles/978x550/public/2022-10/french-bulldog.jpeg",
      },
      {
        name: "Buddy",
        breed: "Indian Pariah",
        age: "2 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543227",
        ownerName: "Local Shelter",
        status: "AVAILABLE",
        imageUrl: "https://dccwebsiteimages.s3.ap-south-1.amazonaws.com/medium_Indian_Pariah_Dogs_b8911dd049.png",
      },
      {
        name: "Misty",
        breed: "Spitz",
        age: "7 months",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543228",
        ownerName: "Fluffy Friends",
        status: "AVAILABLE",
        imageUrl: "https://cdn.britannica.com/41/233841-050-4FFECCF1/Pomeranian-dog.jpg",
      },
      {
        name: "Shadow",
        breed: "Great Dane",
        age: "4 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543229",
        ownerName: "Big Dog Shelter",
        status: "AVAILABLE",
        imageUrl: "https://s3.amazonaws.com/cdn-origin-etr.akc.org/wp-content/uploads/2017/11/07141952/Great-Dane-standing-in-profile-outdoors1.jpg",
      },
      {
        name: "Chloe",
        breed: "Lhasa Apso",
        age: "1 year",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543230",
        ownerName: "Little Paws",
        status: "AVAILABLE",
        imageUrl: "https://lhasahappyhomes.org/wp-content/uploads/2014/10/Stetson12-940x600.jpg",
      },
      {
        name: "Bolt",
        breed: "Whippet",
        age: "1.8 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543231",
        ownerName: "Race Paws",
        status: "AVAILABLE",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMAWhU22hl84qKpHa9uWLMTBhtXFrIGFfu1Q&s",
      },
      {
        name: "Ruby",
        breed: "Indian Mongrel",
        age: "2.3 years",
        gender: "FEMALE",
        location: "Hyderabad",
        contactNumber: "+919876543232",
        ownerName: "Open Shelter",
        status: "AVAILABLE",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLQYYX2qMXsdn8YzHzXRrikwurqW0bTfcBpw&s",
      },
      {
        name: "Thor",
        breed: "Bulldog",
        age: "3.7 years",
        gender: "MALE",
        location: "Hyderabad",
        contactNumber: "+919876543233",
        ownerName: "Strong Paws",
        status: "AVAILABLE",
        imageUrl: "https://image.petmd.com/files/inline-images/english-bulldog-5.jpg?VersionId=1KyTFgo4HZwpAcjf.WZ8mM_2yt6f9Zc3",
      },
    ];

    for (const dog of dogs) {
      await prisma.dog.create({
        data: dog,
      });
    }

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});