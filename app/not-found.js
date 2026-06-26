import Link from 'next/link';
import { FiHome, FiCompass } from 'react-icons/fi';

export const metadata = { title: 'Page Not Found' };

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="bg-gradient-to-br from-brand-500 to-violet-600 bg-clip-text text-8xl font-extrabold text-transparent">
        404
      </p>
      <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-neutral-500">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          <FiHome /> Back Home
        </Link>
        <Link href="/ideas" className="btn-secondary">
          <FiCompass /> Explore Ideas
        </Link>
      </div>
    </div>
  );
}
