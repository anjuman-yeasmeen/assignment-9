import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Register' };

export default async function RegisterPage({ searchParams }) {
  const sp = await searchParams;
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <RegisterForm redirect={sp.redirect || '/'} />
    </div>
  );
}
