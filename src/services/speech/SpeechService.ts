import * as Speech from 'expo-speech';
import { LanguageCode } from '../../types';

export interface ISpeechProvider {
  speak(text: string, language: LanguageCode, rate?: number): Promise<void>;
  stopSpeaking(): Promise<void>;
  isSpeakingAsync(): Promise<boolean>;
}

class ExpoSpeechProvider implements ISpeechProvider {
  private getLanguageTag(lang: LanguageCode): string {
    switch (lang) {
      case 'mr':
        return 'mr-IN';
      case 'hi':
        return 'hi-IN';
      case 'en':
      default:
        return 'en-IN';
    }
  }

  async speak(text: string, language: LanguageCode, rate = 0.9): Promise<void> {
    try {
      await Speech.stop();
      Speech.speak(text, {
        language: this.getLanguageTag(language),
        pitch: 1.0,
        rate: rate,
      });
    } catch (e) {
      console.warn('Speech playback failed:', e);
    }
  }

  async stopSpeaking(): Promise<void> {
    try {
      await Speech.stop();
    } catch (e) {
      console.warn('Stop speech failed:', e);
    }
  }

  async isSpeakingAsync(): Promise<boolean> {
    try {
      return await Speech.isSpeakingAsync();
    } catch {
      return false;
    }
  }
}

export const speechService: ISpeechProvider = new ExpoSpeechProvider();
