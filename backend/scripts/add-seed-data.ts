import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { Expense } from '../src/models/Expense';
import { ExpenseCategory, ExpenseType } from '../src/types';
import bcrypt from 'bcryptjs';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

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

const generateExpense = (userId: mongoose.Types.ObjectId, type: ExpenseType, category: ExpenseCategory, title: string, amount: number, daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0, 0);

  return {
    userId,
    title,
    amount,
    category,
    type,
    description: `${type === 'income' ? 'Received' : 'Spent'} ${amount} for ${title}`,
    date,
  };
};

const seed = async () => {
  try {
    console.log('🌱 Starting seed data addition for shrishailpatil1555@gmail.com...');

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find or create user
    let user = await User.findOne({ email: 'shrishailpatil1555@gmail.com' });
    
    if (!user) {
      // Create user if doesn't exist
      const hashedPassword = await bcrypt.hash('Temp@1234', 12);
      user = await User.create({
        email: 'shrishailpatil1555@gmail.com',
        password: hashedPassword,
      });
      console.log('✅ Created user: shrishailpatil1555@gmail.com');
    } else {
      console.log('✅ Found existing user: shrishailpatil1555@gmail.com');
    }

    // Delete existing expenses for this user (optional - comment out if you want to keep existing)
    const deletedCount = await Expense.deleteMany({ userId: user._id });
    console.log(`✅ Cleared ${deletedCount.deletedCount} existing expenses`);

    // Create diverse expenses
    const expenses: Array<{
      userId: mongoose.Types.ObjectId;
      title: string;
      amount: number;
      category: ExpenseCategory;
      type: ExpenseType;
      description: string;
      date: Date;
    }> = [];

    // Income entries
    expenses.push(generateExpense(user._id, 'income', 'Income', 'Monthly Salary', 50000, 5));
    expenses.push(generateExpense(user._id, 'income', 'Income', 'Freelance Project', 15000, 12));
    expenses.push(generateExpense(user._id, 'income', 'Income', 'Investment Return', 5000, 20));
    expenses.push(generateExpense(user._id, 'income', 'Income', 'Bonus Payment', 10000, 30));

    // Food & Dining expenses
    expenses.push(generateExpense(user._id, 'expense', 'Food & Dining', 'Grocery Shopping', 3500, 2));
    expenses.push(generateExpense(user._id, 'expense', 'Food & Dining', 'Restaurant Dinner', 1200, 4));
    expenses.push(generateExpense(user._id, 'expense', 'Food & Dining', 'Coffee & Snacks', 450, 6));
    expenses.push(generateExpense(user._id, 'expense', 'Food & Dining', 'Lunch with Friends', 800, 8));
    expenses.push(generateExpense(user._id, 'expense', 'Food & Dining', 'Weekly Groceries', 2800, 10));

    // Transportation expenses
    expenses.push(generateExpense(user._id, 'expense', 'Transportation', 'Fuel', 2000, 1));
    expenses.push(generateExpense(user._id, 'expense', 'Transportation', 'Uber Ride', 350, 3));
    expenses.push(generateExpense(user._id, 'expense', 'Transportation', 'Bus Pass', 500, 7));
    expenses.push(generateExpense(user._id, 'expense', 'Transportation', 'Parking Fee', 200, 9));

    // Shopping expenses
    expenses.push(generateExpense(user._id, 'expense', 'Shopping', 'Clothing', 2500, 5));
    expenses.push(generateExpense(user._id, 'expense', 'Shopping', 'Electronics', 12000, 15));
    expenses.push(generateExpense(user._id, 'expense', 'Shopping', 'Books', 800, 18));

    // Bills & Utilities
    expenses.push(generateExpense(user._id, 'expense', 'Bills & Utilities', 'Electricity Bill', 1500, 1));
    expenses.push(generateExpense(user._id, 'expense', 'Bills & Utilities', 'Internet Bill', 800, 1));
    expenses.push(generateExpense(user._id, 'expense', 'Bills & Utilities', 'Water Bill', 400, 2));
    expenses.push(generateExpense(user._id, 'expense', 'Bills & Utilities', 'Phone Bill', 500, 3));

    // Entertainment
    expenses.push(generateExpense(user._id, 'expense', 'Entertainment', 'Movie Tickets', 600, 4));
    expenses.push(generateExpense(user._id, 'expense', 'Entertainment', 'Concert Tickets', 2500, 11));
    expenses.push(generateExpense(user._id, 'expense', 'Entertainment', 'Streaming Subscription', 500, 1));

    // Healthcare
    expenses.push(generateExpense(user._id, 'expense', 'Healthcare', 'Doctor Visit', 800, 6));
    expenses.push(generateExpense(user._id, 'expense', 'Healthcare', 'Medicines', 1200, 7));
    expenses.push(generateExpense(user._id, 'expense', 'Healthcare', 'Gym Membership', 1500, 1));

    // Education
    expenses.push(generateExpense(user._id, 'expense', 'Education', 'Online Course', 3000, 14));
    expenses.push(generateExpense(user._id, 'expense', 'Education', 'Books', 1500, 16));

    // Travel
    expenses.push(generateExpense(user._id, 'expense', 'Travel', 'Flight Tickets', 15000, 25));
    expenses.push(generateExpense(user._id, 'expense', 'Travel', 'Hotel Booking', 5000, 25));
    expenses.push(generateExpense(user._id, 'expense', 'Travel', 'Travel Food', 2000, 26));

    // Other
    expenses.push(generateExpense(user._id, 'expense', 'Other', 'Miscellaneous', 1000, 13));
    expenses.push(generateExpense(user._id, 'expense', 'Other', 'Gift', 1500, 19));

    await Expense.insertMany(expenses);
    console.log(`✅ Created ${expenses.length} expenses for user: ${user.email}`);

    // Calculate summary
    const totalIncome = expenses.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = expenses.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    const balance = totalIncome - totalExpense;

    console.log('\n📊 Expense Summary:');
    console.log(`   Total Income: ₹${totalIncome.toLocaleString('en-IN')}`);
    console.log(`   Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}`);
    console.log(`   Balance: ₹${balance.toLocaleString('en-IN')}`);
    console.log(`   Total Transactions: ${expenses.length}`);
    console.log('\n✅ Seed data addition completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed process failed:', error);
    process.exit(1);
  }
};

seed();

