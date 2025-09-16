// src/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Input from '@/components/Input';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // UPDATED SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // On successful login, redirect to the main dashboard
      console.log('Login Success:', data);
      router.push('/');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Welcome Back!</h1>
        <p className="text-gray-400">Login to access your dashboard.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input id="email" label="Email" type="email" required value={formData.email} onChange={handleChange} disabled={isLoading}/>
        <Input id="password" label="Password" type="password" required value={formData.password} onChange={handleChange} disabled={isLoading}/>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}

        <div className="text-sm text-right">
            <a href="#" className="font-medium text-green-400 hover:underline">
                Forgot password?
            </a>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 font-semibold text-black bg-green-400 rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        <p className="text-sm text-center text-gray-400">
          Don't have an account?{' '}
          <Link href="/signin" className="font-medium text-green-400 hover:underline">
            Sign In
          </Link>
        </p>
      </form>
    </>
  );
}