'use client';

import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '@/components/providers/AuthProvider';

export default function GoogleButton({ redirect = '/', label = 'Continue with Google' }) {
  const { loginWithGoogle } = useAuth();
  return (
    <button type="button" onClick={() => loginWithGoogle(redirect)} className="btn-secondary w-full">
      <FcGoogle className="h-5 w-5" />
      {label}
    </button>
  );
}
