
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;


const SIMULATE_SMS = process.env.SIMULATE_SMS === 'true';


const TWILIO_VERIFIED_NUMBERS = process.env.TWILIO_VERIFIED_NUMBERS 
  ? process.env.TWILIO_VERIFIED_NUMBERS.split(',') 
  : [];

let client;

try {
  if (accountSid && authToken && !SIMULATE_SMS) {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully');
  } else {
    console.log(SIMULATE_SMS 
      ? 'SMS simulation mode enabled' 
      : 'Twilio credentials not provided, using simulation mode');
  }
} catch (error) {
  console.error('Failed to initialize Twilio client:', error);
}

/**
 
 * @param {string} phoneNumber 
 * @returns {string} 
 */
function formatPhoneNumber(phoneNumber) {
  
  const digits = phoneNumber.replace(/\D/g, '');
  
  
  if (!phoneNumber.startsWith('+')) {
    return `+91${digits}`;
  }
  
  
  if (!phoneNumber.startsWith('+91')) {
    return `+91${digits.substring(digits.length > 10 ? digits.length - 10 : 0)}`;
  }
  
  return phoneNumber;
}

/**
 
 * @param {string} to 
 * @param {string} message 
 * @returns {Promise<Object>} 
 */
export async function sendSMS(to, message) {
  
  const formattedPhone = formatPhoneNumber(to);
  

  const isFreeVerifiedNumber = TWILIO_VERIFIED_NUMBERS.includes(formattedPhone);
  const shouldSimulate = SIMULATE_SMS || 
                        !client || 
                        (TWILIO_VERIFIED_NUMBERS.length > 0 && !isFreeVerifiedNumber);
  

  if (shouldSimulate) {
    console.log(`SIMULATED SMS to ${formattedPhone}: ${message}`);
    return { success: true, simulated: true };
  }

  try {
    console.log(`Attempting to send SMS to ${formattedPhone}`);
    const result = await client.messages.create({
      body: message,
      from: fromNumber,
      to: formattedPhone
    });
    
    console.log(`SMS sent successfully, SID: ${result.sid}`);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Failed to send SMS:', error);

    console.log(`SIMULATED SMS (after error) to ${formattedPhone}: ${message}`);
    return { 
      success: false, 
      simulated: true, 
      error: error.message 
    };
  }
}

/**
 
 * @param {string} phoneNumber 
 * @returns {Promise<number>} 
 */
export async function sendVerificationCode(phoneNumber) {
  const code = Math.floor(100000 + Math.random() * 900000);
  const message = `Your AdoptAPaw verification code is: ${code}`;
  
  await sendSMS(phoneNumber, message);
  
  return code;
}

/**

 * @param {string} phoneNumber 
 * @param {string} status 
 * @param {string} dogName 
 * @returns {Promise<Object>} 
 */
export async function sendApplicationUpdate(phoneNumber, status, dogName) {
  let message;
  
  switch (status) {
    case 'SUBMITTED':
      message = `Your adoption application for ${dogName} has been received. We'll contact you soon to schedule a home visit.`;
      break;
    case 'HOME_VISIT_SCHEDULED':
      message = `Your home visit for the adoption of ${dogName} has been scheduled. Please prepare for the visit.`;
      break;
    case 'HOME_VISIT_COMPLETED':
      message = `Great news! Your home visit for ${dogName}'s adoption has been completed. We'll schedule your final visit soon.`;
      break;
    case 'FINAL_VISIT_SCHEDULED':
      message = `Your final visit to complete ${dogName}'s adoption has been scheduled. Please bring all required documents.`;
      break;
    case 'COMPLETED':
      message = `Congratulations! Your adoption of ${dogName} is now complete. Welcome to the AdoptAPaw family!`;
      break;
    case 'REJECTED':
      message = `We regret to inform you that your application for ${dogName} has been declined. Please contact us for more information.`;
      break;
    default:
      message = `There's an update on your adoption application for ${dogName}. Please check your account for details.`;
  }
  
  return await sendSMS(phoneNumber, message);
}