import dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';

dotenv.config();

const BASE_URL = process.env.BASE_URL || 'http://localhost:4000/api';

// Check if server is running before tests
const checkServer = async () => {
  try {
    await axios.get(`${BASE_URL.replace('/api', '')}/health`, { timeout: 2000 });
    return true;
  } catch {
    console.error('❌ Server is not running!');
    console.error('   Please start the server first with: pnpm run dev');
    process.exit(1);
  }
};

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

const logResult = (name: string, passed: boolean, message: string) => {
  results.push({ name, passed, message });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} ${name}: ${message}`);
};

/**
 * Test Health Check
 */
const testHealthCheck = async () => {
  try {
    const response = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    if (response.status === 200 && response.data.status === 'OK') {
      logResult('Health Check', true, 'Server is running');
    } else {
      logResult('Health Check', false, 'Server health check failed');
    }
  } catch (error: any) {
    logResult('Health Check', false, `Error: ${error.message}`);
  }
};

/**
 * Test User Registration
 */
const testRegistration = async () => {
  try {
    const email = `test${Date.now()}@wanderon.com`;
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      email,
      password: 'Test@1234',
    });

    if (response.data.success && response.data.data?.user) {
      logResult('User Registration', true, `User registered: ${email}`);
      return { email, cookies: response.headers['set-cookie'] };
    } else {
      logResult('User Registration', false, 'Registration failed');
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      logResult('User Registration', false, `Validation error: ${error.response.data.message}`);
    } else {
      logResult('User Registration', false, `Error: ${error.message}`);
    }
    return null;
  }
};

/**
 * Test User Login
 */
const testLogin = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email,
      password,
    });

    if (response.data.success && response.data.data?.user) {
      logResult('User Login', true, `Login successful for: ${email}`);
      return response.headers['set-cookie'];
    } else {
      logResult('User Login', false, 'Login failed');
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      logResult('User Login', false, 'Invalid credentials');
    } else {
      logResult('User Login', false, `Error: ${error.message}`);
    }
    return null;
  }
};

/**
 * Test Get Current User (Protected Route)
 */
const testGetCurrentUser = async (cookies: string[] | undefined) => {
  try {
    if (!cookies || cookies.length === 0) {
      logResult('Get Current User', false, 'No authentication cookie');
      return;
    }

    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Cookie: cookies[0],
      },
    });

    if (response.data.success && response.data.data?.user) {
      logResult('Get Current User', true, `User retrieved: ${response.data.data.user.email}`);
    } else {
      logResult('Get Current User', false, 'Failed to get user');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      logResult('Get Current User', false, 'Unauthorized - JWT not working');
    } else {
      logResult('Get Current User', false, `Error: ${error.message}`);
    }
  }
};

/**
 * Test Create Expense
 */
const testCreateExpense = async (cookies: string[] | undefined) => {
  try {
    if (!cookies || cookies.length === 0) {
      logResult('Create Expense', false, 'No authentication cookie');
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/expenses`,
      {
        title: 'Test Expense',
        amount: 100.50,
        category: 'Food & Dining',
        type: 'expense',
        description: 'Test expense creation',
        date: new Date().toISOString(),
      },
      {
        headers: {
          Cookie: cookies[0],
        },
      }
    );

    if (response.data.success && response.data.data?.expense) {
      logResult('Create Expense', true, `Expense created: ${response.data.data.expense.title}`);
      return response.data.data.expense._id;
    } else {
      logResult('Create Expense', false, 'Failed to create expense');
      return null;
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      logResult('Create Expense', false, 'Unauthorized');
    } else {
      logResult('Create Expense', false, `Error: ${error.message}`);
    }
    return null;
  }
};

/**
 * Test Get Expenses
 */
const testGetExpenses = async (cookies: string[] | undefined) => {
  try {
    if (!cookies || cookies.length === 0) {
      logResult('Get Expenses', false, 'No authentication cookie');
      return;
    }

    const response = await axios.get(`${BASE_URL}/expenses`, {
      headers: {
        Cookie: cookies[0],
      },
    });

    if (response.data.success && Array.isArray(response.data.data?.expenses)) {
      logResult('Get Expenses', true, `Retrieved ${response.data.data.expenses.length} expenses`);
    } else {
      logResult('Get Expenses', false, 'Failed to get expenses');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      logResult('Get Expenses', false, 'Unauthorized');
    } else {
      logResult('Get Expenses', false, `Error: ${error.message}`);
    }
  }
};

