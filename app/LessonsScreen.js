import React from 'react';
import {
  Checkbox,
  CircularProgress,
  ExpoImage,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CircleShimmer from '../custom-files/CircleShimmer';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomLessonsList from '../custom-files/CustomLessonsList';
import * as ShimmerLessonList from '../custom-files/ShimmerLessonList';
import OfflineMode_downloadLesson from '../global-functions/OfflineMode_downloadLesson';
import OfflineMode_isDownloaded from '../global-functions/OfflineMode_isDownloaded';
import calculateCategoryProgress from '../global-functions/calculateCategoryProgress';
import calculateTacticProgress from '../global-functions/calculateTacticProgress';
import getRevCatCustomerInfo from '../global-functions/getRevCatCustomerInfo';
import isSubscribed from '../global-functions/isSubscribed';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useIsOnline from '../utils/useIsOnline';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  category_id: null,
  screen_title: 'Lessons',
  tactic_id: null,
  tactic_prop: null,
};

const LessonsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isOnline = useIsOnline();
  const [category, setCategory] = React.useState(null);
  const [completedLessonIds, setCompletedLessonIds] = React.useState([]);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [favoritedLessonIds, setFavoritedLessonIds] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastLeftOff, setLastLeftOff] = React.useState({});
  const [lessons, setLessons] = React.useState([]);
  const [password, setPassword] = React.useState('');
  const [showWaitDownloading, setShowWaitDownloading] = React.useState(false);
  const [tactic, setTactic] = React.useState({});
  const [visibleModalDownloadInfo, setVisibleModalDownloadInfo] =
    React.useState(false);
  const isCompleted = lessonId => {
    if (!completedLessonIds) {
      return false;
    }
    return completedLessonIds.find(id => id === lessonId) !== undefined;
  };

  const isFavorited = lessonId => {
    if (!favoritedLessonIds) {
      return false;
    }
    return favoritedLessonIds.find(id => id === lessonId) !== undefined;
  };
  const currentDownloadId = Variables['CURRENT_DOWNLOAD_ID'];
  React.useEffect(() => {
    if (
      currentDownloadId === undefined ||
      currentDownloadId === null ||
      currentDownloadId === 0
    ) {
      if (showWaitDownloading === true) {
        setShowWaitDownloading(false);
      }
    }
  }, [currentDownloadId, showWaitDownloading, setShowWaitDownloading]);

  const customLessonsListRef = React.useRef(null);
  const xanoBackendUpdateFavoriteLessonsPOST =
    XanoBackendApi.useUpdateFavoriteLessonsPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        await getRevCatCustomerInfo(setGlobalVariableValue);
        const resCompletedLessonsIds = (
          await XanoBackendApi.getCompletedLessonsGET(Constants)
        )?.json;
        setCompletedLessonIds(resCompletedLessonsIds);
        const resFavoritedLessonsIds = (
          await XanoBackendApi.getFavoritedLessonsGET(Constants)
        )?.json;
        setFavoritedLessonIds(resFavoritedLessonsIds);
      } catch (err) {
        Sentry.captureException(err);
        console.error(err);
      }
    };
    handler();
  }, [isFocused]);

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
  }, [isFocused]);

  return (
    <ScreenContainer
      hasSafeArea={false}
      scrollable={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: theme.colors.background.brand },
        dimensions.width
      )}
    >
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].props}
        source={imageSource(Images['BG'])}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.ImageBackgroundStyles(theme)['Image Background'].style,
            {
              bottom: 0,
              left: 0,
              opacity: 0.5,
              position: 'absolute',
              right: 0,
              top: 0,
            }
          ),
          dimensions.width
        )}
      />
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* iOS Safe Area View */}
        <>
          {!(Platform.OS === 'ios') ? null : (
            <View
              {...GlobalStyles.ViewStyles(theme)['iOS Margin View'].props}
              style={StyleSheet.applyWidth(
                GlobalStyles.ViewStyles(theme)['iOS Margin View'].style,
                dimensions.width
              )}
            />
          )}
        </>
        {/* Header */}
        <View
          {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
              {
                justifyContent: 'space-between',
                paddingLeft: 15,
                paddingRight: 15,
              }
            ),
            dimensions.width
          )}
        >
          {/* Back */}
          <Pressable
            onPress={() => {
              const handler = async () => {
                try {
                  navigation.goBack();
                  await setGlobalVariableValue({
                    key: 'NEXT_LESSON_ID',
                    value: null,
                  });
                  await setGlobalVariableValue({
                    key: 'NEXT_TACTIC_ID',
                    value: null,
                  });
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              };
              handler();
            }}
            activeOpacity={0.3}
            style={StyleSheet.applyWidth({ width: 40 }, dimensions.width)}
          >
            <View>
              <Icon
                size={24}
                color={palettes.App['Custom Color']}
                name={'Ionicons/chevron-back'}
              />
            </View>
          </Pressable>

          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  alignSelf: 'center',
                  color: Constants['APP_FONT_COLOR'],
                  flex: 1,
                  fontFamily: 'Rasa_600SemiBold',
                  fontSize: 25,
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {params?.screen_title ?? defaultProps.screen_title}
          </Text>
          <View
            style={StyleSheet.applyWidth({ width: 40 }, dimensions.width)}
          />
        </View>
        <Utils.CustomCodeErrorBoundary>
          <CustomLessonsList.Index
            {...{
              params,
              defaultProps: (defaultPropsProp = defaultProps),
              navigation,
              Variables,
              Constants,
              setGlobalVariableValue,
              theme,
              dimensions,
              setShowWaitDownloading,
              setVisibleModalDownloadInfo,
              isOnline,
              xanoBackendUpdateFavoriteLessonsPOST,
              isCompleted,
              isFavorited,
              ref: customLessonsListRef,
            }}
          />
        </Utils.CustomCodeErrorBoundary>
      </View>
      {/* Modal Download Info */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'fade'}
        transparent={true}
        visible={Boolean(visibleModalDownloadInfo)}
      >
        {/* Overlay */}
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: palettes.App.Overlay,
              height: '100%',
              position: 'absolute',
              width: '100%',
            },
            dimensions.width
          )}
        />
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              {
                backgroundColor: theme.colors.background.brand,
                borderColor: palettes.App['App Buttons Color'],
                borderRadius: 8,
                borderWidth: 1,
                overflow: 'hidden',
                padding: 16,
                paddingBottom: 0,
                width: 300,
              },
              dimensions.width
            )}
          >
            <Text
              accessible={true}
              selectable={false}
              {...GlobalStyles.TextStyles(theme)['Text'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  {
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 26,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {
                'Go to the Profile section of the app to listen to your downloaded lessons offline.'
              }
            </Text>
            {/* Please Wait */}
            <>
              {!showWaitDownloading ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingBottom: 20,
                      paddingTop: 20,
                    },
                    dimensions.width
                  )}
                >
                  <ActivityIndicator
                    animating={true}
                    hidesWhenStopped={true}
                    size={'small'}
                    {...GlobalStyles.ActivityIndicatorStyles(theme)[
                      'Activity Indicator'
                    ].props}
                    color={palettes.Brand.Surface}
                    style={StyleSheet.applyWidth(
                      GlobalStyles.ActivityIndicatorStyles(theme)[
                        'Activity Indicator'
                      ].style,
                      dimensions.width
                    )}
                  />
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.Brand.Surface,
                          fontFamily: 'Rasa_500Medium',
                          fontSize: 18,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Please wait'}
                  </Text>
                </View>
              )}
            </>
            {/* CTAs */}
            <>
              {showWaitDownloading ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderColor: palettes.App['App Buttons Color'],
                      borderTopWidth: 1,
                      flexDirection: 'row',
                      height: 50,
                      justifyContent: 'center',
                      marginLeft: -16,
                      marginRight: -16,
                      marginTop: 15,
                    },
                    dimensions.width
                  )}
                >
                  {/* Ok */}
                  <Pressable
                    onPress={() => {
                      try {
                        setVisibleModalDownloadInfo(false);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
                    style={StyleSheet.applyWidth(
                      { height: '100%', width: '50%' },
                      dimensions.width
                    )}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'center',
                          width: '100%',
                        },
                        dimensions.width
                      )}
                    >
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Rasa_600SemiBold',
                              fontSize: 20,
                              paddingTop: 2,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Ok'}
                      </Text>
                    </View>
                  </Pressable>
                </View>
              )}
            </>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(LessonsScreen);
