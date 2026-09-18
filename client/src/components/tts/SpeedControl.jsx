import React from 'react';
import { Gauge } from 'lucide-react';

const SPEED_OPTIONS = [
  { label: '0.75x', value: 0.75 },
  { label: '1.0x', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
];

export function SpeedControl({ speed, setSpeed }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
        <Gauge className="w-4 h-4 text-violet-400" />
        <span>Pace / Speed</span>
      </label>

      <div className="grid grid-cols-4 gap-2">
        {SPEED_OPTIONS.map((opt) => {
          const isActive = parseFloat(speed) === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSpeed(opt.value)}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-500/60 hover:bg-slate-800/60'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SpeedControl;
