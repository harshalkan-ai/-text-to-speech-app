import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchVoices, generateSpeechApi } from '../services/ttsApi';

const FALLBACK_VOICES = [
  // English (US)
  { id: 'en-US-JennyNeural', name: 'Jenny (Warm & Natural)', language: 'en-US', gender: 'Female', provider: 'neural-studio' },
  { id: 'en-US-GuyNeural', name: 'Guy (Confident & Clear)', language: 'en-US', gender: 'Male', provider: 'neural-studio' },
  { id: 'en-US-AriaNeural', name: 'Aria (Expressive & Melodic)', language: 'en-US', gender: 'Female', provider: 'neural-studio' },
  { id: 'en-US-ChristopherNeural', name: 'Christopher (Authoritative & Deep)', language: 'en-US', gender: 'Male', provider: 'neural-studio' },

  // English (UK)
  { id: 'en-GB-SoniaNeural', name: 'Sonia (Sophisticated British)', language: 'en-GB', gender: 'Female', provider: 'neural-studio' },
  { id: 'en-GB-RyanNeural', name: 'Ryan (Modern British)', language: 'en-GB', gender: 'Male', provider: 'neural-studio' },

  // English (India)
  { id: 'en-IN-NeerjaNeural', name: 'Neerja (Melodic Indian English)', language: 'en-IN', gender: 'Female', provider: 'neural-studio' },
  { id: 'en-IN-PrabhatNeural', name: 'Prabhat (Clear Indian English)', language: 'en-IN', gender: 'Male', provider: 'neural-studio' },

  // Hindi (India)
  { id: 'hi-IN-SwaraNeural', name: 'Swara (Expressive Hindi)', language: 'hi-IN', gender: 'Female', provider: 'neural-studio' },
  { id: 'hi-IN-MadhurNeural', name: 'Madhur (Deep & Clear Hindi)', language: 'hi-IN', gender: 'Male', provider: 'neural-studio' },

  // Gujarati (India)
  { id: 'gu-IN-DhwaniNeural', name: 'Dhwani (Melodic Gujarati)', language: 'gu-IN', gender: 'Female', provider: 'neural-studio' },
  { id: 'gu-IN-NiranjanNeural', name: 'Niranjan (Crisp Gujarati)', language: 'gu-IN', gender: 'Male', provider: 'neural-studio' },

  // Marathi (India)
  { id: 'mr-IN-AarohiNeural', name: 'Aarohi (Expressive Marathi)', language: 'mr-IN', gender: 'Female', provider: 'neural-studio' },
  { id: 'mr-IN-ManoharNeural', name: 'Manohar (Confident Marathi)', language: 'mr-IN', gender: 'Male', provider: 'neural-studio' },

  // Spanish (Spain)
  { id: 'es-ES-ElviraNeural', name: 'Elvira (Dynamic Spanish)', language: 'es-ES', gender: 'Female', provider: 'neural-studio' },
  { id: 'es-ES-AlvaroNeural', name: 'Alvaro (Warm Spanish)', language: 'es-ES', gender: 'Male', provider: 'neural-studio' },

  // French (France)
  { id: 'fr-FR-DeniseNeural', name: 'Denise (Elegant French)', language: 'fr-FR', gender: 'Female', provider: 'neural-studio' },
  { id: 'fr-FR-HenriNeural', name: 'Henri (Narrative French)', language: 'fr-FR', gender: 'Male', provider: 'neural-studio' },

  // German (Germany)
  { id: 'de-DE-KatjaNeural', name: 'Katja (Clear German)', language: 'de-DE', gender: 'Female', provider: 'neural-studio' },
  { id: 'de-DE-ConradNeural', name: 'Conrad (Deep German)', language: 'de-DE', gender: 'Male', provider: 'neural-studio' },
];

export function useTTS() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState(FALLBACK_VOICES);
  const [selectedVoice, setSelectedVoice] = useState(FALLBACK_VOICES[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [speed, setSpeed] = useState(1.0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingVoices, setIsFetchingVoices] = useState(false);
  const [error, setError] = useState(null);
  const [audioResult, setAudioResult] = useState(null);

  // Load available voices from backend API
  useEffect(() => {
    let isMounted = true;
    const loadVoices = async () => {
      try {
        setIsFetchingVoices(true);
        const res = await fetchVoices();
        if (isMounted) {
          if (res?.voices && Array.isArray(res.voices) && res.voices.length > 0) {
            setVoices(res.voices);
          } else {
            setVoices(FALLBACK_VOICES);
          }
        }
      } catch (err) {
        if (isMounted) {
          setVoices(FALLBACK_VOICES);
        }
      } finally {
        if (isMounted) {
          setIsFetchingVoices(false);
        }
      }
    };

    loadVoices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update selected voice when language changes
  const handleLanguageChange = useCallback((newLang) => {
    setSelectedLanguage(newLang);
    const matchingVoice = voices.find(v => v.language === newLang);
    if (matchingVoice) {
      setSelectedVoice(matchingVoice.id || matchingVoice.name);
    }
  }, [voices]);

  // Filter voices based on selected language
  const availableVoices = useMemo(() => {
    const matching = voices.filter(v => v.language === selectedLanguage);
    return matching.length > 0 ? matching : voices;
  }, [voices, selectedLanguage]);

  // Keep selectedVoice valid when available voices change
  useEffect(() => {
    if (availableVoices.length > 0) {
      const exists = availableVoices.some(v => v.id === selectedVoice || v.name === selectedVoice);
      if (!exists) {
        setSelectedVoice(availableVoices[0].id || availableVoices[0].name);
      }
    }
  }, [availableVoices, selectedVoice]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const generateSpeech = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter text to synthesize.');
      return null;
    }

    if (text.length > 5000) {
      setError('Text exceeds the 5,000 character maximum limit.');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const payload = {
        text: text.trim(),
        voice: selectedVoice,
        language: selectedLanguage,
        speed: parseFloat(speed),
      };

      const response = await generateSpeechApi(payload);
      
      if (response?.success && response?.data) {
        setAudioResult(response.data);
        return response.data;
      } else {
        throw new Error(response?.error?.message || response?.error || 'Failed to synthesize speech.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during synthesis.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [text, selectedVoice, selectedLanguage, speed]);

  return {
    text,
    setText,
    voices: availableVoices,
    allVoices: voices,
    selectedVoice,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage: handleLanguageChange,
    speed,
    setSpeed,
    isLoading,
    isFetchingVoices,
    error,
    setError,
    clearError,
    audioResult,
    setAudioResult,
    generateSpeech,
  };
}
