import { systemWeights } from 'react-native-typography';
import palettes from './palettes';
import { createTheme, DefaultTheme } from '@draftbit/ui';
export default createTheme({
  breakpoints: {},
  palettes,
  baseTheme: DefaultTheme,
  theme: {
    name: 'Draftbit',
    colors: {
      background: {
        base: palettes.Brand.Background,
        brand: palettes.Brand.Background,
        danger: palettes.Brand.Error,
      },
      border: {
        base: palettes.Brand.Divider,
        brand: palettes.Brand.Divider,
        danger: palettes.Brand.Error,
      },
      branding: {
        primary: palettes.Brand.Primary,
        secondary: palettes.Brand.Secondary,
      },
      foreground: {
        base: palettes.Brand.Light,
        brand: palettes.Brand.Light,
        danger: palettes.Brand.Light,
      },
      text: {
        danger: palettes.Brand.Error,
        light: palettes.Brand.Light,
        medium: palettes.Brand.Medium,
        strong: palettes.Brand.Strong,
      },
    },
    typography: {
      body1: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 26,
        letterSpacing: 0,
      },
      body2: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
      },
      button: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0,
      },
      caption: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0,
      },
      headline1: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 60,
        lineHeight: 71,
        letterSpacing: 0,
      },
      headline2: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 48,
        lineHeight: 58,
        letterSpacing: 0,
      },
      headline3: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 34,
        lineHeight: 40,
        letterSpacing: 0,
      },
      headline4: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 34,
        letterSpacing: 0,
      },
      headline5: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 20,
        lineHeight: 26,
        letterSpacing: 0,
      },
      headline6: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.bold ?? {}),
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
      },
      overline: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 2,
      },
      subtitle1: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 26,
        letterSpacing: 0,
      },
      subtitle2: {
        ...(({ backgroundColor, ...o }) => o)(systemWeights.regular ?? {}),
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0,
      },
    },
  },
});
