'use client';

import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import Toast from '../common/Toast';
import Link from 'next/link';
import { api } from '@/lib/api'; // use api helper

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'error' | 'info'>('info');

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
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
      await api.post('/auth/signup', { email, password }); // ✅ fixed endpoint

      setToastMessage('Signup successful! You can now login.');
      setToastVariant('success');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setErrors({ general: error.message || 'Something went wrong with the API request.' });
      setToastMessage(error.message || 'Signup failed');
      setToastVariant('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ml-0 md:ml-[-350px] lg:ml-[-900px] z-10 w-full max-w-md px-6 overflow-hidden">
      <div className="bg-black/50 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col items-center">
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Create Your Account
        </h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <Input id="email" label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} disabled={isLoading} />
          <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} disabled={isLoading} />
          <Input id="confirmPassword" label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} disabled={isLoading} />
          
          {errors.general && <p className="text-red-500 text-sm mt-2 text-center">{errors.general}</p>}

          <Button type="submit" className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 text-black font-semibold hover:opacity-90 transition" size="lg" isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="text-white/70 text-sm mt-6 text-center">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-white hover:underline">Sign In</Link>
        </p>
      </div>

      {toastMessage && <Toast message={toastMessage} variant={toastVariant} onClose={() => setToastMessage(null)} />}
    </div>
  );
};

export default SignupForm;
