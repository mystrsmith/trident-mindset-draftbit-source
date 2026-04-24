import React from 'react';
import {
  Divider,
  ExpoImage,
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  ImageBackground,
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
import * as CustomCode from '../custom-files/CustomCode';
import isSubscribed from '../global-functions/isSubscribed';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { screen_title: 'Categories', tactic_id: 17 };

const CategoriesScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const shouldDisabledItem = (listItem, isSubscribed) => {
    return (
      listItem?.is_coming_soon ||
      (listItem?.is_paid_only === true && isSubscribed !== true)
    );
  };
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (!isFocused) {
      return;
    }
    const entry = StatusBar.pushStackEntry?.({ barStyle: 'light-content' });
    return () => StatusBar.popStackEntry?.(entry);
  }, [isFocused]);

  return (
    <ScreenContainer hasSafeArea={false} scrollable={false}>
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
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            activeOpacity={0.3}
          >
            <View>
              {/* Back Icon */}
              <Icon
                size={24}
                color={palettes.App['Custom Color']}
                name={'Ionicons/chevron-back'}
              />
            </View>
          </Pressable>
          {/* Header Text */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  color: Constants['APP_FONT_COLOR'],
                  fontFamily: 'Rasa_600SemiBold',
                  fontSize: 25,
                }
              ),
              dimensions.width
            )}
          >
            {params?.screen_title ?? defaultProps.screen_title}
          </Text>
          {/* Blank View */}
          <View
            style={StyleSheet.applyWidth(
              { height: 20, width: 20 },
              dimensions.width
            )}
          />
        </View>
        <Divider
          {...GlobalStyles.DividerStyles(theme)['Divider'].props}
          color={palettes.App.Outline}
          style={StyleSheet.applyWidth(
            GlobalStyles.DividerStyles(theme)['Divider'].style,
            dimensions.width
          )}
        />
        {/* List Wrapper */}
        <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
          <XanoBackendApi.FetchGetCategoriesGET
            tacticId={params?.tactic_id ?? defaultProps.tactic_id}
          >
            {({ loading, error, data, refetchGetCategories }) => {
              const fetchData = data?.json;
              if (loading) {
                return <ActivityIndicator />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <>
                  <>
                    {!(fetchData?.length > 0) ? null : (
                      <SimpleStyleFlatList
                        data={fetchData}
                        decelerationRate={'normal'}
                        inverted={false}
                        keyExtractor={(listData, index) =>
                          listData?.id ??
                          listData?.uuid ??
                          index?.toString() ??
                          JSON.stringify(listData)
                        }
                        keyboardShouldPersistTaps={'never'}
                        listKey={'Container->List Wrapper->Fetch->List'}
                        nestedScrollEnabled={false}
                        onEndReachedThreshold={0.5}
                        pagingEnabled={false}
                        renderItem={({ item, index }) => {
                          const listData = item;
                          return (
                            <View
                              style={StyleSheet.applyWidth(
                                {
                                  alignItems: 'center',
                                  flex: 1,
                                  marginBottom: 15,
                                  width: dimensions.width / 2 - 20,
                                },
                                dimensions.width
                              )}
                            >
                              <Pressable
                                onPress={() => {
                                  try {
                                    navigation.navigate('LessonsScreen', {
                                      category_id: listData?.id,
                                      tactic_prop: listData,
                                      tactic_id: null,
                                      screen_title:
                                        params?.screen_title ??
                                        defaultProps.screen_title,
                                    });
                                  } catch (err) {
                                    Sentry.captureException(err);
                                    console.error(err);
                                  }
                                }}
                                disabled={Boolean(
                                  shouldDisabledItem(
                                    listData,
                                    isSubscribed(Variables)
                                  )
                                )}
                                disabledOpacity={1}
                              >
                                <View
                                  style={StyleSheet.applyWidth(
                                    { borderRadius: 20 },
                                    dimensions.width
                                  )}
                                >
                                  {/* Image Wrapper */}
                                  <View>
                                    <ExpoImage
                                      allowDownscaling={true}
                                      cachePolicy={'disk'}
                                      contentPosition={'center'}
                                      transitionDuration={300}
                                      transitionEffect={'cross-dissolve'}
                                      transitionTiming={'ease-in-out'}
                                      {...GlobalStyles.ExpoImageStyles(theme)[
                                        'Image 19'
                                      ].props}
                                      resizeMode={'contain'}
                                      source={imageSource(
                                        `${listData?.photo?.url}`
                                      )}
                                      style={StyleSheet.applyWidth(
                                        StyleSheet.compose(
                                          GlobalStyles.ExpoImageStyles(theme)[
                                            'Image 19'
                                          ].style,
                                          {
                                            borderColor: 'rgba(0, 0, 0, 0.25)',
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            height: [
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value: 165,
                                              },
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value: dimensions.width / 2.5,
                                              },
                                            ],
                                            opacity: [
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value: 1,
                                              },
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value:
                                                  listData?.is_paid_only ===
                                                    true &&
                                                  isSubscribed(Variables) ===
                                                    false
                                                    ? 0.5
                                                    : 1,
                                              },
                                            ],
                                            width: [
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value: 165,
                                              },
                                              {
                                                minWidth: Breakpoints.Mobile,
                                                value: dimensions.width / 2.5,
                                              },
                                            ],
                                          }
                                        ),
                                        dimensions.width
                                      )}
                                    />
                                  </View>
                                  {/* Title Wrapper */}
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: dimensions.width / 2.5,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Title */}
                                    <Text
                                      accessible={true}
                                      selectable={false}
                                      {...GlobalStyles.TextStyles(theme)['Text']
                                        .props}
                                      numberOfLines={2}
                                      style={StyleSheet.applyWidth(
                                        StyleSheet.compose(
                                          GlobalStyles.TextStyles(theme)['Text']
                                            .style,
                                          {
                                            color: palettes.App.White,
                                            fontFamily: 'Rasa_600SemiBold',
                                            fontSize: 17,
                                            marginTop: 10,
                                            textAlign: 'center',
                                          }
                                        ),
                                        dimensions.width
                                      )}
                                      contentContainerStyle={StyleSheet.applyWidth(
                                        GlobalStyles.TextStyles(theme)['Text']
                                          .style,
                                        dimensions.width
                                      )}
                                    >
                                      {listData?.title}
                                    </Text>
                                  </View>
                                </View>
                                {/* Coming Soon View */}
                                <>
                                  {!(
                                    listData?.is_coming_soon === true
                                  ) ? null : (
                                    <View
                                      style={[
                                        StyleSheet.applyWidth(
                                          {
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            backgroundColor:
                                              theme.colors.background.danger,
                                            borderRadius: 6,
                                            paddingBottom: 2,
                                            paddingTop: 2,
                                            position: 'absolute',
                                            top: 65,
                                            width: 170,
                                          },
                                          dimensions.width
                                        ),
                                        { transform: [{ rotate: '-35deg' }] },
                                      ]}
                                    >
                                      {/* Coming Soon Text */}
                                      <Text
                                        accessible={true}
                                        selectable={false}
                                        {...GlobalStyles.TextStyles(theme)[
                                          'Text'
                                        ].props}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].style,
                                            {
                                              color: palettes.App.White,
                                              fontFamily: 'Rasa_400Regular',
                                              fontSize: 20,
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {'Coming Soon'}
                                      </Text>
                                    </View>
                                  )}
                                </>
                              </Pressable>
                              {/* Locked */}
                              <>
                                {!(
                                  listData?.is_paid_only === true &&
                                  isSubscribed(Variables) === false
                                ) ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        backgroundColor: 'rgba(0, 0, 0, 0)',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        left: 0,
                                        paddingLeft: 18,
                                        position: 'absolute',
                                        right: 0,
                                        top: -8,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    <View
                                      style={StyleSheet.applyWidth(
                                        {
                                          alignItems: 'center',
                                          height: 55,
                                          marginTop: 20,
                                        },
                                        dimensions.width
                                      )}
                                    >
                                      <ExpoImage
                                        allowDownscaling={true}
                                        cachePolicy={'disk'}
                                        contentPosition={'center'}
                                        resizeMode={'cover'}
                                        transitionDuration={300}
                                        transitionEffect={'cross-dissolve'}
                                        transitionTiming={'ease-in-out'}
                                        {...GlobalStyles.ExpoImageStyles(theme)[
                                          'Image 20'
                                        ].props}
                                        source={imageSource(Images['Frame'])}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.ExpoImageStyles(theme)[
                                              'Image 20'
                                            ].style,
                                            { height: 34, width: 34 }
                                          ),
                                          dimensions.width
                                        )}
                                      />
                                      <Text
                                        accessible={true}
                                        selectable={false}
                                        {...GlobalStyles.TextStyles(theme)[
                                          'Text'
                                        ].props}
                                        style={StyleSheet.applyWidth(
                                          StyleSheet.compose(
                                            GlobalStyles.TextStyles(theme)[
                                              'Text'
                                            ].style,
                                            {
                                              color:
                                                palettes.App['Custom Color_9'],
                                              fontSize: 10,
                                              textAlign: 'center',
                                            }
                                          ),
                                          dimensions.width
                                        )}
                                      >
                                        {'Upgrade'}
                                      </Text>
                                    </View>
                                  </View>
                                )}
                              </>
                            </View>
                          );
                        }}
                        snapToAlignment={'start'}
                        horizontal={false}
                        numColumns={2}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={StyleSheet.applyWidth(
                          {
                            flex: 1,
                            paddingBottom: 100,
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 15,
                          },
                          dimensions.width
                        )}
                      />
                    )}
                  </>
                  <>
                    {!(fetchData?.length === 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          { flex: 1, justifyContent: 'center' },
                          dimensions.width
                        )}
                      >
                        {/* No Category Text */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App.White,
                                fontFamily: 'Rasa_300Light',
                                fontSize: 20,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'There is no category to display'}
                        </Text>
                      </View>
                    )}
                  </>
                </>
              );
            }}
          </XanoBackendApi.FetchGetCategoriesGET>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CategoriesScreen);
