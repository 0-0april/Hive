const getApiUrl = () => {
  const { Platform } = require('react-native');
  
  // ✅ Your laptop's hotspot IP
  const YOUR_COMPUTER_IP = '192.168.137.1'; // ← update this!
  
  if (Platform.OS === 'android') {
    // ✅ Physical device - use your actual IP
    return `http://${YOUR_COMPUTER_IP}:5000/api`;
  } else if (Platform.OS === 'ios') {
    // ✅ Physical device - use your actual IP
    return `http://${YOUR_COMPUTER_IP}:5000/api`;
  }
  
  return `http://${YOUR_COMPUTER_IP}:5000/api`;
};

export const API_URL = getApiUrl();