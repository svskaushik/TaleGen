import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const time = Number(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <audio ref={audioRef} src={audioUrl} />
      <div className="flex items-center justify-between mb-2">
        <button onClick={togglePlayPause} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <div>
          {Math.floor(currentTime)}/{Math.floor(duration)} seconds
        </div>
      </div>
      <input
        type="range"
        min="0"
        max={duration}
        value={currentTime}
        onChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
}

export default AudioPlayer;
