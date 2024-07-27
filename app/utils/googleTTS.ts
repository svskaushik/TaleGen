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
    const audio = new Audio(audioUrl);
    audio.play();
  } catch (error) {
    console.error('Error in text-to-speech:', error);
  }
}

export function stopSpeaking(): void {
  // Implement stop functionality if needed
}
