// Speech Recognition API cross-browser interface
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class AudioSpeechService {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  public startListening(
    onResult: (transcript: string, isFinal: boolean) => void,
    onError: (error: string) => void,
    onEnd: () => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. You can still type your answer.');
      return;
    }

    if (this.isListening) return;

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      onResult(finalTranscript || interimTranscript, !!finalTranscript);
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      let msg = 'Microphone error occurred.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone permission was denied. Please allow microphone access or switch to text mode.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech was detected. Please try speaking again.';
      }
      onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.isListening = true;
      this.recognition.start();
    } catch (e: any) {
      this.isListening = false;
      onError('Could not start microphone recording: ' + e.message);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new AudioSpeechService();
