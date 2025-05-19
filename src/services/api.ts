// API base URL for production and development
const API_BASE_URL = 'https://vip-ride-backend.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  payment: `${API_BASE_URL}/api/payment`,
  booking: `${API_BASE_URL}/api/booking`,
  contact: `${API_BASE_URL}/api/contact`
};

// Export the base URL for direct use if needed
export { API_BASE_URL }; 