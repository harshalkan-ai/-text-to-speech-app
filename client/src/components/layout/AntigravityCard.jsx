import React from 'react';

export function AntigravityCard({ children, className = '' }) {
  return (
    <div
      className={`glass-panel rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden transition-all duration-500 border border-white/10 shadow-antigravity ${className}`}
    >
      {/* Top subtle neon border accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-indigo-500 opacity-60" />
      
      {/* Background radial glow spot inside card */}
      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AntigravityCard;
