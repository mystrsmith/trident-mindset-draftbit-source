import React from 'react';
import {
  AccordionGroup,
  Button,
  Checkbox,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../components/CommonLoadingBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const FavoritesScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const xanoBackendUpdateFavoriteLessonsPOST =
    XanoBackendApi.useUpdateFavoriteLessonsPOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setIsLoading(true);
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
                  paddingTop: 2,
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {'Favorites'}
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
                  height: 30,
                  justifyContent: 'center',
                  width: 30,
                },
                dimensions.width
              )}
            />
          </Pressable>
        </View>

        <XanoBackendApi.FetchGetTacticsGET
          favorited={true}
          handlers={{
            onData: fetchData => {
              try {
                setIsLoading(false);
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            },
          }}
          noted={false}
        >
          {({ loading, error, data, refetchGetTactics }) => {
            const fetchData = data?.json;
            if (loading) {
              return <CommonLoadingBlock />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <>
                {isLoading ? null : (
                  <View
                    style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                  >
                    {/* Empty State */}
                    <>
                      {!(fetchData?.length === 0) ? null : (
                        <View
                          style={StyleSheet.applyWidth(
                            {
                              alignItems: 'center',
                              flex: 0.9,
                              justifyContent: 'center',
                              marginTop: 25,
                            },
                            dimensions.width
                          )}
                        >
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                backgroundColor:
                                  palettes.App['Custom Color_10'],
                                borderRadius: 62,
                                height: 62,
                                justifyContent: 'center',
                                overflow: 'hidden',
                                width: 62,
                              },
                              dimensions.width
                            )}
                          >
                            <Icon
                              color={palettes.Brand.Surface}
                              name={'Ionicons/heart'}
                              size={32}
                              style={StyleSheet.applyWidth(
                                { opacity: 0.8, position: 'relative' },
                                dimensions.width
                              )}
                            />
                          </View>

                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: Constants['APP_FONT_COLOR'],
                                  fontFamily: 'Rasa_600SemiBold',
                                  fontSize: 28,
                                  marginTop: 20,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'⭐ No favorites yet!'}
                          </Text>
                          {/* Text 2 */}
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
                                  fontSize: 20,
                                  lineHeight: 23,
                                  marginTop: 8,
                                  textAlign: 'center',
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {
                              'Like any lesson? Save\nthem here to your favorites.'
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
                            {...GlobalStyles.ButtonStyles(theme)['Button']
                              .props}
                            activeOpacity={0.3}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.ButtonStyles(theme)['Button']
                                  .style,
                                {
                                  backgroundColor:
                                    palettes.App['App Buttons Color'],
                                  fontFamily: 'Rasa_400Regular',
                                  fontSize: 20,
                                  marginTop: 50,
                                  paddingTop: 2,
                                  width: '85%',
                                }
                              ),
                              dimensions.width
                            )}
                            title={'Start Exploring Now'}
                          />
                        </View>
                      )}
                    </>
                    {/* Tactics */}
                    <>
                      {!fetchData?.length ? null : (
                        <SimpleStyleFlatList
                          data={fetchData}
                          decelerationRate={'normal'}
                          horizontal={false}
                          inverted={false}
                          keyExtractor={(tacticsData, index) =>
                            tacticsData?.id ??
                            tacticsData?.uuid ??
                            index?.toString() ??
                            JSON.stringify(tacticsData)
                          }
                          keyboardShouldPersistTaps={'never'}
                          listKey={'Container->Fetch->View->Tactics'}
                          nestedScrollEnabled={false}
                          numColumns={1}
                          onEndReachedThreshold={0.5}
                          pagingEnabled={false}
                          renderItem={({ item, index }) => {
                            const tacticsData = item;
                            return (
                              <AccordionGroup
                                caretSize={24}
                                iconSize={24}
                                {...GlobalStyles.AccordionGroupStyles(theme)[
                                  'Accordion'
                                ].props}
                                caretColor={palettes.App['Custom Color']}
                                closedColor={palettes.App['Custom Color']}
                                icon={
                                  'MaterialCommunityIcons/record-circle-outline'
                                }
                                label={tacticsData?.title}
                                openColor={palettes.App['Custom Color']}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.AccordionGroupStyles(theme)[
                                      'Accordion'
                                    ].style,
                                    {
                                      backgroundColor: palettes.App.Avi,
                                      fontFamily: 'Rasa_500Medium',
                                      fontSize: 19,
                                      marginBottom: 4,
                                      minHeight: 45,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                <SimpleStyleFlatList
                                  data={tacticsData?.lessons}
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
                                  listKey={JSON.stringify(tacticsData?.lessons)}
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
                                            borderColor: palettes.App.Outline,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            margin: 20,
                                            marginBottom: 0,
                                            paddingBottom: 12,
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
                                                navigation.navigate(
                                                  'LessonDetailsScreen',
                                                  { lesson_id: listData?.id }
                                                );
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
                                                  alignItems: 'center',
                                                  flexDirection: 'row',
                                                },
                                                dimensions.width
                                              )}
                                            >
                                              <View>
                                                <Image
                                                  resizeMode={'cover'}
                                                  {...GlobalStyles.ImageStyles(
                                                    theme
                                                  )['Image'].props}
                                                  source={imageSource(
                                                    Images['NavyAppLogo']
                                                  )}
                                                  style={StyleSheet.applyWidth(
                                                    StyleSheet.compose(
                                                      GlobalStyles.ImageStyles(
                                                        theme
                                                      )['Image'].style,
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
                                                <>
                                                  {!listData?.completed ? null : (
                                                    <Icon
                                                      color={
                                                        palettes.App[
                                                          'Custom Color_2'
                                                        ]
                                                      }
                                                      name={
                                                        'AntDesign/checksquare'
                                                      }
                                                      size={28}
                                                      style={StyleSheet.applyWidth(
                                                        {
                                                          backgroundColor:
                                                            palettes.App[
                                                              'Custom Color'
                                                            ],
                                                          height: 24,
                                                          left: 0,
                                                          position: 'absolute',
                                                          top: 0,
                                                          width: 24,
                                                        },
                                                        dimensions.width
                                                      )}
                                                    />
                                                  )}
                                                </>
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
                                                  {...GlobalStyles.TextStyles(
                                                    theme
                                                  )['Text'].props}
                                                  numberOfLines={1}
                                                  style={StyleSheet.applyWidth(
                                                    StyleSheet.compose(
                                                      GlobalStyles.TextStyles(
                                                        theme
                                                      )['Text'].style,
                                                      {
                                                        color:
                                                          Constants[
                                                            'APP_FONT_COLOR'
                                                          ],
                                                        fontFamily:
                                                          'Rasa_500Medium',
                                                        fontSize: 21,
                                                      }
                                                    ),
                                                    dimensions.width
                                                  )}
                                                >
                                                  {listData?.title}
                                                </Text>
                                                {/* subtitle */}
                                                <>
                                                  {!listData?.sub_title ? null : (
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Text'].props}
                                                      numberOfLines={1}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Text'].style,
                                                          {
                                                            color:
                                                              Constants[
                                                                'APP_FONT_COLOR'
                                                              ],
                                                            fontFamily:
                                                              'Rasa_300Light',
                                                            fontSize: 18,
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
                                          <Checkbox
                                            onPress={newCheckboxValue => {
                                              const handler = async () => {
                                                try {
                                                  const api_Response = (
                                                    await xanoBackendUpdateFavoriteLessonsPOST.mutateAsync(
                                                      {
                                                        favorite: false,
                                                        lesson_id: listData?.id,
                                                      }
                                                    )
                                                  )?.json;
                                                  if (
                                                    api_Response?.status ===
                                                    Constants[
                                                      'SUCCESS_API_RESPONSE'
                                                    ]
                                                  ) {
                                                    await refetchGetTactics();
                                                  }
                                                } catch (err) {
                                                  Sentry.captureException(err);
                                                  console.error(err);
                                                }
                                              };
                                              handler();
                                            }}
                                            checkedIcon={'AntDesign/star'}
                                            color={
                                              palettes.App['Custom Color_9']
                                            }
                                            defaultValue={listData?.favorited}
                                            uncheckedColor={
                                              palettes.App['Custom Color']
                                            }
                                            uncheckedIcon={'AntDesign/staro'}
                                          />
                                        </View>
                                      </View>
                                    );
                                  }}
                                  showsHorizontalScrollIndicator={true}
                                  showsVerticalScrollIndicator={true}
                                  snapToAlignment={'start'}
                                />
                              </AccordionGroup>
                            );
                          }}
                          showsHorizontalScrollIndicator={true}
                          showsVerticalScrollIndicator={true}
                          snapToAlignment={'start'}
                          style={StyleSheet.applyWidth(
                            { paddingBottom: 100 },
                            dimensions.width
                          )}
                        />
                      )}
                    </>
                  </View>
                )}
              </>
            );
          }}
        </XanoBackendApi.FetchGetTacticsGET>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(FavoritesScreen);
