'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'error' | 'warning' | 'info'>('error');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Helper function to get user-friendly error message
  const getErrorMessage = (errorResponse: any): string => {
    const errorCode = errorResponse?.data?.errorCode;
    const message = errorResponse?.data?.message || errorResponse?.data?.error;

    // Handle specific error codes
    switch (errorCode) {
      case 'ACCOUNT_LOCKED':
        return message || 'Your account has been temporarily locked due to multiple failed login attempts. Please try again later.';
      default:
        // Generic authentication errors - don't reveal if email exists
        if (errorResponse?.response?.status === 401) {
          return 'Invalid email or password. Please check your credentials and try again.';
        }
        // Validation errors
        if (errorResponse?.response?.status === 400) {
          return message || 'Please check your input and try again.';
        }
        // Rate limiting
        if (errorResponse?.response?.status === 429) {
          return 'Too many login attempts. Please wait a few minutes before trying again.';
        }
        // Network errors
        if (!errorResponse?.response) {
          return 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        // Default
        return message || 'An error occurred during login. Please try again.';
    }
  };

  const validateEmail = (emailValue: string) => {
    if (!emailValue) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailValue.includes('@') || !emailValue.includes('.')) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (passwordValue: string) => {
    if (!passwordValue) {
      setPasswordError('Password is required');
      return false;
    }
    if (passwordValue.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorType('error');
    setEmailError('');
    setPasswordError('');

    // Client-side validation
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data.success) {
        // Backend returns { success: true, data: { user: ... } }
        const user = response.data.data?.user;
        if (user) {
          // Map backend user to frontend user format
          setUser({
            id: user._id || user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
          });
          const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
          // Small delay to ensure state is set before navigation
          setTimeout(() => {
            router.push(redirectUrl);
          }, 100);
        } else {
          setError('User data not received');
        }
      } else {
        const errorMsg = getErrorMessage({ data: response.data });
        setError(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = getErrorMessage(err);
      const errorCode = err.response?.data?.errorCode;
      
      // Set error type based on error code
      if (errorCode === 'ACCOUNT_LOCKED') {
        setErrorType('warning');
      } else if (err.response?.status === 429) {
        setErrorType('warning');
      } else {
        setErrorType('error');
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-5'
    >
      <AnimatePresence mode='wait'>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={cn(
              'flex items-start gap-3 rounded-xl border p-4 text-sm backdrop-blur-sm',
              errorType === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            )}
          >
            <AlertCircle
              size={20}
              className='mt-0.5 shrink-0'
            />
            <p className='flex-1'>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className='space-y-5'>
        {/* Email Input */}
        <div className='space-y-2'>
          <div className='relative'>
            <motion.div
              animate={{
                scale: emailFocused ? 1.02 : 1,
                transition: { duration: 0.2 },
              }}
              className='relative'
            >
              <Mail
                size={18}
                className={cn(
                  'pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors',
                  emailFocused
                    ? 'text-blue-400'
                    : emailError
                    ? 'text-red-400'
                    : 'text-light-gray-1'
                )}
              />
              <input
                type='email'
                placeholder='Email address'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => {
                  setEmailFocused(false);
                  validateEmail(email);
                }}
                className={cn(
                  'h-12 w-full rounded-xl border bg-dark-gray-3/50 px-12 py-3 text-very-light-gray placeholder:text-light-gray-1 transition-all duration-200 focus:border-blue-500/50 focus:bg-dark-gray-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50',
                  emailError && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                  emailFocused && !emailError && 'border-blue-500/50'
                )}
                required
                disabled={loading}
              />
              {email && !emailError && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className='absolute right-4 top-1/2 -translate-y-1/2'
                >
                  <CheckCircle2
                    size={18}
                    className='text-green-400'
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
          <AnimatePresence>
            {emailError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='flex items-center gap-2 text-xs text-red-400'
              >
                <AlertCircle
                  size={14}
                />
                {emailError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Password Input */}
        <div className='space-y-2'>
          <div className='relative'>
            <motion.div
              animate={{
                scale: passwordFocused ? 1.02 : 1,
                transition: { duration: 0.2 },
              }}
              className='relative'
            >
              <Lock
                size={18}
                className={cn(
                  'pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors',
                  passwordFocused
                    ? 'text-blue-400'
                    : passwordError
                    ? 'text-red-400'
                    : 'text-light-gray-1'
                )}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                }}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  validatePassword(password);
                }}
                className={cn(
                  'h-12 w-full rounded-xl border bg-dark-gray-3/50 px-12 pr-12 py-3 text-very-light-gray placeholder:text-light-gray-1 transition-all duration-200 focus:border-blue-500/50 focus:bg-dark-gray-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50',
                  passwordError && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                  passwordFocused && !passwordError && 'border-blue-500/50'
                )}
                required
                disabled={loading}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 -translate-y-1/2 text-light-gray-1 transition-colors hover:text-very-light-gray'
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                  />
                ) : (
                  <Eye
                    size={18}
                  />
                )}
              </button>
            </motion.div>
          </div>
          <AnimatePresence>
            {passwordError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='flex items-center gap-2 text-xs text-red-400'
              >
                <AlertCircle
                  size={14}
                />
                {passwordError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        type='submit'
        disabled={loading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className='relative z-10 h-12 w-full overflow-hidden rounded-xl bg-linear-to-r from-blue-500 to-purple-500 font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-50'
      >
        <span className='relative z-10 flex items-center justify-center text-white'>
          {loading ? (
            <span className='flex items-center justify-center gap-2 text-white'>
              <Loader2
                size={18}
                className='animate-spin text-white'
              />
              <span className='text-white'>Signing in...</span>
            </span>
          ) : (
            <span className='text-white font-semibold'>Sign In</span>
          )}
        </span>
      </motion.button>

      <div className='text-center'>
        <p className='text-light-gray-2 text-sm'>
          Don't have an account?{' '}
          <Link
            href='/register'
            className='font-semibold text-blue-400 transition-colors hover:text-blue-300'
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}

