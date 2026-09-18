import React from 'react';
import Header from './components/layout/Header';
import AntigravityCard from './components/layout/AntigravityCard';
import TextInput from './components/tts/TextInput';
import LanguageSelector from './components/tts/LanguageSelector';
import VoiceSelector from './components/tts/VoiceSelector';
import SpeedControl from './components/tts/SpeedControl';
import GenerateButton from './components/tts/GenerateButton';
import AudioPlayer from './components/player/AudioPlayer';
import ErrorAlert from './components/ui/ErrorAlert';
import { useTTS } from './hooks/useTTS';

export function App() {
  const {
    text,
    setText,
    voices,
    selectedVoice,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage,
    speed,
    setSpeed,
    isLoading,
    isFetchingVoices,
    error,
    clearError,
    audioResult,
    generateSpeech,
  } = useTTS();

  return (
    <div className="relative min-h-screen bg-[#060813] text-slate-100 flex flex-col items-center justify-between p-4 sm:p-6 md:p-10 overflow-hidden">
      {/* Background Cosmic Glow Orbs */}
      <div className="ambient-glow-cyan top-10 -left-20 animate-pulse-glow" />
      <div className="ambient-glow-indigo bottom-20 -right-20 animate-float-slow" />
      <div className="ambient-glow-violet top-1/3 right-1/4 animate-float-medium" />

      {/* Main Container */}
      <div className="w-full max-w-4xl mx-auto relative z-10 space-y-6">
        {/* Floating Error Toast */}
        <ErrorAlert message={error} onClose={clearError} />

        {/* Header Component */}
        <Header />

        {/* Main Interface Card */}
        <AntigravityCard>
          <div className="flex flex-col gap-6">
            {/* Script Textarea Input */}
            <TextInput text={text} setText={setText} maxChars={5000} />

            {/* Config Selectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
              <VoiceSelector
                voices={voices}
                selectedVoice={selectedVoice}
                setSelectedVoice={setSelectedVoice}
                isFetching={isFetchingVoices}
              />
              <SpeedControl speed={speed} setSpeed={setSpeed} />
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <GenerateButton
                onGenerate={generateSpeech}
                isLoading={isLoading}
                disabled={!text.trim() || isFetchingVoices}
              />
            </div>
          </div>
        </AntigravityCard>

        {/* Audio Player Component (Rendered when speech generated) */}
        {audioResult && (
          <AudioPlayer audioResult={audioResult} key={audioResult.audioUrl || 'audio-player'} />
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 pt-8 pb-4">
          <p>© 2026 VoiceVerse Neural Studio • Antigravity AI Architecture</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
