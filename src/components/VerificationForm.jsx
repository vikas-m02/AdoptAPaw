'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiLoader } from 'react-icons/fi';

export default function VerificationForm() {
  const router = useRouter();
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const [errors, setErrors] = useState('');
  
  useEffect(() => {
  
    const userEmail = localStorage.getItem('userEmail');
    
    const timer = setTimeout(() => {
      setVerificationStep(2);
      setVerificationProgress(40);
      
      const timer2 = setTimeout(() => {
        setVerificationStep(3);
        setVerificationProgress(75);
        
        const timer3 = setTimeout(() => {
          setVerificationStep(4);
          setVerificationProgress(100);
          
          
          if (userEmail) {
            updateVerificationStatus(userEmail);
          } else {
         
            console.warn('No email found in localStorage for verification');
            
            updateVerificationStatus(null);
          }
          
          const timer4 = setTimeout(() => {
            router.push('/home');
          }, 1500);
          
          return () => clearTimeout(timer4);
        }, 2000);
        
        return () => clearTimeout(timer3);
      }, 2000);
      
      return () => clearTimeout(timer2);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [router]);
  
  const updateVerificationStatus = async (email) => {
    try {
      
      if (email) {
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, verified: true }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log('Primary verification successful');
          return;
        }
      }
      
    
      const backupResponse = await fetch('/api/auth/backup-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      await backupResponse.json();
    } catch (error) {
      console.error('Error during verification:', error);
    }
  };
  
  const stepInfo = [
    {
      title: 'Initiating Verification',
      description: 'Preparing to verify your Aadhaar details',
      icon: <FiLoader className="animate-spin" />
    },
    {
      title: 'Validating Document',
      description: 'Checking document authenticity',
      icon: <FiLoader className="animate-spin" />
    },
    {
      title: 'Verifying Information',
      description: 'Matching user details with records',
      icon: <FiLoader className="animate-spin" />
    },
    {
      title: 'Verification Complete',
      description: 'Your identity has been verified successfully',
      icon: <FiCheck />
    }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto"
    >
      {errors && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded">
          {errors}
        </div>
      )}
      
      <div className="relative h-2 mb-8 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary-600"
          initial={{ width: '5%' }}
          animate={{ width: `${verificationProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="space-y-6">
        {stepInfo.map((step, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-lg border ${
              verificationStep > index
                ? 'bg-green-50 border-green-200'
                : verificationStep === index + 1
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: verificationStep >= index + 1 ? 1 : 0.5,
              y: 0
            }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                verificationStep > index
                  ? 'bg-green-500 text-white'
                  : verificationStep === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-white'
              }`}>
                {verificationStep > index ? (
                  <FiCheck className="h-5 w-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="ml-4">
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {verificationStep === 4 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheck className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verification Successful!
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been verified. Redirecting you to find your new furry friend...
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}