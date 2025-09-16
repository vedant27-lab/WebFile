// src/app/(auth)/signin/page.tsx
'use client';

import { useState } from 'react';
import Input from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function SignInPage() {
  const router = useRouter(); // Initialize the router
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // UPDATED SUBMIT HANDLER
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // On successful sign-in, redirect to the login page
      console.log('Success:', data);
      router.push('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create an Account</h1>
        <p className="text-gray-400">Welcome! Please fill in the details below.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* ... (Your inputs remain the same) ... */}
        <div className="grid grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" type="text" required value={formData.firstName} onChange={handleChange} disabled={isLoading} />
            <Input id="lastName" label="Last Name" type="text" required value={formData.lastName} onChange={handleChange} disabled={isLoading} />
        </div>
        <Input id="email" label="Email" type="email" required value={formData.email} onChange={handleChange} disabled={isLoading} />
        <Input id="password" label="Password" type="password" required value={formData.password} onChange={handleChange} disabled={isLoading} />
        <Input id="confirmPassword" label="Confirm Password" type="password" required value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} />
        
        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 font-semibold text-black bg-green-400 rounded-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating Account...' : 'Sign In'}
        </button>

        <p className="text-sm text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </>
  );
}