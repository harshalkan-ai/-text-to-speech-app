import React from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳' },
  { code: 'hi-IN', name: 'Hindi (हिंदी)', flag: '🇮🇳' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
];

export function LanguageSelector({ selectedLanguage, setSelectedLanguage }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-200">
        <Globe className="w-4 h-4 text-cyan-400" />
        <span>Target Language</span>
      </label>

      <div className="relative">
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          className="w-full glass-input rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer focus:ring-2 focus:ring-cyan-500/30 pr-10"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="bg-slate-900 text-slate-100">
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        {/* Custom Chevron Indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default LanguageSelector;
