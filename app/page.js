import Link from 'next/link';
import { FiEdit3, FiSearch, FiMessageCircle, FiArrowRight } from 'react-icons/fi';
import Banner from '@/components/home/Banner';
import TrendingIdeas from '@/components/home/TrendingIdeas';
import { CATEGORIES } from '@/lib/categories';

const steps = [
  {
    icon: FiEdit3,
    title: 'Share your idea',
    text: 'Post your startup concept with the problem it solves and your proposed solution.',
  },
  {
    icon: FiSearch,
    title: 'Get discovered',
    text: 'Your idea joins a searchable, filterable library explored by founders and enthusiasts.',
  },
  {
    icon: FiMessageCircle,
    title: 'Validate & refine',
    text: 'Collect comments and discussion to sharpen your concept into something fundable.',
  },
];

const categoryEmoji = {
  Tech: '💻',
  Health: '🩺',
  AI: '🤖',
  Education: '🎓',
  Finance: '💰',
  Sustainability: '🌱',
  'E-commerce': '🛒',
  Social: '🫂',
  Other: '✨',
};

export default function HomePage() {
  return (
    <>
      <Banner />
      <TrendingIdeas />

      {/* Extra section 1: How it works */}
      <section className="border-y border-neutral-200 bg-white py-16 dark:border-neutral-800 dark:bg-neutral-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">How IdeaVault works</h2>
            <p className="mt-3 text-neutral-500">
              From a spark of inspiration to a validated concept in three simple steps.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="card p-7">
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
                  <s.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-semibold text-brand-600">STEP {i + 1}</span>
                <h3 className="mt-1 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra section 2: Browse by category */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Browse by category</h2>
          <p className="mt-3 text-neutral-500">Find ideas in the space you care about most.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/ideas?category=${encodeURIComponent(c)}`}
              className="card flex flex-col items-center justify-center gap-2 p-6 text-center hover:border-brand-300"
            >
              <span className="text-3xl">{categoryEmoji[c]}</span>
              <span className="text-sm font-semibold">{c}</span>
            </Link>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 px-6 py-12 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Have an idea worth sharing?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Join IdeaVault and put your startup concept in front of a community ready to help it grow.
          </p>
          <Link href="/add-idea" className="btn mt-6 bg-white px-6 py-3 text-brand-700 hover:bg-white/90">
            Share Your Idea <FiArrowRight />
          </Link>
        </div>
      </section>
    </>
  );
}
