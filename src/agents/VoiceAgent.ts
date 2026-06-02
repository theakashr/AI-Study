// Note: This agent runs on the client-side as it relies on the browser's Web Speech API.

export class VoiceAgent {
  private recognition: any;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;

  constructor(
    private onSpeechResult: (text: string) => void,
    private onError: (error: string) => void
  ) {
    if (typeof window !== "undefined") {
      this.synthesis = window.speechSynthesis;
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          this.onSpeechResult(transcript);
        };

        this.recognition.onerror = (event: any) => {
          this.onError(event.error);
        };

        this.recognition.onend = () => {
          this.isListening = false;
        };
      } else {
        console.warn("Speech Recognition API is not supported in this browser.");
      }
    }
  }

  startListening() {
    if (this.recognition && !this.isListening) {
      this.recognition.start();
      this.isListening = true;
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  speak(text: string) {
    if (this.synthesis) {
      // Cancel any ongoing speech
      this.synthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
      this.synthesis.speak(utterance);
    }
  }
}
