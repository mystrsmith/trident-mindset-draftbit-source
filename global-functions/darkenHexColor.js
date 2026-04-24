const darkenHexColor = (hex, percent) => {
  hex = hex.replace('#', '');

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map(char => char + char)
      .join('');
  }

  const darken = color =>
    Math.max(0, Math.floor(parseInt(color, 16) * (1 - percent / 100)));

  const r = darken(hex.slice(0, 2));
  const g = darken(hex.slice(2, 4));
  const b = darken(hex.slice(4, 6));

  const toHex = value => value.toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export default darkenHexColor;
