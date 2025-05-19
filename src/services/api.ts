const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://vip-ride-backend.onrender.com' 
  : 'http://localhost:3000';

export const API_ENDPOINTS = {
  payment: `${API_BASE_URL}/api/payment`,
  booking: `${API_BASE_URL}/api/booking`,
  contact: `${API_BASE_URL}/api/contact`
}; 