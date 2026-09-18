import React from 'react';

export function VisualizerWave({ isPlaying, barCount = 24 }) {
  // Generate pseudo-random bar heights for a organic equalizer shape
  const bars = Array.from({ length: barCount }, (_, i) => {
    // Create a smooth bell-curve inspired distribution
    const factor = Math.sin((i / (barCount - 1)) * Math.PI);
    const minHeight = 15;
    const maxHeight = 85;
    const baseHeight = Math.floor(minHeight + factor * (maxHeight - minHeight));
    const animDelay = (i * 0.08).toFixed(2);
    const animDuration = (0.8 + (i % 5) * 0.15).toFixed(2);
    return { baseHeight, animDelay, animDuration };
  });

  return (
    <div className="flex items-center justify-center gap-[3px] h-12 px-3 py-1 bg-slate-950/40 rounded-xl border border-white/5 backdrop-blur-sm">
      {bars.map((bar, idx) => (
        <div
          key={idx}
          className={`w-[3px] sm:w-[4px] rounded-full transition-all duration-300 ${
            isPlaying
              ? 'bg-gradient-to-t from-cyan-500 via-indigo-400 to-violet-400 animate-bar-dance'
              : 'bg-slate-700/60'
          }`}
          style={{
            height: isPlaying ? undefined : `${bar.baseHeight}%`,
            animationDelay: isPlaying ? `${bar.animDelay}s` : undefined,
            animationDuration: isPlaying ? `${bar.animDuration}s` : undefined,
          }}
        />
      ))}
    </div>
  );
}

export default VisualizerWave;
