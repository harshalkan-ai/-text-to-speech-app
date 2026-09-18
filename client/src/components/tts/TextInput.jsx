import React from 'react';
import { Trash2, MessageSquare, AlertCircle } from 'lucide-react';

export function TextInput({ text, setText, maxChars = 5000 }) {
  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isNearLimit = charCount > maxChars * 0.9;
  const isExceeded = charCount > maxChars;

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Label and Actions Bar */}
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Input Script</span>
        </label>
        
        {text.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors py-1 px-2.5 rounded-lg hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Textarea Input Container */}
      <div className="relative group">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter or paste your text here to transform it into stunning AI speech..."
          rows={6}
          className={`w-full bg-[#0b0f24] text-slate-100 placeholder-slate-500 rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed resize-none transition-all outline-none border border-slate-700/60 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:bg-[#0e1430] ${
            isExceeded
              ? 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/30'
              : isNearLimit
              ? 'border-amber-500/60'
              : ''
          }`}
        />

        {/* Character and Word Count Footer */}
        <div className="flex items-center justify-between pt-2 px-2 text-xs">
          <div className="flex items-center gap-3 text-slate-400">
            <span>{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          </div>

          <div
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              isExceeded
                ? 'text-rose-400 font-bold'
                : isNearLimit
                ? 'text-amber-400'
                : 'text-slate-400'
            }`}
          >
            {isExceeded && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            <span>
              {charCount.toLocaleString()} / {maxChars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextInput;
