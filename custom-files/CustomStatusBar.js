import palettes from '../themes/palettes';
import React from 'react';
import { StatusBar } from 'react-native';

export const Component = ({ theme }) => (
  <StatusBar backgroundColor={theme.colors.background.brand} />
);
