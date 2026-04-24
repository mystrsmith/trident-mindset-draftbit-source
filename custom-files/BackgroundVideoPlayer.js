import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import * as GlobalVariables from '../config/GlobalVariableContext';
import { Video, Audio } from 'expo-av';

export const Component = React.forwardRef((props, ref) => {
  const Constants = GlobalVariables.useValues();
  const videoRef = React.useRef(null);
  const isFocused = useIsFocused();
  const [isVideoReady, setIsVideoReady] = useState(false);

  const setAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: 1,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
      });
    } catch (error) {
      console.log('Error setting audio mode:', error);
    }
  };

  React.useEffect(() => {
    setAudioMode();
  }, []);

  const loadVideo = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.loadAsync(
          { uri: Constants['BG_VIDEO_MP4'] },
          { shouldPlay: true, isMuted: true }
        );
        setIsVideoReady(true);
      } catch (error) {
        console.log('Error loading video:', error);
      }
    }
  }, [Constants]);

  const unloadVideo = useCallback(async () => {
    if (videoRef.current && isVideoReady) {
      try {
        await videoRef.current.unloadAsync();
      } catch (error) {
        console.log('Error unloading video:', error);
      }
      setIsVideoReady(false);
    }
  }, [isVideoReady]);

  React.useEffect(() => {
    if (isFocused) {
      loadVideo();
    } else {
      unloadVideo();
    }

    return () => {
      unloadVideo();
    };
  }, [isFocused, loadVideo, unloadVideo]);

  if (!isFocused) {
    return null;
  }

  return (
    <View
      style={{
        position: 'absolute',
        height: '100%',
        width: '100%',
        right: 0,
        top: 0,
        left: 0,
      }}
    >
      <Video
        ref={videoRef}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode="cover"
        isLooping
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.2,
        }}
        onLoad={() => setIsVideoReady(true)}
        onError={error => {
          console.error('Video error:', error);
          setIsVideoReady(false);
        }}
      />
    </View>
  );
});
