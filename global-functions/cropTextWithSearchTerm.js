const cropTextWithSearchTerm = (textContent, searchTerm) => {
  textContent = textContent.trim();
  // Add searchTerm trim to handle cases with trailing spaces
  searchTerm = searchTerm.trim();

  // Convert both text and search term to lowercase for case-insensitive search
  const lowerText = textContent.toLowerCase();
  const lowerSearchTerm = searchTerm.toLowerCase();

  // Find the index of the search term in the text content
  const index = lowerText.indexOf(lowerSearchTerm);

  // If the search term is not found, return the full text
  if (index === -1) {
    return textContent;
  }

  // Define a fixed window size for context (e.g., 100 characters on each side)
  const windowSize = 100;
  const startIndex = Math.max(0, index - windowSize);
  const endIndex = Math.min(
    textContent.length,
    index + searchTerm.length + windowSize
  );

  // Return the cropped text
  const croppedText = textContent.substring(startIndex, endIndex).trim();
  console.log('croppedText', croppedText);
  return croppedText;
};

export default cropTextWithSearchTerm;
