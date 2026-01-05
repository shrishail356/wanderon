import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { Expense } from '../src/models/Expense';
import { ExpenseCategory, ExpenseType } from '../src/types';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const seedUsers = [
  {
    email: 'demo@wanderon.com',
    password: 'Demo@1234',
  },
  {
    email: 'test@wanderon.com',
    password: 'Test@1234',
  },
];

const expenseCategories: ExpenseCategory[] = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Travel',
  'Income',
  'Other',
];

const generateRandomExpense = (userId: mongoose.Types.ObjectId) => {
  const types: ExpenseType[] = ['income', 'expense'];
  const type = types[Math.floor(Math.random() * types.length)];
  const category = expenseCategories[Math.floor(Math.random() * expenseCategories.length)];
  const amount = Math.floor(Math.random() * 10000) + 100;
  const titles = {
    income: ['Salary', 'Freelance Payment', 'Investment Return', 'Bonus', 'Gift'],
    expense: ['Groceries', 'Restaurant', 'Gas', 'Movie Tickets', 'Shopping', 'Bills'],
  };

  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 90)); // Random date in last 90 days

  return {
    userId,
    title: titles[type][Math.floor(Math.random() * titles[type].length)],
    amount,
    category,
    type,
    description: `Sample ${type} transaction`,
    date,
  };
};

const seed = async () => {
  try {
    console.log('🌱 Starting seed process...');

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Expense.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const createdUsers = await User.insertMany(seedUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create expenses for each user
    for (const user of createdUsers) {
      const expenses: Array<{
        userId: mongoose.Types.ObjectId;
        title: string;
        amount: number;
        category: ExpenseCategory;
        type: ExpenseType;
        description: string;
        date: Date;
      }> = [];
      for (let i = 0; i < 20; i++) {
        expenses.push(generateRandomExpense(user._id));
      }
      await Expense.insertMany(expenses);
      console.log(`✅ Created 20 expenses for user: ${user.email}`);
    }

    console.log('\n📊 Seed Data Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Expenses: ${createdUsers.length * 20}`);
    console.log('\n✅ Seed process completed successfully!');

    // Display login credentials
    console.log('\n🔐 Login Credentials:');
    seedUsers.forEach((user) => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Password: ${user.password}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }
};

seed();

