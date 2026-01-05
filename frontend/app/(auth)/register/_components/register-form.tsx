'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Shield, Check } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';

export default function RegisterForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
    requirements: { met: boolean; text: string }[];
  }>({ score: 0, feedback: '', requirements: [] });

  // Calculate password strength
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) {
      return { score: 0, feedback: '', requirements: [] };
    }

    const requirements = [
      { met: pwd.length >= 8, text: 'At least 8 characters' },
      { met: /[a-z]/.test(pwd), text: 'One lowercase letter' },
      { met: /[A-Z]/.test(pwd), text: 'One uppercase letter' },
      { met: /[0-9]/.test(pwd), text: 'One number' },
      { met: /[^a-zA-Z0-9]/.test(pwd), text: 'One special character' },
    ];

    const score = requirements.filter((r) => r.met).length + (pwd.length >= 12 ? 1 : 0);

    let strengthText = '';
    if (score <= 2) strengthText = 'Weak';
    else if (score <= 3) strengthText = 'Fair';
    else if (score <= 4) strengthText = 'Good';
    else strengthText = 'Strong';

    return {
      score,
      feedback: strengthText,
      requirements,
    };
  };

  // Helper function to get user-friendly error message
  const getErrorMessage = (errorResponse: any): string => {
    const errorCode = errorResponse?.data?.errorCode;
    const message = errorResponse?.data?.message || errorResponse?.data?.error;

    switch (errorCode) {
      case 'EMAIL_EXISTS':
        return 'An account with this email already exists. Please use a different email or try logging in.';
      default:
        if (errorResponse?.response?.status === 400) {
          return message || 'Please check your input and try again.';
        }
        if (errorResponse?.response?.status === 429) {
          return 'Too many registration attempts. Please wait a few minutes before trying again.';
        }
        if (!errorResponse?.response) {
          return 'Unable to connect to the server. Please check your internet connection and try again.';
        }
        return message || 'An error occurred during registration. Please try again.';
    }
  };

  const validateName = (nameValue: string) => {
    if (!nameValue || nameValue.trim().length < 2) {
      setNameError('Name must be at least 2 characters long');
      return false;
    }
    if (nameValue.trim().length > 50) {
      setNameError('Name must be less than 50 characters');
      return false;
    }
    setNameError('');
    return true;
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
    if (passwordStrength.score < 3) {
      setPasswordError('Password is too weak. Please use a stronger password.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
    if (passwordError) validatePassword(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setEmailError('');
    setPasswordError('');
    setNameError('');

    // Client-side validation
    const isNameValid = validateName(name);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        email: email.trim().toLowerCase(),
        password,
        name: name.trim(),
      });

      if (response.data.success) {
        const user = response.data.data?.user;
        if (user) {
          setUser({
            id: user._id || user.id,
            email: user.email,
            name: user.name || user.email.split('@')[0],
          });
          setTimeout(() => {
            router.push('/dashboard');
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
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthTextColor = (score: number) => {
    if (score <= 2) return 'text-red-400';
    if (score <= 3) return 'text-yellow-400';
    if (score <= 4) return 'text-blue-400';
    return 'text-green-400';
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
            className='flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 backdrop-blur-sm'
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
        {/* Name Input */}
        <div className='space-y-2'>
          <div className='relative'>
            <motion.div
              animate={{
                scale: nameFocused ? 1.02 : 1,
                transition: { duration: 0.2 },
              }}
              className='relative'
            >
              <User
                size={18}
                className={cn(
                  'pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 transition-colors',
                  nameFocused
                    ? 'text-purple-400'
                    : nameError
                    ? 'text-red-400'
                    : 'text-light-gray-1'
                )}
              />
              <input
                type='text'
                placeholder='Full name'
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) validateName(e.target.value);
                }}
                onFocus={() => setNameFocused(true)}
                onBlur={() => {
                  setNameFocused(false);
                  validateName(name);
                }}
                className={cn(
                  'h-12 w-full rounded-xl border bg-dark-gray-3/50 px-12 py-3 text-very-light-gray placeholder:text-light-gray-1 transition-all duration-200 focus:border-purple-500/50 focus:bg-dark-gray-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50',
                  nameError && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                  nameFocused && !nameError && 'border-purple-500/50'
                )}
                required
                disabled={loading}
                maxLength={50}
              />
              {name && !nameError && (
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
            {nameError && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='flex items-center gap-2 text-xs text-red-400'
              >
                <AlertCircle
                  size={14}
                />
                {nameError}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

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
                    ? 'text-purple-400'
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
                  'h-12 w-full rounded-xl border bg-dark-gray-3/50 px-12 py-3 text-very-light-gray placeholder:text-light-gray-1 transition-all duration-200 focus:border-purple-500/50 focus:bg-dark-gray-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50',
                  emailError && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                  emailFocused && !emailError && 'border-purple-500/50'
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
                    ? 'text-purple-400'
                    : passwordError
                    ? 'text-red-400'
                    : 'text-light-gray-1'
                )}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Password'
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => {
                  setPasswordFocused(false);
                  validatePassword(password);
                }}
                className={cn(
                  'h-12 w-full rounded-xl border bg-dark-gray-3/50 px-12 pr-12 py-3 text-very-light-gray placeholder:text-light-gray-1 transition-all duration-200 focus:border-purple-500/50 focus:bg-dark-gray-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50',
                  passwordError && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20',
                  passwordFocused && !passwordError && 'border-purple-500/50'
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

          {/* Password Strength Indicator */}
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='space-y-3 rounded-xl border border-white/5 bg-dark-gray-3/30 p-3 backdrop-blur-sm'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Shield
                    size={14}
                    className={cn(getStrengthTextColor(passwordStrength.score))}
                  />
                  <span className={cn('text-xs font-medium', getStrengthTextColor(passwordStrength.score))}>
                    Password Strength: {passwordStrength.feedback}
                  </span>
                </div>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scale: 0 }}
                      animate={{
                        scale: passwordStrength.score >= level ? 1 : 0.3,
                        backgroundColor:
                          passwordStrength.score >= level
                            ? passwordStrength.score <= 2
                              ? '#ef4444'
                              : passwordStrength.score <= 3
                              ? '#eab308'
                              : passwordStrength.score <= 4
                              ? '#3b82f6'
                              : '#22c55e'
                            : '#374151',
                      }}
                      className='h-1.5 w-6 rounded-full'
                    />
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className='space-y-1.5'>
                {passwordStrength.requirements.map((req, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className='flex items-center gap-2 text-xs'
                  >
                    <div
                      className={cn(
                        'flex h-4 w-4 items-center justify-center rounded-full transition-all',
                        req.met
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-dark-gray-2 text-light-gray-1'
                      )}
                    >
                      {req.met && (
                        <Check
                          size={10}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        req.met ? 'text-green-400' : 'text-light-gray-2'
                      )}
                    >
                      {req.text}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

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
        disabled={loading || passwordStrength.score < 3}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className='relative z-10 h-12 w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span className='relative z-10 flex items-center justify-center text-white'>
          {loading ? (
            <span className='flex items-center justify-center gap-2 text-white'>
              <Loader2
                size={18}
                className='animate-spin text-white'
              />
              <span className='text-white'>Creating account...</span>
            </span>
          ) : (
            <span className='text-white font-semibold'>Create Account</span>
          )}
        </span>
      </motion.button>

      <div className='text-center'>
        <p className='text-light-gray-2 text-sm'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-semibold text-purple-400 transition-colors hover:text-purple-300'
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
