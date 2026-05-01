// src/components/Chatbot.jsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';

const dogData = [
  { name: "Thor", breed: "Bulldog", age: "3.7 years", gender: "MALE", location: "Hyderabad", contact: "+919876543233", owner: "Strong Paws" },
  { name: "Ruby", breed: "Indian Mongrel", age: "2.3 years", gender: "FEMALE", location: "Hyderabad", contact: "+919876543232", owner: "Open Shelter" },
  { name: "Bolt", breed: "Whippet", age: "1.8 years", gender: "MALE", location: "Hyderabad", contact: "+919876543231", owner: "Race Paws" },
  { name: "Chloe", breed: "Lhasa Apso", age: "1 year", gender: "FEMALE", location: "Hyderabad", contact: "+919876543230", owner: "Little Paws" },
  { name: "Shadow", breed: "Great Dane", age: "4 years", gender: "MALE", location: "Hyderabad", contact: "+919876543229", owner: "Big Dog Shelter" },
  { name: "Misty", breed: "Spitz", age: "7 months", gender: "FEMALE", location: "Hyderabad", contact: "+919876543228", owner: "Fluffy Friends" },
  { name: "Buddy", breed: "Indian Pariah", age: "2 years", gender: "MALE", location: "Hyderabad", contact: "+919876543227", owner: "Local Shelter" },
  { name: "Rosie", breed: "French Bulldog", age: "1.2 years", gender: "FEMALE", location: "Hyderabad", contact: "+919876543226", owner: "Tiny Tails" },
  { name: "Simba", breed: "Doberman", age: "3.5 years", gender: "MALE", location: "Hyderabad", contact: "+919876543225", owner: "WatchDog Shelter" },
  { name: "Nala", breed: "Chihuahua", age: "2 years", gender: "FEMALE", location: "Hyderabad", contact: "+919876543224", owner: "Cute Companions" },
  { name: "Rex", breed: "Rottweiler", age: "4 years", gender: "MALE", location: "Hyderabad", contact: "+919876543223", owner: "Guardian Paws" },
  { name: "Zoe", breed: "Cocker Spaniel", age: "6 months", gender: "FEMALE", location: "Hyderabad", contact: "+919876543222", owner: "Rescue Hub" },
  { name: "Oscar", breed: "Siberian Husky", age: "2.5 years", gender: "MALE", location: "Hyderabad", contact: "+919876543221", owner: "Snow Tails" },
  { name: "Coco", breed: "Pug", age: "1 year", gender: "FEMALE", location: "Hyderabad", contact: "+919876543220", owner: "Pet Planet" },
  { name: "Milo", breed: "Indie", age: "2 months", gender: "MALE", location: "Hyderabad", contact: "+919876543219", owner: "Stray Love" },
  { name: "Tiger", breed: "Boxer", age: "3 years", gender: "MALE", location: "Hyderabad", contact: "+919876543218", owner: "Doggy Den" },
  { name: "Luna", breed: "Shih Tzu", age: "1 year", gender: "FEMALE", location: "Hyderabad", contact: "+919876543217", owner: "Pet Pals" },
  { name: "Charlie", breed: "Dalmatian", age: "2.5 years", gender: "MALE", location: "Hyderabad", contact: "+919876543216", owner: "Animal Friends" },
  { name: "Bella", breed: "Pomeranian", age: "1.5 years", gender: "FEMALE", location: "Hyderabad", contact: "+919876543215", owner: "City Shelter" },
  { name: "Rocky", breed: "German Shepherd", age: "2 years", gender: "MALE", location: "Hyderabad", contact: "+919876543214", owner: "Happy Tails" }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: "Hi! I'm the AdoptAPaw assistant. I can help you with information about our dogs and the adoption process. What would you like to know?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    for (const dog of dogData) {
      if (lowerMessage.includes(dog.name.toLowerCase())) {
        return `${dog.name} is a ${dog.age} old ${dog.gender.toLowerCase()} ${dog.breed}. ${dog.gender === 'MALE' ? 'He' : 'She'} is currently at ${dog.owner} in ${dog.location}. For more information, you can contact ${dog.contact}.`;
      }
    }
    
    if (lowerMessage.includes('breed')) {
      const breeds = [...new Set(dogData.map(d => d.breed))];
      if (lowerMessage.includes('available') || lowerMessage.includes('what') || lowerMessage.includes('list')) {
        return `We have dogs of the following breeds available: ${breeds.join(', ')}.`;
      }
      for (const breed of breeds) {
        if (lowerMessage.includes(breed.toLowerCase())) {
          const breedDogs = dogData.filter(d => d.breed === breed);
          return `We have ${breedDogs.length} ${breed}(s) available: ${breedDogs.map(d => d.name).join(', ')}.`;
        }
      }
    }
    
    if (lowerMessage.includes('puppy') || lowerMessage.includes('puppies') || lowerMessage.includes('young')) {
      const puppies = dogData.filter(d => 
        d.age.includes('month') || 
        (d.age.includes('year') && parseFloat(d.age) <= 1)
      );
      if (puppies.length > 0) {
        return `We have ${puppies.length} young dogs/puppies: ${puppies.map(d => `${d.name} (${d.age})`).join(', ')}.`;
      }
      return "We don't have very young puppies at the moment, but we have several young dogs under 2 years old!";
    }
    
    if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('hyderabad')) {
      return "All our dogs are currently located in Hyderabad. You can visit them at their respective shelters after scheduling an appointment.";
    }
    
    if (lowerMessage.includes('adopt') || lowerMessage.includes('process') || lowerMessage.includes('how')) {
      if (lowerMessage.includes('how') || lowerMessage.includes('process')) {
        return "The adoption process is simple:\n1. Create an account and verify your identity with Aadhaar\n2. Browse available dogs and submit an application\n3. Our team will schedule a home visit to ensure suitability\n4. After approval, visit our office for final paperwork\n5. Take your new friend home!\n\nThe entire process typically takes 5-7 days.";
      }
      if (lowerMessage.includes('requirement') || lowerMessage.includes('eligible')) {
        return "To adopt, you must:\n• Be at least 18 years old\n• Have a stable housing situation\n• Complete identity verification\n• Pass the home visit inspection\n• Show commitment to pet care";
      }
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
      return "You can contact us at:\n📞 Phone: +91 8886676074\n📧 Email: info@bluecrossofhyd.org\n📍 Address: Blue Cross of Hyderabad, 403/9, Road No. 35, Jubilee Hills, Hyderabad";
    }
    
    if (lowerMessage.includes('home visit') || lowerMessage.includes('inspection')) {
      return "The home visit is a crucial step where our NGO partners visit your residence to ensure it's suitable for the dog you wish to adopt. They check for adequate space, safety, and your preparedness for pet care. This usually takes 30-45 minutes.";
    }
    
    if (lowerMessage.includes('cost') || lowerMessage.includes('fee') || lowerMessage.includes('price') || lowerMessage.includes('free')) {
      return "Adoption through AdoptAPaw is completely free! We believe every dog deserves a loving home. However, you'll be responsible for the dog's future care, including food, medical expenses, and grooming.";
    }
    
    if (lowerMessage.includes('male') || lowerMessage.includes('female')) {
      const males = dogData.filter(d => d.gender === 'MALE');
      const females = dogData.filter(d => d.gender === 'FEMALE');
      if (lowerMessage.includes('male') && !lowerMessage.includes('female')) {
        return `We have ${males.length} male dogs available. Some of them are: ${males.slice(0, 5).map(d => d.name).join(', ')}.`;
      }
      if (lowerMessage.includes('female')) {
        return `We have ${females.length} female dogs available. Some of them are: ${females.slice(0, 5).map(d => d.name).join(', ')}.`;
      }
    }
    
    if (lowerMessage.includes('available') || lowerMessage.includes('how many')) {
      const available = dogData.filter(d => d.name !== 'Rocky' && d.name !== 'Chloe'); // These are adopted
      return `We currently have ${available.length} dogs available for adoption! You can browse through all of them on this page. Each dog has unique personality and would make a wonderful companion.`;
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('what can')) {
      return "I can help you with:\n• Information about specific dogs (just mention their name)\n• Available breeds and their details\n• The adoption process and requirements\n• Contact information\n• Home visit details\n• Finding puppies or specific age groups\n\nJust ask me anything!";
    }
    
    return "I can help you with information about our dogs and adoption process. Try asking about:\n• A specific dog's details (e.g., 'Tell me about Rocky')\n• Available breeds\n• The adoption process\n• Requirements for adoption\n• Our contact information\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { type: 'user', text: inputValue }]);
      
      setTimeout(() => {
        const response = processMessage(inputValue);
        setMessages(prev => [...prev, { type: 'bot', text: response }]);
      }, 500);
      
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 flex items-center justify-center z-40"
          >
            <FiMessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl flex flex-col z-40"
          >
            <div className="bg-primary-600 text-white p-4 rounded-t-xl flex justify-between items-center">
              <div>
                <h3 className="font-semibold">AdoptAPaw Assistant</h3>
                <p className="text-xs opacity-90">Ask me anything!</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary-700 p-1 rounded"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={handleSend}
                  className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}