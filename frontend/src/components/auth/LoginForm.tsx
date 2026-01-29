'use client';

import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Toast from '../common/Toast';
import Link from 'next/link';
import { setAuthToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('info');
  const router = useRouter();

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setToastMessage(null);

    try {
      const response: any = await api.post('/auth/login', { email, password }); // ✅ fixed endpoint

      if (response.access_token) {
        setAuthToken(response.access_token);
        setToastMessage('Login successful! Redirecting...');
        setToastVariant('success');
        setEmail('');
        setPassword('');
        router.push('/dashboard');
      } else {
        setErrors({ general: 'Login failed' });
        setToastMessage('Login failed');
        setToastVariant('error');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'An unexpected error occurred during login.';
      setErrors({ general: errorMsg });
      setToastMessage(errorMsg);
      setToastVariant('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-0 md:ml-[-350px] lg:ml-[-900px] z-10 w-full max-w-md px-6 overflow-hidden">
      <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Welcome Back!
        </h2>
        <form className="w-full" onSubmit={handleSubmit}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={isLoading} />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={isLoading} />
          
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}

          <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:opacity-90 transition" size="lg" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-white/70 text-sm mt-6 text-center">
          Don't have an account? <Link href="/signup" className="font-semibold text-white hover:underline">Sign Up</Link>
        </p>
      </div>

      {toastMessage && <Toast message={toastMessage} variant={toastVariant} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default LoginForm;
