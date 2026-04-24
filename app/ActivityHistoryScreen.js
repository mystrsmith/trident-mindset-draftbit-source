import React from 'react';
import {
  Button,
  Icon,
  Pressable,
  ScreenContainer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import relativeTime from '../global-functions/relativeTime';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const ActivityHistoryScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const isFocused = useIsFocused();

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
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'flex-start',
                  height: 40,
                  justifyContent: 'center',
                  width: 40,
                },
                dimensions.width
              )}
            >
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
                  color: Constants['APP_FONT_COLOR'],
                  fontFamily: 'Rasa_500Medium',
                  fontSize: 26,
                }
              ),
              dimensions.width
            )}
          >
            {'Activity History'}
          </Text>
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                height: 40,
                justifyContent: 'center',
                width: 40,
              },
              dimensions.width
            )}
          />
        </View>

        <KeyboardAwareScrollView
          enableAutomaticScroll={false}
          enableOnAndroid={false}
          enableResetScrollToCoords={false}
          showsVerticalScrollIndicator={true}
          viewIsInsideTabBar={false}
          contentContainerStyle={StyleSheet.applyWidth(
            { flex: 1, paddingBottom: 80 },
            dimensions.width
          )}
          keyboardShouldPersistTaps={'always'}
        >
          <XanoBackendApi.FetchActivityHistoryGET>
            {({ loading, error, data, refetchActivityHistory }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <View
                  style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                >
                  {/* Empty Start */}
                  <>
                    {fetchData?.length ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'stretch',
                            flex: 1,
                            justifyContent: 'center',
                            padding: 20,
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
                                color: Constants['APP_FONT_COLOR'],
                                fontFamily: 'Rasa_300Light',
                                fontSize: 24,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {
                            'No Lessons completed yet?\n\nStart exploring the lessons now.'
                          }
                        </Text>
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
                                backgroundColor:
                                  palettes.App['App Buttons Color'],
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
                      </View>
                    )}
                  </>
                  <>
                    {!fetchData?.length ? null : (
                      <FlatList
                        data={fetchData}
                        horizontal={false}
                        inverted={false}
                        keyExtractor={(listData, index) =>
                          listData?.id ??
                          listData?.uuid ??
                          index?.toString() ??
                          JSON.stringify(listData)
                        }
                        keyboardShouldPersistTaps={'never'}
                        listKey={
                          'Container->Keyboard Aware Scroll View->Fetch->View->List'
                        }
                        nestedScrollEnabled={false}
                        numColumns={1}
                        onEndReachedThreshold={0.5}
                        renderItem={({ item, index }) => {
                          const listData = item;
                          return (
                            <Pressable
                              onPress={() => {
                                try {
                                  navigation.push('LessonDetailsScreen', {
                                    lesson_id: listData?.lesson?.id,
                                  });
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                            >
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    alignItems: 'center',
                                    borderBottomWidth: 0.5,
                                    borderColor:
                                      palettes.Brand['Light Inverse'],
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    margin: 10,
                                    marginBottom: 0,
                                    marginLeft: 0,
                                    marginRight: 0,
                                    paddingBottom: 12,
                                    paddingLeft: 20,
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
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        flexDirection: 'row',
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View>
                                      <Image
                                        resizeMode={'cover'}
                                        {...GlobalStyles.ImageStyles(theme)[
                                          'Image'
                                        ].props}
                                        source={imageSource(
                                          Images['NavyAppLogo']
                                        )}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.ImageStyles(theme)[
                                              'Image'
                                            ].style,
                                            {
                                              borderColor:
                                                palettes.App[
                                                  'App Buttons Color'
                                                ],
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
                                        { flex: 1, marginLeft: 15 },
                                        dimensions.width
                                      )}
                                    >
                                      {/* title */}
                                      <Text
                                        accessible={true}
                                        selectable={false}
                                        {...GlobalStyles.TextStyles(theme)[
                                          'Text'
                                        ].props}
                                        numberOfLines={1}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].style,
                                            {
                                              color:
                                                Constants['APP_FONT_COLOR'],
                                              fontFamily: 'Rasa_500Medium',
                                              fontSize: 21,
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {listData?.lesson?.title}
                                      </Text>
                                      {/* time */}
                                      <Text
                                        accessible={true}
                                        selectable={false}
                                        {...GlobalStyles.TextStyles(theme)[
                                          'Text'
                                        ].props}
                                        numberOfLines={1}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].style,
                                            {
                                              color:
                                                Constants['APP_FONT_COLOR'],
                                              fontFamily: 'Rasa_300Light',
                                              fontSize: 18,
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {relativeTime(listData?.created_at)}
                                      </Text>
                                    </View>
                                  </View>
                                </View>

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
                                    size={24}
                                    color={palettes.App['Custom Color']}
                                    name={'FontAwesome/angle-right'}
                                  />
                                </View>
                              </View>
                            </Pressable>
                          );
                        }}
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                      />
                    )}
                  </>
                </View>
              );
            }}
          </XanoBackendApi.FetchActivityHistoryGET>
        </KeyboardAwareScrollView>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(ActivityHistoryScreen);