/**
 * Test Get Statistics
 */
const testGetStatistics = async (cookies: string[] | undefined) => {
  try {
    if (!cookies || cookies.length === 0) {
      logResult('Get Statistics', false, 'No authentication cookie');
      return;
    }

    const response = await axios.get(`${BASE_URL}/expenses/statistics`, {
      headers: {
        Cookie: cookies[0],
      },
    });

    if (response.data.success && response.data.data?.statistics) {
      const stats = response.data.data.statistics;
      logResult(
        'Get Statistics',
        true,
        `Stats: Income: ${stats.totalIncome}, Expense: ${stats.totalExpense}, Balance: ${stats.balance}`
      );
    } else {
      logResult('Get Statistics', false, 'Failed to get statistics');
    }
  } catch (error: any) {
    if (error.response?.status === 401) {
      logResult('Get Statistics', false, 'Unauthorized');
    } else {
      logResult('Get Statistics', false, `Error: ${error.message}`);
    }
  }
};

/**
 * Test Logout
 */
const testLogout = async (cookies: string[] | undefined) => {
  try {
    if (!cookies || cookies.length === 0) {
      logResult('Logout', false, 'No authentication cookie');
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Cookie: cookies[0],
        },
      }
    );

    if (response.data.success) {
      logResult('Logout', true, 'Logout successful');
    } else {
      logResult('Logout', false, 'Logout failed');
    }
  } catch (error: any) {
    logResult('Logout', false, `Error: ${error.message}`);
  }
};

/**
 * Test Invalid Registration (Validation)
 */
const testInvalidRegistration = async () => {
  try {
    // Test with invalid email
    await axios.post(`${BASE_URL}/auth/register`, {
      email: 'invalid-email',
      password: 'Test@1234',
    });
    logResult('Invalid Registration Validation', false, 'Should have rejected invalid email');
  } catch (error: any) {
    if (error.response?.status === 400) {
      logResult('Invalid Registration Validation', true, 'Invalid email properly rejected');
    } else {
      logResult('Invalid Registration Validation', false, `Unexpected error: ${error.message}`);
    }
  }

  try {
    // Test with weak password
    await axios.post(`${BASE_URL}/auth/register`, {
      email: `test${Date.now()}@test.com`,
      password: 'weak',
    });
    logResult('Weak Password Validation', false, 'Should have rejected weak password');
  } catch (error: any) {
    if (error.response?.status === 400) {
      logResult('Weak Password Validation', true, 'Weak password properly rejected');
    } else {
      logResult('Weak Password Validation', false, `Unexpected error: ${error.message}`);
    }
  }
};

/**
 * Run all API tests
 */
const runApiTests = async () => {
  console.log('🧪 Starting API Tests...\n');
  console.log(`📍 Testing against: ${BASE_URL}\n`);

  // Check if server is running
  await checkServer();

  // Health check
  await testHealthCheck();
  console.log('');

  // Registration
  const registrationResult = await testRegistration();
  console.log('');

  if (!registrationResult) {
    console.log('❌ Registration failed, skipping remaining tests\n');
    printSummary();
    process.exit(1);
  }

  // Login
  const loginCookies = await testLogin(registrationResult.email, 'Test@1234');
  console.log('');

  if (!loginCookies) {
    console.log('❌ Login failed, skipping protected route tests\n');
    printSummary();
    process.exit(1);
  }

  // Protected routes
  await testGetCurrentUser(loginCookies);
  console.log('');

  await testCreateExpense(loginCookies);
  console.log('');

  await testGetExpenses(loginCookies);
  console.log('');

  await testGetStatistics(loginCookies);
  console.log('');

  await testLogout(loginCookies);
  console.log('');

  // Validation tests
  await testInvalidRegistration();
  console.log('');

  printSummary();
};

const printSummary = () => {
  console.log('\n📊 Test Results Summary:');
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;
  console.log(`   Passed: ${passed}/${total}`);
  console.log(`   Failed: ${total - passed}/${total}\n`);

  if (passed === total) {
    console.log('✅ All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please review the results above.');
    process.exit(1);
  }
};

runApiTests();

