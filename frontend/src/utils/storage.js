import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER: '@hive_user',
  MOCK_DATA: '@hive_mock_data',
};

// Save current user
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

// Get current user
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Remove current user (logout)
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// Save mock data
export const saveMockData = async (data) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MOCK_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mock data:', error);
  }
};

// Get mock data
export const getMockData = async () => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MOCK_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting mock data:', error);
    return null;
  }
};

// Clear all storage
export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};
