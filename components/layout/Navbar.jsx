'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiMenu, FiX, FiLogOut, FiUser, FiPlusCircle } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { useAuth } from '@/components/providers/AuthProvider';
import ThemeToggle from '@/components/ui/ThemeToggle';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Ideas' },
];
const privateLinks = [
  { href: '/add-idea', label: 'Add Idea' },
  { href: '/my-ideas', label: 'My Ideas' },
  { href: '/my-interactions', label: 'My Interactions' },
];

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  // Close the profile dropdown on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const links = user ? [...publicLinks, ...privateLinks] : publicLinks;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
  };

  const linkClass = (href) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return `rounded-lg px-3 py-2 text-sm font-medium transition ${
      active
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white'
    }`;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/80 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <HiOutlineLightBulb className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Idea<span className="text-brand-600">Vault</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {!loading && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-secondary">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}

          {!loading && user && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-neutral-300 p-0.5 pr-2 transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <Avatar user={user} />
                <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:inline">
                  {user.name}
                </span>
              </button>

              {menuOpen && (
                <div className="card absolute right-0 mt-2 w-56 overflow-hidden p-1.5 animate-fade-in">
                  <div className="border-b border-neutral-200 px-3 py-2 dark:border-neutral-800">
                    <p className="truncate text-sm font-semibold">{user.name}</p>
                    <p className="truncate text-xs text-neutral-500">{user.email}</p>
                  </div>
                  <MenuLink href="/profile" icon={<FiUser />}>
                    Profile
                  </MenuLink>
                  <MenuLink href="/add-idea" icon={<FiPlusCircle />}>
                    Add Idea
                  </MenuLink>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-300 md:hidden dark:border-neutral-700 cursor-pointer"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-neutral-200 px-4 py-3 md:hidden dark:border-neutral-800">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}>
                {l.label}
              </Link>
            ))}
            {!loading && !user && (
              <div className="mt-2 flex gap-2">
                <Link href="/login" className="btn-secondary flex-1">
                  Login
                </Link>
                <Link href="/register" className="btn-primary flex-1">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MenuLink({ href, icon, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
    >
      {icon}
      {children}
    </Link>
  );
}

function Avatar({ user }) {
  if (user.photoURL) {
    return (
      <Image
        src={user.photoURL}
        alt={user.name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
      />
    );
  }
  return (
    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
      {user.name?.charAt(0)?.toUpperCase() || 'U'}
    </span>
  );
}
