import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AccountDetailsFormProps {
  data: any;
  updateData: (data: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AccountDetailsForm: React.FC<AccountDetailsFormProps> = ({ data, updateData, onNext, onBack }) => {
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.username || !data.email || !data.password || !data.confirmPassword) {
      setError('All fields are required.');
      return;
    }
    
    // validate email somewhat
    if (!data.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    onNext();
  };

  const buttonVariant = data.role === 'student' ? 'primary' : 'secondary';

  return (
    <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Account Details</h2>
        <p className="text-gray-500 mt-2">Create your login credentials</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <Input
          label="Username"
          type="text"
          placeholder="your_unique_username"
          value={data.username}
          onChange={(e) => updateData({ username: e.target.value })}
          required
        />

        <Input
          label="College Email"
          type="email"
          placeholder="you@college.edu"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          required
        />

        <Input
          label="Password"
          type="password"
          placeholder="Min. 6 characters"
          value={data.password}
          onChange={(e) => updateData({ password: e.target.value })}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Re-enter password"
          value={data.confirmPassword}
          onChange={(e) => updateData({ confirmPassword: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-lg font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          Back
        </button>
        <Button onClick={handleNext} variant={buttonVariant}>
          Next Step
        </Button>
      </div>
    </div>
  );
};
