import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(src) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  // Initialize or update audio source
  useEffect(() => {
    if (!src) {
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      return;
    }

    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = isMuted ? 0 : volume;
    audio.playbackRate = playbackRate;

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onError = (e) => {
      console.error('Audio playback error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    if (audioRef.current && src) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio play error:', err);
      });
    }
  }, [src]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((percentage) => {
    if (audioRef.current && duration > 0) {
      const newTime = (percentage / 100) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, [duration]);

  const handleVolumeChange = useCallback((newVolume) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : vol;
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMute = !prev;
      if (audioRef.current) {
        audioRef.current.volume = nextMute ? 0 : volume;
      }
      return nextMute;
    });
  }, [volume]);

  const handleSpeedChange = useCallback((newRate) => {
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  }, []);

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return {
    isPlaying,
    duration,
    currentTime,
    progressPercentage,
    volume,
    isMuted,
    playbackRate,
    play,
    pause,
    togglePlay,
    seek,
    handleVolumeChange,
    toggleMute,
    handleSpeedChange,
  };
}
