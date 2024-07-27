import React, { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

interface NarrationPlayerProps {
  content: string;
}

const NarrationPlayer: React.FC<NarrationPlayerProps> = ({ content }) => {
  const [narrationAudioUrl, setNarrationAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const generateNarration = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: content }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setNarrationAudioUrl(url);
      } catch (error) {
        console.error('Error generating narration:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateNarration();
  }, [content]);

  return (
    <div className="mt-2">
      {isLoading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <span className="ml-2 text-gray-700 dark:text-gray-300">Loading narration...</span>
        </div>
      )}
      {!isLoading && narrationAudioUrl && <AudioPlayer audioUrl={narrationAudioUrl} />}
    </div>
  );
};

export default NarrationPlayer;
