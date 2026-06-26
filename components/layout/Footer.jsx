import Link from 'next/link';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaFacebookF } from 'react-icons/fa6';
import { FiMail, FiMapPin } from 'react-icons/fi';

const platformLinks = [
  { href: '/', label: 'Home' },
  { href: '/ideas', label: 'Ideas' },
  { href: '/add-idea', label: 'Share an Idea' },
  { href: '/my-ideas', label: 'My Ideas' },
];

const socials = [
  { href: 'https://x.com', label: 'X', icon: FaXTwitter },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: FaLinkedinIn },
  { href: 'https://github.com', label: 'GitHub', icon: FaGithub },
  { href: 'https://facebook.com', label: 'Facebook', icon: FaFacebookF },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <HiOutlineLightBulb className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold">
              Idea<span className="text-brand-600">Vault</span>
            </span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-neutral-500">
            Share innovative startup ideas, explore trending concepts, and validate them with
            community feedback.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Platform
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {platformLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-neutral-500 transition hover:text-brand-600 dark:hover:text-brand-400"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-neutral-500">
            <li className="flex items-center gap-2">
              <FiMail className="h-4 w-4" /> hello@ideavault.app
            </li>
            <li className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4" /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-900 dark:text-white">
            Follow us
          </h3>
          <div className="mt-4 flex gap-2">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-300 text-neutral-600 transition hover:bg-brand-600 hover:text-white hover:border-brand-600 dark:border-neutral-700 dark:text-neutral-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 py-5 text-center text-sm text-neutral-500 dark:border-neutral-800">
        © {new Date().getFullYear()} IdeaVault. All rights reserved.
      </div>
    </footer>
  );
}
