'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiUser, FiCalendar, FiInfo } from 'react-icons/fi';

export default function DogCard({ dog, isAdmin }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="card h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] w-full bg-gray-300">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 object-cover">
          <img
            src={dog.imageUrl}
            alt={dog.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent rounded-t-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-70' : 'opacity-50'
          }`}
        />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white">{dog.name}</h3>
          <p className="text-white/90">{dog.breed}</p>
        </div>
        {dog.status === 'ADOPTED' && (
          <div className="absolute top-4 right-4 bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            Adopted
          </div>
        )}
      </div>

      <div className="p-4 h-[220px] space-y-3">
        <div className="flex items-center text-gray-600">
          <FiCalendar className="h-4 w-4 mr-2" />
          <span>{dog.age}</span>
          <span className="mx-2">•</span>
          <span>{dog.gender === 'MALE' ? 'Male' : 'Female'}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FiMapPin className="h-4 w-4 mr-2" />
          <span>{dog.location}</span>
        </div>

        <div className="flex items-center text-gray-600">
          <FiUser className="h-4 w-4 mr-2" />
          <span>{dog.ownerName}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <FiPhone className="h-4 w-4 mr-2" />
          <span>{dog.contactNumber}</span>
        </div>

        {isAdmin ? (
       
          <button
            disabled
            className="w-full py-2 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed mt-0"
          >
            {dog.status === 'AVAILABLE' ? 'Available' : 'Adopted'}
          </button>
        ) : (
    
          dog.status === 'AVAILABLE' ? (
            <Link
              href={`/application/${dog.id}`}
              className="btn-primary w-full text-center mt-0 block"
            >
              Adopt Me
            </Link>
          ) : (
            <button
              disabled
              className="w-full py-2 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed mt-0"
            >
              Already Adopted
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}