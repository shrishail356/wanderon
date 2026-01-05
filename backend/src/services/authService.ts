import { User, IUserDocument } from '../models/User';
import { RegisterRequest, LoginRequest } from '../types';
import { ValidationError, AuthenticationError } from '../utils/errors';
import { generateToken } from '../utils/jwt';
import { sanitizeInput, sanitizeObject } from '../utils/sanitize';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(data: RegisterRequest): Promise<{ user: IUserDocument; token: string }> {
    // Sanitize input
    const sanitizedData = sanitizeObject({
      email: sanitizeInput(data.email.toLowerCase().trim()),
      password: data.password, // Don't sanitize password, but validate it
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email: sanitizedData.email });
    if (existingUser) {
      throw new ValidationError('User with this email already exists');
    }

    // Create user
    const user = await User.create({
      email: sanitizedData.email,
      password: sanitizedData.password,
    });

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  /**
   * Login user
   */
  static async login(data: LoginRequest): Promise<{ user: IUserDocument; token: string }> {
    // Sanitize input
    const sanitizedData = sanitizeObject({
      email: sanitizeInput(data.email.toLowerCase().trim()),
      password: data.password,
    });

    // Find user and include password for comparison
    const user = await User.findOne({ email: sanitizedData.email }).select('+password');
    
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(sanitizedData.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login and increment login count
    user.lastLogin = new Date();
    user.loginCount += 1;
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString(), user.email);

    return { user, token };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<IUserDocument | null> {
    return User.findById(userId);
  }

  /**
   * Get user by email
   */
  static async getUserByEmail(email: string): Promise<IUserDocument | null> {
    return User.findOne({ email: email.toLowerCase().trim() });
  }
}

