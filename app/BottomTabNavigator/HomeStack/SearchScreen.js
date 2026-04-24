import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  TextInput,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import cropTextWithSearchTerm from '../../../global-functions/cropTextWithSearchTerm';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const SearchScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [heading, setHeading] = React.useState('');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermDebounce, setSearchTermDebounce] = React.useState('');
  const [textInputValue, setTextInputValue] = React.useState('');
  const xanoBackendCreateSearchTermPOST =
    XanoBackendApi.useCreateSearchTermPOST();
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
      {/* Header */}
      <View
        {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(
            GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
            { justifyContent: 'space-between' }
          ),
          dimensions.width
        )}
      >
        {/* Left View */}
        <View
          style={StyleSheet.applyWidth(
            { marginLeft: 10, marginRight: 20 },
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
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 40,
                  width: 40,
                },
                dimensions.width
              )}
            >
              <Icon
                size={24}
                color={palettes.App['Custom Color']}
                name={'Ionicons/chevron-back'}
                style={StyleSheet.applyWidth(
                  { marginRight: 6 },
                  dimensions.width
                )}
              />
            </View>
          </Pressable>
        </View>

        <Text
          accessible={true}
          selectable={false}
          {...GlobalStyles.TextStyles(theme)['Text'].props}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
              color: palettes.Brand.Surface,
              fontFamily: 'Poppins_600SemiBold',
              fontSize: 15,
            }),
            dimensions.width
          )}
        >
          {'Search'}
        </Text>
        {/* Right View */}
        <View
          style={StyleSheet.applyWidth(
            { marginLeft: 10, marginRight: 20 },
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
                  alignItems: 'center',
                  flexDirection: 'row',
                  height: 40,
                  width: 40,
                },
                dimensions.width
              )}
            />
          </Pressable>
        </View>
      </View>
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* Search Bar */}
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: palettes.Brand.Surface,
              flexDirection: 'row',
              opacity: 1,
              paddingBottom: 10,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 10,
            },
            dimensions.width
          )}
        >
          <Icon
            color={theme.colors.branding.secondary}
            name={'Feather/search'}
            size={26}
          />
          <View
            style={StyleSheet.applyWidth({ flex: 1, gap: 1 }, dimensions.width)}
          >
            {/* Search Input */}
            <TextInput
              autoCapitalize={'none'}
              autoCorrect={true}
              changeTextDelay={500}
              onChangeText={newSearchInputValue => {
                const textInputValue = newSearchInputValue;
                try {
                  setSearchTerm(newSearchInputValue);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              onChangeTextDelayed={newSearchInputValue => {
                const textInputValue = newSearchInputValue;
                try {
                  setSearchTermDebounce(newSearchInputValue);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              onSubmitEditing={() => {
                const handler = async () => {
                  const textInputValue = undefined;
                  try {
                    (
                      await xanoBackendCreateSearchTermPOST.mutateAsync({
                        content: searchTerm,
                      })
                    )?.json;
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
              webShowOutline={true}
              {...GlobalStyles.TextInputStyles(theme)['Text Input'].props}
              autoComplete={'off'}
              autoFocus={false}
              placeholder={'Search'}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.TextInputStyles(theme)['Text Input'].style,
                  {
                    backgroundColor: 'rgba(0, 0, 0, 0)',
                    borderBottomWidth: 0,
                    borderColor: null,
                    borderLeftWidth: 0,
                    borderRadius: 0,
                    borderRightWidth: 0,
                    color: palettes.Brand.Surface,
                  }
                ),
                dimensions.width
              )}
              value={searchTerm}
            />
          </View>
        </View>
        {/* Content */}
        <View>
          <>
            {!(searchTerm?.length === 0) ? null : (
              <XanoBackendApi.FetchGetSearchTermsGET>
                {({ loading, error, data, refetchGetSearchTerms }) => {
                  const fetchData = data?.json;
                  if (loading) {
                    return <ActivityIndicator />;
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  return (
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
                      listKey={'Container->Content->Fetch->List'}
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <Pressable
                            onPress={() => {
                              try {
                                setSearchTerm(listData?.content);
                                setSearchTermDebounce(listData?.content);
                              } catch (err) {
                                Sentry.captureException(err);
                                console.error(err);
                              }
                            }}
                            style={StyleSheet.applyWidth(
                              { marginBottom: 15 },
                              dimensions.width
                            )}
                          >
                            <View
                              style={StyleSheet.applyWidth(
                                { alignItems: 'center', flexDirection: 'row' },
                                dimensions.width
                              )}
                            >
                              <Icon
                                size={24}
                                color={palettes.Brand.Surface}
                                name={'EvilIcons/search'}
                              />
                              <Text
                                accessible={true}
                                selectable={false}
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: palettes.Brand.Surface,
                                      paddingLeft: 7,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {listData?.content}
                              </Text>
                            </View>
                          </Pressable>
                        );
                      }}
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={true}
                      contentContainerStyle={StyleSheet.applyWidth(
                        { padding: 20 },
                        dimensions.width
                      )}
                    />
                  );
                }}
              </XanoBackendApi.FetchGetSearchTermsGET>
            )}
          </>
          {/* Search Result */}
          <>
            {!(searchTerm?.length > 0) ? null : (
              <XanoBackendApi.FetchSearchGET search_term={searchTermDebounce}>
                {({ loading, error, data, refetchSearch }) => {
                  const searchResultData = data?.json;
                  if (loading) {
                    return <ActivityIndicator />;
                  }

                  if (error || data?.status < 200 || data?.status >= 300) {
                    return <ActivityIndicator />;
                  }

                  return (
                    <FlatList
                      data={searchResultData?.lessons}
                      horizontal={false}
                      inverted={false}
                      keyExtractor={(listData, index) =>
                        listData?.id ??
                        listData?.uuid ??
                        index?.toString() ??
                        JSON.stringify(listData)
                      }
                      keyboardShouldPersistTaps={'never'}
                      listKey={'Container->Content->Search Result->List'}
                      nestedScrollEnabled={false}
                      numColumns={1}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item, index }) => {
                        const listData = item;
                        return (
                          <Pressable
                            onPress={() => {
                              try {
                                navigation.navigate('RootNavigator', {});
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
                                  flexDirection: 'row',
                                  padding: 10,
                                },
                                dimensions.width
                              )}
                            >
                              <Image
                                resizeMode={'cover'}
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                source={imageSource(
                                  `${listData?.tactic?.portrait_image?.url}`
                                )}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    {
                                      borderColor: theme.colors.text.light,
                                      borderRadius: 10,
                                      borderWidth: 2,
                                      height: 120,
                                      width: 90,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              />
                              <View
                                style={StyleSheet.applyWidth(
                                  {
                                    flex: 1,
                                    flexWrap: 'wrap',
                                    justifyContent: 'space-between',
                                    paddingLeft: 15,
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
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.TextStyles(theme)['Text']
                                        .style,
                                      {
                                        color: palettes.Brand.Surface,
                                        flex: 1,
                                        fontFamily: 'Poppins_700Bold',
                                        fontSize: 16,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  {listData?.title}
                                </Text>
                                {/* Text content */}
                                <>
                                  {!(
                                    cropTextWithSearchTerm(
                                      listData?.text_content,
                                      searchTermDebounce
                                    )?.length > 0
                                  ) ? null : (
                                    <Text
                                      accessible={true}
                                      selectable={false}
                                      {...GlobalStyles.TextStyles(theme)['Text']
                                        .props}
                                      style={StyleSheet.applyWidth(
                                        StyleSheet.compose(
                                          GlobalStyles.TextStyles(theme)['Text']
                                            .style,
                                          {
                                            color: palettes.Brand.Surface,
                                            flex: 1,
                                            fontFamily: 'Poppins_300Light',
                                            fontSize: 12,
                                            paddingTop: 5,
                                          }
                                        ),
                                        dimensions.width
                                      )}
                                    >
                                      {'... '}
                                      {cropTextWithSearchTerm(
                                        listData?.text_content,
                                        searchTermDebounce
                                      )}
                                      {' ...'}
                                    </Text>
                                  )}
                                </>
                              </View>
                            </View>
                          </Pressable>
                        );
                      }}
                      showsHorizontalScrollIndicator={true}
                      showsVerticalScrollIndicator={true}
                      contentContainerStyle={StyleSheet.applyWidth(
                        {
                          paddingBottom: 15,
                          paddingLeft: 10,
                          paddingRight: 10,
                          paddingTop: 15,
                        },
                        dimensions.width
                      )}
                    />
                  );
                }}
              </XanoBackendApi.FetchSearchGET>
            )}
          </>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(SearchScreen);
