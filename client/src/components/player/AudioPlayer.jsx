import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Copy, Check, Globe } from 'lucide-react';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import VisualizerWave from './VisualizerWave';
import DownloadButton from './DownloadButton';

function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ audioResult }) {
  // All hooks strictly declared at the top level
  const [copied, setCopied] = useState(false);
  const audioUrl = audioResult?.audioUrl || null;

  const {
    isPlaying,
    duration,
    currentTime,
    progressPercentage,
    volume,
    isMuted,
    playbackRate,
    togglePlay,
    seek,
    handleVolumeChange,
    toggleMute,
    handleSpeedChange,
  } = useAudioPlayer(audioUrl);

  // Safe early exit AFTER hooks have been declared
  if (!audioResult || !audioResult.audioUrl) {
    return null;
  }

  const { fileName, characterCount, voiceId, language, translatedText } = audioResult;

  const handleScrub = (e) => {
    const val = parseFloat(e.target.value);
    seek(val);
  };

  const cycleSpeed = () => {
    const rates = [1.0, 1.25, 1.5, 2.0, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    handleSpeedChange(nextRate);
  };

  const handleCopyText = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="mt-8 rounded-3xl bg-slate-900/90 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-antigravity relative overflow-hidden animate-float-slow">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 opacity-80" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            Synthesized Audio Ready
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-2 truncate max-w-sm">
            {fileName || 'VoiceVerse_Audio.mp3'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Voice: <span className="text-indigo-300 font-medium">{voiceId || 'Default'}</span> • Language: <span className="text-cyan-300 font-medium">{language || 'en-US'}</span> • {characterCount || 0} characters
          </p>
        </div>

        <DownloadButton audioUrl={audioUrl} fileName={fileName} />
      </div>

      {/* Translated / Synthesized Text Output Card */}
      {translatedText && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Synthesized Speech Script ({language || 'Target'})</span>
            </div>
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 px-2 py-0.5 rounded bg-slate-800/60 hover:bg-slate-700/60 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-normal select-text">
            {translatedText}
          </p>
        </div>
      )}

      {/* Visualizer Waveform */}
      <div className="mb-6">
        <VisualizerWave isPlaying={isPlaying} barCount={32} />
      </div>

      {/* Scrubber & Timeline Bar */}
      <div className="flex flex-col gap-1.5 mb-6">
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={progressPercentage || 0}
            onChange={handleScrub}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800 accent-cyan-400 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #06b6d4 0%, #6366f1 ${progressPercentage}%, #1e293b ${progressPercentage}%, #1e293b 100%)`,
            }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-slate-400 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls Toolbar */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
        {/* Left: Play/Pause Big Button */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Speed Toggle Pill */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 bg-slate-800/80 border border-slate-700 hover:border-slate-500 transition-colors"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Right: Volume & Mute Controller */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="text-slate-400 hover:text-cyan-400 transition-colors p-1.5 rounded-lg"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-5 h-5 text-rose-400" />
            ) : (
              <Volume2 className="w-5 h-5 text-cyan-400" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-20 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
