'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FiArrowRight } from 'react-icons/fi';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    eyebrow: 'Where ideas find their people',
    title: 'Turn your startup spark into reality',
    text: 'Share bold concepts, gather honest feedback, and validate what matters before you build.',
    gradient: 'from-indigo-600 via-violet-600 to-purple-700',
  },
  {
    eyebrow: 'Discover what’s trending',
    title: 'Explore ideas shaping tomorrow',
    text: 'Browse innovative concepts across Tech, Health, AI, Education and more — updated by the community.',
    gradient: 'from-blue-600 via-cyan-600 to-teal-600',
  },
  {
    eyebrow: 'Build together',
    title: 'Refine concepts through conversation',
    text: 'Comment, discuss, and help fellow founders sharpen their vision into something fundable.',
    gradient: 'from-fuchsia-600 via-pink-600 to-rose-600',
  },
];

export default function Banner() {
  return (
    <section className="relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-[78vh] max-h-[640px] min-h-[460px]"
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className={`flex h-full w-full items-center bg-gradient-to-br ${s.gradient}`}>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl text-white animate-fade-in">
                  <p className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur">
                    {s.eyebrow}
                  </p>
                  <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                    {s.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-lg text-white/85">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/ideas"
                      className="btn bg-white px-6 py-3 text-brand-700 hover:bg-white/90"
                    >
                      Explore Ideas <FiArrowRight />
                    </Link>
                    <Link
                      href="/add-idea"
                      className="btn border border-white/40 px-6 py-3 text-white hover:bg-white/10"
                    >
                      Share Your Idea
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
