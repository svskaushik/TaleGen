let audio: HTMLAudioElement | null = null;
let isAudioPlaying = false;

export async function speak(text: string): Promise<void> {
  stopSpeaking(); // Stop any existing audio before starting a new one
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const audioContent = await response.arrayBuffer();
    const audioBlob = new Blob([audioContent], { type: 'audio/mp3' });
    const audioUrl = URL.createObjectURL(audioBlob);
    audio = new Audio(audioUrl);
    
    audio.onplaying = () => { isAudioPlaying = true; };
    audio.onpause = () => { isAudioPlaying = false; };
    audio.onended = () => { 
      isAudioPlaying = false;
      audio = null;
    };

    await audio.play();
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    isAudioPlaying = false;
    audio = null;
  }
}

export function pauseSpeaking(): void {
  audio?.pause();
  isAudioPlaying = false;
}

export function resumeSpeaking(): void {
  audio?.play();
  isAudioPlaying = true;
}

export function stopSpeaking(): void {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    isAudioPlaying = false;
    audio = null;
  }
}

export function isPlaying(): boolean {
  return isAudioPlaying;
}
