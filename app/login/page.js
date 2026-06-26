import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Login' };

export default async function LoginPage({ searchParams }) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <LoginForm redirect={sp.redirect || '/'} initialError={sp.error || ''} />
    </div>
  );
}
