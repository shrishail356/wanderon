'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Loader from '@/components/ui/Loader';

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email,
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
        setError(response.data.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'
    >
      {error && (
        <div className='bg-red-500/10 border-red-500/50 text-red-400 rounded-lg border p-3 text-sm'>
          {error}
        </div>
      )}

      <div className='space-y-4'>
        <div className='relative'>
          {!emailFocused && !email && (
            <Mail
              size={20}
              className='text-light-gray-1 pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2'
            />
          )}
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            className={cn(
              'input-box',
              !emailFocused && !email && 'pl-12',
              (emailFocused || email) && 'pl-4'
            )}
            required
            disabled={loading}
          />
        </div>

        <div className='relative'>
          {!passwordFocused && !password && (
            <Lock
              size={20}
              className='text-light-gray-1 pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2'
            />
          )}
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className={cn(
              'input-box',
              !passwordFocused && !password && 'pl-12',
              (passwordFocused || password) && 'pl-4'
            )}
            required
            disabled={loading}
          />
        </div>
      </div>

      <Button
        type='submit'
        title={loading ? 'Signing in...' : 'Sign In'}
        disabled={loading}
        className='w-full'
      />

      <div className='text-center'>
        <p className='text-light-gray-2 text-sm'>
          Don't have an account?{' '}
          <Link
            href='/register'
            className='text-very-light-gray hover:text-light-gray-3 font-medium transition-colors'
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}

