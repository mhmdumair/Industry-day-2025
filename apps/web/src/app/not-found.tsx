'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ErrorNavbar from '@/components/custom/ErrorNavbar';

export default function NotFound() {
  const router = useRouter();
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });

  // Glitch effect - random shifts
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      const shouldGlitch = Math.random() > 0.7;
      if (shouldGlitch) {
        setGlitchOffset({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 8,
        });
        setTimeout(
          () => setGlitchOffset({ x: 0, y: 0 }),
          50 + Math.random() * 100
        );
      }
    }, 100);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <>
      <ErrorNavbar />
      <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono animate-flicker">
        {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-[15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main 404 */}
      <div className="relative z-5">
        <div
          className="text-[clamp(120px,35vw,400px)] font-bold text-black dark:text-white leading-[0.85] tracking-tight relative select-none"
          style={{
            transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
          }}
        >
          <span className="block relative">404</span>

          {/* Red glitch layer */}
          <span
            className="absolute top-0 left-0 w-full h-full text-[#ff0040] dark:text-[#ff0040] mix-blend-multiply dark:mix-blend-screen animate-glitch-red"
            aria-hidden="true"
          >
            404
          </span>

          {/* Cyan glitch layer */}
          <span
            className="absolute top-0 left-0 w-full h-full text-[#00ffff] dark:text-[#00ffff] mix-blend-multiply dark:mix-blend-screen animate-glitch-cyan"
            aria-hidden="true"
          >
            404
          </span>

          {/* Slice glitch layers */}
          <span
            className="absolute top-0 left-0 w-full h-full text-[#0a0a0a] dark:text-white animate-glitch-slice-1"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 35%, 0 35%)' }}
            aria-hidden="true"
          >
            404
          </span>
          <span
            className="absolute top-0 left-0 w-full h-full text-[#0a0a0a] dark:text-white animate-glitch-slice-2"
            style={{ clipPath: 'polygon(0 65%, 100% 65%, 100% 100%, 0 100%)' }}
            aria-hidden="true"
          >
            404
          </span>
        </div>
      </div>

      {/* Error message */}
      <p className="mt-8 text-sm text-[#666] dark:text-[#999] text-center z-20 relative tracking-wide mx-4">
        Page not found. The page you&apos;re looking for doesn&apos;t exist.
      </p>

      {/* Buttons */}
      <div className="flex gap-3 mt-6 z-20 relative">
      </div>
    </div>
    </>
  );
}
