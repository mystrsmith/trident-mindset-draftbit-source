import { useFocusEffect, useNavigationContainerRef } from 'expo-router';
import React from 'react';

const useIsFocused = () => {
  const navigationContainerRef = useNavigationContainerRef();
  const [isFocused, setIsFocused] = React.useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsFocused(true);
      return () => {
        setIsFocused(false);
      };
    }, [])
  );

  // If navigationContainerRef is not ready yet
  // then isFocused should be assumed to be false otherwise any navigation action will throw an error
  // See https://github.com/expo/router/issues/740#issuecomment-1625190275
  if (!navigationContainerRef?.isReady()) {
    return false;
  }

  return isFocused;
};

export default useIsFocused;
