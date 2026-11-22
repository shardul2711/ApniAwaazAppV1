/**
 * Apni Awaaz Design Tokens
 * Directly extracted from stitch_apni_awaaz_voice_assistant/apni_awaaz/DESIGN.md
 */

export const Colors = {
  // Surfaces & Backgrounds
  canvas: '#F7F9F7',
  surface: '#e7fefc',
  surfaceDim: '#c8dfdc',
  surfaceBright: '#e7fefc',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#e1f8f6',
  surfaceContainer: '#dcf2f0',
  surfaceContainerHigh: '#d6edeb',
  surfaceContainerHighest: '#d0e7e5',

  // Typography & Inks
  onSurface: '#0a1f1e',
  onSurfaceVariant: '#3f4947',
  inverseSurface: '#203433',
  inverseOnSurface: '#dff5f3',

  // Outlines & Borders
  outline: '#6f7977',
  outlineVariant: '#bec9c6',
  borderDefault: '#E5ECE8',
  inputBorder: '#728783',

  // Primary - Heritage Deep Teal
  primary: '#00423b',
  onPrimary: '#ffffff',
  primaryContainer: '#075b52', // Hero Interactive Teal
  onPrimaryContainer: '#8bd0c5',
  inversePrimary: '#8ed3c8',
  primaryFixed: '#aaf0e3',
  onPrimaryFixed: '#00201c',
  primaryFixedDim: '#8ed3c8',

  // Secondary - Grounded Sage
  secondary: '#52625c',
  onSecondary: '#ffffff',
  secondaryContainer: '#d5e6df',
  onSecondaryContainer: '#586862',
  secondaryFixed: '#d5e6df',
  onSecondaryFixed: '#101e1a',

  // Tertiary - Warm Ochre (Needs setup / attention)
  tertiary: '#553200',
  onTertiary: '#ffffff',
  tertiaryContainer: '#744600',
  onTertiaryContainer: '#fcb562',
  tertiaryFixed: '#ffddba',
  tertiaryFixedDim: '#ffb866',

  // Semantic Alerts / Destructive
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Status highlights
  listeningHighlight: '#E1F2EB',
  listeningHalo: 'rgba(7, 91, 82, 0.24)',
  successPillBg: '#E1F2EB',
  successPillText: '#086054',
  warningPillBg: '#FEF3D6',
  warningPillText: '#875200',
  errorPillBg: '#FDE8E8',
  errorPillText: '#A32329',
};

export const HighContrastColors = {
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceDim: '#E0E0E0',
  surfaceBright: '#FFFFFF',
  surfaceContainerLowest: '#FFFFFF',
  surfaceContainerLow: '#F0F0F0',
  surfaceContainer: '#E8E8E8',
  surfaceContainerHigh: '#D0D0D0',
  surfaceContainerHighest: '#BDBDBD',
  onSurface: '#000000',
  onSurfaceVariant: '#1A1A1A',
  inverseSurface: '#000000',
  inverseOnSurface: '#FFFFFF',
  outline: '#000000',
  outlineVariant: '#333333',
  borderDefault: '#000000',
  inputBorder: '#000000',
  primary: '#002A24',
  onPrimary: '#FFFFFF',
  primaryContainer: '#003830',
  onPrimaryContainer: '#FFFFFF',
  inversePrimary: '#8ed3c8',
  primaryFixed: '#003830',
  onPrimaryFixed: '#FFFFFF',
  primaryFixedDim: '#002A24',
  secondary: '#222222',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#CCCCCC',
  onSecondaryContainer: '#000000',
  secondaryFixed: '#CCCCCC',
  onSecondaryFixed: '#000000',
  tertiary: '#4A2800',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#663B00',
  onTertiaryContainer: '#FFFFFF',
  tertiaryFixed: '#FFE0B2',
  tertiaryFixedDim: '#FFB74D',
  error: '#B71C1C',
  onError: '#FFFFFF',
  errorContainer: '#FFCDD2',
  onErrorContainer: '#000000',
  listeningHighlight: '#C8E6C9',
  listeningHalo: 'rgba(0, 56, 48, 0.4)',
  successPillBg: '#C8E6C9',
  successPillText: '#004D40',
  warningPillBg: '#FFF9C4',
  warningPillText: '#4A2800',
  errorPillBg: '#FFCDD2',
  errorPillText: '#B71C1C',
};

export const Typography = {
  // Fonts: Noto Sans for headlines, System / Atkinson for body & labels
  fontHeadline: 'System',
  fontBody: 'System',

  // Sizes in dp
  headlineXl: 32,
  headlineLg: 26,
  headlineMd: 22,
  bodyXl: 22,
  bodyLg: 20,
  bodyMd: 18, // Strict floor for older adults
  labelLg: 18,
  labelMd: 16,
  caption: 14,

  // Line heights
  lineHeightHeadlineXl: 44,
  lineHeightHeadlineLg: 36,
  lineHeightHeadlineMd: 32,
  lineHeightBodyXl: 34,
  lineHeightBodyLg: 30,
  lineHeightBodyMd: 28,
  lineHeightLabelLg: 26,
  lineHeightLabelMd: 24,

  // Weights
  weightRegular: '400' as const,
  weightMedium: '500' as const,
  weightSemiBold: '600' as const,
  weightBold: '700' as const,
};

export const Spacing = {
  xs: 8,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  gutter: 16,
  margin: 20,
};

export const Radii = {
  sm: 4,
  default: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const HitTargets = {
  min: 48,
  primaryButton: 56,
  largeButton: 64,
  navOrb: 72,
  heroOrb: 172,
};
