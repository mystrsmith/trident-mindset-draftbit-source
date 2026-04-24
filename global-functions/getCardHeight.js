const getCardHeight = (padding, screen_width) => {
  const card_width = screen_width - padding * 2;
  const card_height = card_width / 1.9;

  return card_height;
};

export default getCardHeight;
