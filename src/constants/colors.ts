export const colors = {
  primary: '#169D52',
  primaryDark: '#0E7A3D',
  primaryDarker: '#0A5E30',
  primaryLight: '#1FB35C',

  background: '#F4F7F5',
  surface: '#FFFFFF',
  surfaceLight: '#F8FBF9',

  greenBg: '#E9F7EE',
  greenBgMid: '#F0FAF4',
  greenBgSubtle: '#F1F8F3',
  greenBorder: '#B6E4C8',
  greenAccentLight: '#CDEFD9',
  greenAccentMid: '#9BE8B8',
  greenChart: '#2ECC6E',

  orange: '#F08A00',
  orangeDark: '#C8730A',
  orangeBg: '#FFF6E9',
  orangeBorder: '#FCE3BD',

  textDark: '#1C2B22',
  textMedium: '#5A6A62',
  textLight: '#6E7B74',
  textMuted: '#9AA8A0',

  border: '#E2E9E4',
  borderFocus: '#169D52',

  error: '#D93025',
  errorBg: '#FEF2F2',
  success: '#169D52',
  successBg: '#E9F7EE',
  warning: '#F08A00',
  warningBg: '#FFF6E9',

  white: '#FFFFFF',
  black: '#0F2419',
} as const;

export type ColorKey = keyof typeof colors;
