import React from 'react';
import { View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export const Index = React.forwardRef((props, ref) => {
  const isFocused = props?.isFocused ?? false;
  const videoRef = React.useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Handle video playback status updates
  const onPlaybackStatusUpdate = status => {
    if (!status.isLoaded) {
      if (status.error) {
        console.error(`Video playback error: ${status.error}`);
      }
      setIsLoaded(false);
      return;
    }
    setIsLoaded(true);
  };

  React.useEffect(() => {
    let isMounted = true;

    const initVideo = async () => {
      if (!videoRef.current) return;

      try {
        await videoRef.current.loadAsync(
          require('../assets/onboarding_video.mp4'),
          {
            shouldPlay: isFocused,
            isLooping: true,
            isMuted: false,
            volume: 1.0,
            rate: 1.0,
          },
          false
        );
      } catch (e) {
        if (isMounted) {
          console.error('Video initialization error:', e);
        }
      }
    };

    initVideo();

    return () => {
      isMounted = false;
      if (videoRef.current) {
        const cleanup = async () => {
          try {
            await videoRef.current.pauseAsync();
          } catch (e) {
            console.log('Cleanup error:', e);
          }
        };
        cleanup();
      }
    };
  }, [isFocused]);

  // Handle focus changes more efficiently
  React.useEffect(() => {
    if (!videoRef.current || !isLoaded) return;

    const updatePlayback = async () => {
      try {
        if (isFocused) {
          await videoRef.current.playAsync();
        } else {
          await videoRef.current.pauseAsync();
        }
      } catch (e) {
        console.error('Playback update error:', e);
      }
    };

    updatePlayback();
  }, [isFocused, isLoaded]);

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
        style={{
          height: '100%',
          width: '100%',
          opacity: props.opacity ?? 0.75,
        }}
        resizeMode={ResizeMode.COVER}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
      />
    </View>
  );
});

// import React from 'react';
// import { View } from 'react-native';
// import { Video, ResizeMode } from 'expo-av';

// export const Index = React.forwardRef((props, ref) => {
//   const isFocused = props?.isFocused ?? false;
//   const videoRef = React.useRef(null);
//   const [isLoaded, setIsLoaded] = React.useState(false);

//   // Handle video playback status updates
//   const onPlaybackStatusUpdate = status => {
//     if (!status.isLoaded) {
//       if (status.error) {
//         console.error(`Video playback error: ${status.error}`);
//       }
//       setIsLoaded(false);
//       return;
//     }
//     setIsLoaded(true);
//   };

//   React.useEffect(() => {
//     let isMounted = true;

//     const initVideo = async () => {
//       if (!videoRef.current) return;

//       try {
//         await videoRef.current.loadAsync(
//           require('../assets/onboarding_video.mp4'),
//           {
//             shouldPlay: true,
//             isLooping: true,
//             isMuted: false,
//             volume: 1.0,
//             rate: 1.0,
//           },
//           false
//         );
//       } catch (e) {
//         if (isMounted) {
//           console.error('Video initialization error:', e);
//         }
//       }
//     };

//     initVideo();

//     return () => {
//       isMounted = false;
//       if (videoRef.current) {
//         const cleanup = async () => {
//           try {
//             // Just pause the video on cleanup, don't unload it
//             await videoRef.current.pauseAsync();
//           } catch (e) {
//             console.log('Cleanup error:', e);
//           }
//         };
//         cleanup();
//       }
//     };
//   }, []);

//   // Handle focus changes more efficiently
//   React.useEffect(() => {
//     if (!videoRef.current || !isLoaded) return;

//     if (isFocused) {
//       videoRef.current.playAsync();
//     } else {
//       videoRef.current.pauseAsync();
//     }
//   }, [isFocused, isLoaded]);

//   return (
//     <View
//       style={{
//         position: 'absolute',
//         height: '100%',
//         width: '100%',
//         right: 0,
//         top: 0,
//         left: 0,
//       }}
//     >
//       <Video
//         ref={videoRef}
//         style={{
//           height: '100%',
//           width: '100%',
//           opacity: props.opacity ?? 0.75,
//         }}
//         resizeMode={ResizeMode.COVER}
//         onPlaybackStatusUpdate={onPlaybackStatusUpdate}
//       />
//     </View>
//   );
// });
