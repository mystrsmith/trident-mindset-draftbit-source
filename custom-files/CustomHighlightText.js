import React from 'react';
import HighlightText from '@sanar/react-native-highlight-text';
import cropTextWithSearchTerm from '../global-functions/cropTextWithSearchTerm';

const Index = ({ searchTerm, textContent }) => {
  const croppedText = cropTextWithSearchTerm(textContent, searchTerm);

  return (
    <HighlightText
      highlightStyle={{
        backgroundColor: '#1abc9c',
        color: 'black',
        fontFamily: 'Rasa_600SemiBold',
        fontSize: 18,
      }}
      searchWords={[searchTerm]}
      textToHighlight={croppedText}
      style={{
        color: 'white',
        fontFamily: 'Rasa_300Light',
        fontSize: 16,
      }}
    />
  );
};

export { Index };
