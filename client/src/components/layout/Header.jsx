import React from 'react';
import { Sparkles, Radio, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="flex flex-col items-center justify-center pt-8 pb-6 text-center relative z-10">
      {/* Glowing Floating Status Pill */}
      <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md text-xs font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] mb-4 weightless-lift">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="tracking-wider uppercase text-[11px]">Neural Studio Active</span>
        <Activity className="w-3.5 h-3.5 text-cyan-400 ml-0.5 animate-pulse" />
      </div>

      {/* Main Gradient Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-3">
        <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
          Voice
        </span>
        <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
          Verse
        </span>
        <span className="text-xs align-super ml-2 font-semibold text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-950/40">
          PRO
        </span>
      </h1>

      {/* Subtitle */}
      <p className="max-w-xl text-sm sm:text-base text-slate-400 font-normal leading-relaxed px-4">
        Synthesize hyper-realistic AI neural speech powered by weightless zero-gravity sound architecture.
      </p>
    </header>
  );
}

export default Header;
