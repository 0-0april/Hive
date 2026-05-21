// Test script to verify backend API endpoints
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  fullName: 'Test User',
  username: 'testuser' + Date.now(),
  email: `test${Date.now()}@example.com`,
  mobileNumber: '1234567890',
  password: 'Test123!'
};

console.log('🧪 Testing Hive Backend API...\n');

// Test 1: Health Check
async function testHealthCheck() {
  try {
    console.log('1️⃣ Testing health check...');
    const response = await axios.get('http://localhost:5000');
    console.log('✅ Health check passed:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return false;
  }
}

// Test 2: Signup
async function testSignup() {
  try {
    console.log('\n2️⃣ Testing signup...');
    console.log('Signup data:', testUser);
    const response = await axios.post(`${API_URL}/auth/signup`, testUser);
    console.log('✅ Signup successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Signup failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 3: Login
async function testLogin() {
  try {
    console.log('\n3️⃣ Testing login...');
    const loginData = {
      emailOrMobile: testUser.email,
      password: testUser.password
    };
    console.log('Login data:', loginData);
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User:', response.data.user);
    return response.data.token;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return null;
  }
}

// Test 4: Login with username
async function testLoginWithUsername() {
  try {
    console.log('\n4️⃣ Testing login with username...');
    const loginData = {
      emailOrMobile: testUser.username,
      password: testUser.password
    };
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login with username successful!');
    return true;
  } catch (error) {
    console.error('❌ Login with username failed:', error.response?.data || error.message);
    return false;
  }
}

// Test 5: Login with mobile
async function testLoginWithMobile() {
  try {
    console.log('\n5️⃣ Testing login with mobile number...');
    const loginData = {
      emailOrMobile: testUser.mobileNumber,
      password: testUser.password
    };
    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log('✅ Login with mobile successful!');
    return true;
  } catch (error) {
    console.error('❌ Login with mobile failed:', error.response?.data || error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('           HIVE BACKEND API TEST SUITE');
  console.log('═══════════════════════════════════════════════════════\n');

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log('\n❌ Backend server is not running or not accessible!');
    console.log('Please start the backend server with: npm start');
    process.exit(1);
  }

  const signupOk = await testSignup();
  if (!signupOk) {
    console.log('\n⚠️  Signup failed. Check MongoDB connection and backend logs.');
  }

  const loginOk = await testLogin();
  if (!loginOk) {
    console.log('\n⚠️  Login failed. User may not exist or password is incorrect.');
  }

  if (signupOk && loginOk) {
    await testLoginWithUsername();
    await testLoginWithMobile();
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                   TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Health Check: ${healthOk ? '✅' : '❌'}`);
  console.log(`Signup:       ${signupOk ? '✅' : '❌'}`);
  console.log(`Login:        ${loginOk ? '✅' : '❌'}`);
  console.log('═══════════════════════════════════════════════════════\n');

  if (healthOk && signupOk && loginOk) {
    console.log('🎉 All tests passed! Backend is working correctly.\n');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.\n');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
