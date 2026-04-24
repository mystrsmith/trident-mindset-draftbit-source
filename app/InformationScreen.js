import React from 'react';
import {
  Button,
  IconButton,
  ScreenContainer,
  Swiper,
  SwiperItem,
  VideoPlayer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import * as OnboardingPaginationAnimation from '../custom-files/OnboardingPaginationAnimation';
import logEvent from '../global-functions/logEvent';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const InformationScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [headerText, setHeaderText] = React.useState(
    'How Trident Mindset Works'
  );
  const [visibleModalVideo, setVisibleModalVideo] = React.useState(false);
  const onPressNext = () => {
    try {
      console.log(swiperRef);
      if (swiperRef && swiperRef?.current) {
        const newIndex = currentIndex + 1;
        swiperRef.current.scrollBy(newIndex, true);
      }
    } catch (error) {
      console.log('error swiperRef ', error);
    }
  };
  const swiperRef = React.useRef(null);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      logEvent('ob_step4_view', null);
      logEvent('ob_step4_swipe_slide1', null);
    } catch (err) {
      Sentry.captureException(err);
      console.error(err);
    }
  }, [isFocused]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
  }, [isFocused]);

  return (
    <ScreenContainer scrollable={false} hasSafeArea={false}>
      <ImageBackground
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        resizeMode={'cover'}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
          dimensions.width
        )}
      >
        {/* Header */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: safeAreaInsets.top + 5,
            },
            dimensions.width
          )}
        >
          <IconButton
            onPress={() => {
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            color={palettes.Brand.Surface}
            icon={'Ionicons/close'}
            size={35}
          />
        </View>
        {/* Content */}
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'space-between' },
            dimensions.width
          )}
        >
          <Utils.CustomCodeErrorBoundary>
            <OnboardingPaginationAnimation.Index />
          </Utils.CustomCodeErrorBoundary>
        </View>
      </ImageBackground>

      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={Boolean(visibleModalVideo)}
      >
        {/* Overlay */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes.App.Black_Alpha_80,
              height: '100%',
              position: 'absolute',
              width: '100%',
            },
            dimensions.width
          )}
        />
        {/* Container */}
        <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
          {/* Header */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: safeAreaInsets.top + 5,
              },
              dimensions.width
            )}
          >
            <IconButton
              onPress={() => {
                try {
                  setVisibleModalVideo(false);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              color={palettes.Brand.Surface}
              icon={'Ionicons/close'}
              size={35}
            />
          </View>
          {/* Content */}
          <View
            style={StyleSheet.applyWidth(
              {
                flex: 1,
                justifyContent: 'center',
                paddingLeft: 20,
                paddingRight: 20,
              },
              dimensions.width
            )}
          >
            <VideoPlayer
              isLooping={false}
              isMuted={false}
              playsInSilentModeIOS={false}
              rate={1}
              shouldPlay={false}
              useNativeControls={true}
              usePoster={false}
              volume={0.5}
              {...GlobalStyles.VideoPlayerStyles(theme)['Video'].props}
              posterResizeMode={'contain'}
              resizeMode={'contain'}
              source={imageSource(
                `${Constants['APP_CONFIG']?.information_video_url}`
              )}
              style={StyleSheet.applyWidth(
                GlobalStyles.VideoPlayerStyles(theme)['Video'].style,
                dimensions.width
              )}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(InformationScreen);
