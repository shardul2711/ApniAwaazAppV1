import React, { createContext, useContext, useState, useEffect } from 'react';
import { Colors, HighContrastColors, Typography } from './tokens';

export type TextScale = 'standard' | 'large' | 'xlarge';
export type SpeechSpeed = 'slow' | 'normal' | 'fast';
export type Language = 'mr' | 'hi' | 'en';

interface ThemeContextType {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  speechSpeed: SpeechSpeed;
  setSpeechSpeed: (speed: SpeechSpeed) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  colors: typeof Colors;
  scaleFont: (baseSize: number) => number;
  scaleLineHeight: (baseLineHeight: number) => number;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [textScale, setTextScale] = useState<TextScale>('standard');
  const [speechSpeed, setSpeechSpeed] = useState<SpeechSpeed>('normal');
  const [language, setLanguage] = useState<Language>('hi'); // Default Hindi as in Stitch mockups

  const scaleMultiplier = textScale === 'xlarge' ? 1.3 : textScale === 'large' ? 1.15 : 1.0;

  const scaleFont = (baseSize: number): number => {
    return Math.round(baseSize * scaleMultiplier);
  };

  const scaleLineHeight = (baseLineHeight: number): number => {
    return Math.round(baseLineHeight * scaleMultiplier);
  };

  const colors = highContrast ? HighContrastColors : Colors;

  return (
    <ThemeContext.Provider
      value={{
        highContrast,
        setHighContrast,
        textScale,
        setTextScale,
        speechSpeed,
        setSpeechSpeed,
        language,
        setLanguage,
        colors,
        scaleFont,
        scaleLineHeight,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
