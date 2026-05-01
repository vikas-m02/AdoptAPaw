'use client';

import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiCalendar, FiHome } from 'react-icons/fi';

export default function StatusBar({ currentStatus }) {
  const statusSteps = [
    {
      id: 'SUBMITTED',
      title: 'Application Submitted',
      description: 'We have received your application',
      icon: <FiCheckCircle className="h-6 w-6" />
    },
    {
      id: 'HOME_VISIT_SCHEDULED',
      title: 'Home Visit Scheduled',
      description: 'NGO officials will visit your home soon',
      icon: <FiCalendar className="h-6 w-6" />
    },
    {
      id: 'HOME_VISIT_COMPLETED',
      title: 'Home Visit Completed',
      description: 'Your home has been verified',
      icon: <FiHome className="h-6 w-6" />
    },
    {
      id: 'FINAL_VISIT_SCHEDULED',
      title: 'Final Visit Scheduled',
      description: 'Visit NGO office for paperwork & collection',
      icon: <FiClock className="h-6 w-6" />
    },
    {
      id: 'COMPLETED',
      title: 'Adoption Complete',
      description: 'Welcome to the family!',
      icon: <FiCheckCircle className="h-6 w-6" />
    }
  ];
  
  const currentStepIndex = statusSteps.findIndex(step => step.id === currentStatus);
  
  const calculateProgress = () => {
    if (currentStatus === 'REJECTED') return 0;
    if (currentStepIndex === -1) return 0;
    return (currentStepIndex + 1) * (100 / statusSteps.length);
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      {currentStatus === 'REJECTED' ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p className="font-bold">Application Rejected</p>
          <p>We're sorry, but your application has been declined. Please contact our support team for more information.</p>
        </div>
      ) : (
        <>
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary-600"
              initial={{ width: '0%' }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <div className="space-y-8 flex flex-col items-center">
            {statusSteps.map((step, index) => {
              const isActive = currentStepIndex >= index;
              const isCurrentStep = currentStepIndex === index;
              
              return (
                <motion.div
                  key={step.id}
                  className={`w-full flex flex-col items-center ${
                    index < statusSteps.length - 1 ? 'pb-8 relative' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                 
                  
                  <div className={`flex items-center justify-center rounded-full w-14 h-14 flex-shrink-0 z-10 ${
                    isActive
                      ? isCurrentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className={`font-bold text-lg ${
                      isActive ? 'text-gray-800' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`${
                      isActive ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}