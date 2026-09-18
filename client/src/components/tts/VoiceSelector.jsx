import React from 'react';
import { Mic, Loader2 } from 'lucide-react';

export function VoiceSelector({ voices, selectedVoice, setSelectedVoice, isFetching }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
        <Mic className="w-4 h-4 text-indigo-400" />
        <span>Neural Voice</span>
      </label>

      <div className="relative">
        <select
          value={selectedVoice}
          onChange={(e) => setSelectedVoice(e.target.value)}
          disabled={isFetching || voices.length === 0}
          className="w-full glass-input rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-indigo-500/30 pr-10 disabled:opacity-50"
        >
          {isFetching ? (
            <option className="bg-slate-900 text-slate-400">Loading Neural Voices...</option>
          ) : voices.length === 0 ? (
            <option className="bg-slate-900 text-slate-400">No voices available</option>
          ) : (
            voices.map((voice) => {
              const voiceId = voice.id || voice.name;
              const genderTag = voice.gender ? ` (${voice.gender})` : '';
              const providerTag = voice.provider ? ` [${voice.provider}]` : '';
              return (
                <option key={voiceId} value={voiceId} className="bg-slate-900 text-slate-100">
                  {voice.name}{genderTag}{providerTag}
                </option>
              );
            })
          )}
        </select>

        {/* Loading Spinner or Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
          ) : (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

export default VoiceSelector;
