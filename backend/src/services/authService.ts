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
      throw new ValidationError('User with this email already exists', 'EMAIL_EXISTS');
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
    
    // Always use generic error message to prevent user enumeration
    const genericError = new AuthenticationError('Invalid email or password');
    
    if (!user) {
      // Add artificial delay to prevent timing attacks (same response time whether user exists or not)
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      throw genericError;
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      const lockTime = user.accountLockedUntil!;
      const minutesRemaining = Math.ceil((lockTime.getTime() - Date.now()) / (1000 * 60));
      throw new AuthenticationError(
        `Account is temporarily locked due to multiple failed login attempts. Please try again in ${minutesRemaining} minute(s).`,
        'ACCOUNT_LOCKED'
      );
    }

    // Check password
    const isPasswordValid = await user.comparePassword(sanitizedData.password);
    
    if (!isPasswordValid) {
      // Increment failed login attempts
      await user.incrementFailedLoginAttempts();
      
      // Check if account is now locked after this attempt
      if (user.isAccountLocked()) {
        throw new AuthenticationError(
          'Account has been temporarily locked due to multiple failed login attempts. Please try again in 30 minutes.',
          'ACCOUNT_LOCKED'
        );
      }
      
      // Add artificial delay to prevent timing attacks
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 100));
      throw genericError;
    }

    // Successful login - reset failed attempts and update login info
    await user.resetFailedLoginAttempts();
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

