import React from 'react';
import {
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CustomCode from '../../../custom-files/CustomCode';
import OfflineMode_CheckIfAlreadyDownloaded from '../../../global-functions/OfflineMode_CheckIfAlreadyDownloaded';
import OfflineMode_deleteLesson from '../../../global-functions/OfflineMode_deleteLesson';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useIsOnline from '../../../utils/useIsOnline';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const DownloadedLessonsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const isOnline = useIsOnline();
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [lessons, setLessons] = React.useState([]);
  const [password, setPassword] = React.useState('');
  React.useEffect(() => {
    const downloadedLessons = Variables['DOWNLOADED_LESSONS'];
    setLessons(downloadedLessons);
  }, [Variables['DOWNLOADED_LESSONS']]);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setLessons(Constants['DOWNLOADED_LESSONS']);
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
        {/* iOS Safe Area */}
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
                borderBottomWidth: 1,
                borderColor: palettes.Brand['Light Inverse'],
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
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            activeOpacity={0.3}
            style={StyleSheet.applyWidth({ width: 50 }, dimensions.width)}
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
                  fontFamily: 'Rasa_500Medium',
                  fontSize: 26,
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {'My Downloads'}
          </Text>
          {/* copy link */}
          <Pressable
            activeOpacity={0.3}
            style={StyleSheet.applyWidth({ width: 50 }, dimensions.width)}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 48,
                  justifyContent: 'center',
                  width: 48,
                },
                dimensions.width
              )}
            ></View>
          </Pressable>
        </View>

        <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
          {/* Empty State */}
          <>
            {lessons?.length ? null : (
              <View
                style={StyleSheet.applyWidth(
                  { flex: 0.9, justifyContent: 'center', padding: 20 },
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
                        color: Constants['APP_FONT_COLOR'],
                        fontFamily: 'Rasa_300Light',
                        fontSize: 23,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'No Lessons in your Downloads.\n\nExplore and save them to your downloads.'
                  }
                </Text>
                <>
                  {!isOnline ? null : (
                    <Button
                      accessible={true}
                      iconPosition={'left'}
                      onPress={() => {
                        try {
                          navigation.navigate('BottomTabNavigator', {
                            screen: 'HomeStack',
                            params: { screen: '' },
                          });
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      }}
                      {...GlobalStyles.ButtonStyles(theme)['Action Button']
                        .props}
                      activeOpacity={0.3}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ButtonStyles(theme)['Action Button']
                            .style,
                          {
                            backgroundColor: palettes.App['App Buttons Color'],
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 20,
                            marginTop: 35,
                            paddingTop: 2,
                          }
                        ),
                        dimensions.width
                      )}
                      title={'Get Started  ➙'}
                    />
                  )}
                </>
              </View>
            )}
          </>
          <>
            {!lessons?.length ? null : (
              <SimpleStyleFlatList
                data={lessons}
                decelerationRate={'normal'}
                horizontal={false}
                inverted={false}
                keyExtractor={(listData, index) =>
                  listData?.id ??
                  listData?.uuid ??
                  index?.toString() ??
                  JSON.stringify(listData)
                }
                keyboardShouldPersistTaps={'never'}
                listKey={'Container->View->List'}
                nestedScrollEnabled={false}
                numColumns={1}
                onEndReachedThreshold={0.5}
                pagingEnabled={false}
                renderItem={({ item, index }) => {
                  const listData = item;
                  return (
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          borderBottomWidth: 0.5,
                          borderColor: palettes.Brand['Light Inverse'],
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 0,
                          padding: 20,
                          paddingBottom: 12,
                          paddingTop: 12,
                        },
                        dimensions.width
                      )}
                    >
                      <View
                        style={StyleSheet.applyWidth(
                          { flex: 1 },
                          dimensions.width
                        )}
                      >
                        <Pressable
                          onPress={() => {
                            try {
                              const itemToPlay =
                                OfflineMode_CheckIfAlreadyDownloaded(
                                  Variables,
                                  listData
                                );
                              navigation.navigate('BottomTabNavigator', {
                                screen: 'MoreStack',
                                params: {
                                  screen: 'DownloadedLessonDetailScreen',
                                  params: { lesson: itemToPlay },
                                },
                              });
                            } catch (err) {
                              Sentry.captureException(err);
                              console.error(err);
                            }
                          }}
                          activeOpacity={0.3}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              { alignItems: 'center', flexDirection: 'row' },
                              dimensions.width
                            )}
                          >
                            <View>
                              <Image
                                resizeMode={'cover'}
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                source={imageSource(Images['NavyAppLogo'])}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    {
                                      borderColor:
                                        palettes.App['App Buttons Color'],
                                      borderRadius: 4,
                                      borderWidth: 1,
                                      height: 55,
                                      width: 55,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              />
                            </View>
                            {/* Details */}
                            <View
                              style={StyleSheet.applyWidth(
                                { flex: 1, marginLeft: 10 },
                                dimensions.width
                              )}
                            >
                              {/* title */}
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                numberOfLines={1}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: Constants['APP_FONT_COLOR'],
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 20,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {listData?.title}
                              </Text>
                              {/* subtitle */}
                              <>
                                {!(listData?.sub_title?.length > 0) ? null : (
                                  <Text
                                    accessible={true}
                                    selectable={false}
                                    {...GlobalStyles.TextStyles(theme)['Text']
                                      .props}
                                    numberOfLines={1}
                                    style={StyleSheet.applyWidth(
                                      StyleSheet.compose(
                                        GlobalStyles.TextStyles(theme)['Text']
                                          .style,
                                        {
                                          color: Constants['APP_FONT_COLOR'],
                                          fontFamily: 'Rasa_300Light',
                                          fontSize: 17,
                                        }
                                      ),
                                      dimensions.width
                                    )}
                                  >
                                    {listData?.sub_title}
                                  </Text>
                                )}
                              </>
                            </View>
                          </View>
                        </Pressable>
                      </View>
                      {/* Actions */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                          },
                          dimensions.width
                        )}
                      >
                        {/* Delete Downloaded Lesson */}
                        <Pressable
                          onPress={() => {
                            const handler = async () => {
                              try {
                                const result = await OfflineMode_deleteLesson(
                                  Variables,
                                  setGlobalVariableValue,
                                  listData?.id
                                );
                                setLessons(Constants['DOWNLOADED_LESSONS']);
                              } catch (err) {
                                Sentry.captureException(err);
                                console.error(err);
                              }
                            };
                            handler();
                          }}
                          activeOpacity={0.3}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                height: 48,
                                justifyContent: 'center',
                                width: 48,
                              },
                              dimensions.width
                            )}
                          >
                            <Icon
                              color={palettes.App['App Buttons Color']}
                              name={'Ionicons/trash-outline'}
                              size={26}
                            />
                          </View>
                        </Pressable>
                      </View>
                    </View>
                  );
                }}
                showsHorizontalScrollIndicator={true}
                showsVerticalScrollIndicator={true}
                snapToAlignment={'start'}
              />
            )}
          </>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(DownloadedLessonsScreen);
