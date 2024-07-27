let audio: HTMLAudioElement | null = null;

export async function speak(text: string): Promise<void> {
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
    await audio.play();
  } catch (error) {
    console.error('Error in text-to-speech:', error);
  }
}

export function pauseSpeaking(): void {
  audio?.pause();
}

export function resumeSpeaking(): void {
  audio?.play();
}

export function stopSpeaking(): void {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function isPlaying(): boolean {
  return audio ? !audio.paused : false;
}
