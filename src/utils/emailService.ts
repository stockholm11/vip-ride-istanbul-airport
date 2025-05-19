import { TransferType } from '../data/vehicles';

interface EmailData {
  recipientEmail: string;
  recipientName: string;
  bookingReference: string;
  fromLocation: string;
  toLocation: string;
  date: string;
  time: string;
  passengers: number;
  vehicle: string;
  price: number;
  currency?: string;
  roundTrip?: boolean;
  returnDate?: string;
  returnTime?: string;
}

/**
 * Sends a booking confirmation email to the customer
 *
 * Note: In a real production environment, this would connect to a proper email
 * service like SendGrid, Mailchimp, AWS SES, etc. For this demonstration, we're
 * simulating email sending with a console log and a Promise that resolves
 * after a short delay.
 */
export const sendBookingConfirmationEmail = async (data: EmailData): Promise<boolean> => {
  try {
    console.log(`[Email Service] Sending booking confirmation to ${data.recipientEmail}`);

    // Here we'd normally connect to an email service API
    // For demo purposes, we'll just simulate the API call with a delay

    // Simulating the email content for testing purposes
    const emailContent = generateBookingConfirmationEmail(data);
    console.log('[Email Service] Email content preview:');
    console.log('----------------------------------------');
    console.log(emailContent);
    console.log('----------------------------------------');

    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`[Email Service] Email successfully sent to ${data.recipientEmail}`);
    return true;
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    return false;
  }
};

/**
 * Helper function to generate the email content
 */
const generateBookingConfirmationEmail = (data: EmailData): string => {
  const {
    recipientName,
    bookingReference,
    fromLocation,
    toLocation,
    date,
    time,
    passengers,
    vehicle,
    price,
    currency = '€',
    roundTrip,
    returnDate,
    returnTime
  } = data;

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);

  // Generate email content
  return `
Subject: VIP Ride Istanbul Airport - Your Booking Confirmation #${bookingReference}

Dear ${recipientName},

Thank you for booking with VIP Ride Istanbul Airport. Your reservation has been confirmed!

BOOKING DETAILS:
--------------------------
Booking Reference: ${bookingReference}
Route: ${fromLocation} → ${toLocation}
Date: ${formatDateForEmail(date)}
Time: ${time}
Vehicle: ${vehicle}
Passengers: ${passengers}
${roundTrip ? `Return Date: ${formatDateForEmail(returnDate || '')}
Return Time: ${returnTime || ''}` : ''}

Total Price: ${formattedPrice}

WHAT'S NEXT:
--------------------------
Our driver will meet you at the specified location. They will be holding a sign with your name.
Please ensure you have your booking reference available.

If you need to modify your booking or have any questions, please contact us at:
• Phone: +90 555 123 4567
• Email: support@vipride-istanbul.com

We look forward to providing you with a comfortable and luxurious transportation experience.

Best regards,
VIP Ride Istanbul Airport Team
  `;
};

/**
 * Format date for email display
 */
const formatDateForEmail = (dateString: string): string => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Generate a unique booking reference
 */
export const generateBookingReference = (): string => {
  const prefix = 'VIP';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${timestamp}-${random}`;
};
