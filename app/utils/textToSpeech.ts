export type { SpeechSynthesisUtterance };

// Keep these functions for fallback or browser compatibility
export function speak(text: string): void {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  } else {
    console.error('Text-to-speech not supported in this browser');
  }
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
