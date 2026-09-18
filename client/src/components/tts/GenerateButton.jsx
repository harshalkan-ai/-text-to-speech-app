import React from 'react';
import { Play, Loader2, Wand2 } from 'lucide-react';

export function GenerateButton({ onGenerate, isLoading, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onGenerate}
      disabled={isLoading || disabled}
      className={`relative w-full overflow-hidden group rounded-2xl py-4 px-6 font-bold text-base sm:text-lg text-white shadow-antigravity transition-all duration-300 weightless-lift ${
        isLoading || disabled
          ? 'opacity-60 cursor-not-allowed bg-slate-800'
          : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 hover:brightness-110 active:scale-[0.99] hover:shadow-antigravity-lg'
      }`}
    >
      {/* Dynamic shimmer sheen overlay */}
      <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />

      <div className="flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-cyan-200" />
            <span className="tracking-wide">Synthesizing Speech...</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-200 group-hover:rotate-12 transition-transform duration-300" />
            <span className="tracking-wide">Generate Neural Speech</span>
          </>
        )}
      </div>
    </button>
  );
}

export default GenerateButton;
