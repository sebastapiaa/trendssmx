'use client';
// Global scroll behavior: nav frosting, progress bar, hero parallax,
// .reveal intersection reveals. Re-runs on route change.
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ScrollFX() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nav = document.getElementById('nav');
    const solid = nav?.classList.contains('solid') ?? false;
    const progress = document.querySelector<HTMLElement>('.progress');
    const heroInner = document.getElementById('heroInner');
    let ticking = false;

    function onScroll() {
      const y = window.scrollY;
      if (nav && !solid) {
        // hysteresis band so the frosting doesn't flicker at the boundary
        const th = window.innerHeight * 0.7;
        if (y > th + 24) nav.classList.add('scrolled');
        else if (y < th - 24) nav.classList.remove('scrolled');
      }
      const h = document.documentElement.scrollHeight - window.innerHeight;
      // scaleX, not width — stays on the compositor (no layout per frame)
      if (progress) progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
      if (heroInner && !reduced && y < window.innerHeight * 1.2) {
        const p = Math.min(y / (window.innerHeight * 0.9), 1);
        heroInner.style.transform = `translateY(${p * -60}px) scale(${1 - p * 0.12})`;
        heroInner.style.opacity = String(1 - p * 0.9);
      }
      ticking = false;
    }
    function onScrollRaf() {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScrollRaf, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -6% 0px' },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener('scroll', onScrollRaf);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
