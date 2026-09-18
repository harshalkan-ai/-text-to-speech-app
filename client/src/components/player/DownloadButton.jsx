import React, { useState } from 'react';
import { Download, Check, Loader2 } from 'lucide-react';

export function DownloadButton({ audioUrl, fileName }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!audioUrl) return;

    try {
      setIsDownloading(true);
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName || `voiceverse-speech-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      setIsDownloaded(true);
      setTimeout(() => setIsDownloaded(false), 3000);
    } catch (err) {
      console.error('Download failed, falling back to direct window open:', err);
      window.open(audioUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDownloading || !audioUrl}
      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
        isDownloaded
          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
          : 'bg-indigo-600/20 hover:bg-indigo-600/30 border-indigo-500/40 text-indigo-200 hover:text-white hover:border-indigo-400'
      }`}
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-indigo-300" />
          <span>Downloading...</span>
        </>
      ) : isDownloaded ? (
        <>
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Saved MP3</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Download Audio</span>
        </>
      )}
    </button>
  );
}

export default DownloadButton;
