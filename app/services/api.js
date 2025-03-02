import axios from 'axios';
import { Platform } from 'react-native';

// Update with your actual IP address
const DEV_IP = '172.16.112.113'; // Your computer's IP address
const PORT = '3001'; // The port we switched to earlier

const getBaseUrl = () => {
  if (Platform.OS === 'ios') {
    // For iOS devices
    return `http://${DEV_IP}:${PORT}/api`;
  } else {
    // For Android devices
    return `http://${DEV_IP}:${PORT}/api`;
  }
};

const API_BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

export const sendChatMessage = async (message, botType) => {
  try {
    console.log('Attempting to connect to:', API_BASE_URL);
    console.log('Sending data:', { message, botType });

    const response = await api.post('/chat', {
      message,
      botType, // 'ebay', 'nfl', or 'homedepot'
      // Add any other necessary data like session ID, user ID, etc.
    });

    if (response.data) {
      console.log('Received response:', response.data);
      return response.data;
    } else {
      throw new Error('No data received from server');
    }
  } catch (error) {
    console.error('Detailed Error Information:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: `${API_BASE_URL}/chat`,
      data: { message, botType }
    });
    throw error;
  }
};

// Add default export
export default {
  sendChatMessage,
}; 