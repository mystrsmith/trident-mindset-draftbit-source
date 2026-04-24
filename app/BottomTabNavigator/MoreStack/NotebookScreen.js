import React from 'react';
import {
  Icon,
  IconButton,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  SimpleStyleScrollView,
  TextInput,
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
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CustomCode from '../../../custom-files/CustomCode';
import * as DismissKeyboardView from '../../../custom-files/DismissKeyboardView';
import joinArrayToString from '../../../global-functions/joinArrayToString';
import palettes from '../../../themes/palettes';
import * as Utils from '../../../utils';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';
import waitUtil from '../../../utils/wait';

const NotebookScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isFocusSearchInput, setIsFocusSearchInput] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [myDetails, setMyDetails] = React.useState({});
  const [notificationSetting, setNotificationSetting] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchTermDebounce, setSearchTermDebounce] = React.useState('');
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
  const [textInputValue, setTextInputValue] = React.useState('');
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        const api_Response = (await XanoBackendApi.authMeGET(Constants))?.json;
        if (api_Response) {
          setMyDetails(api_Response);
        }
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
      hasTopSafeArea={false}
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
              opacity: 0.4,
              position: 'absolute',
              right: 0,
              top: 0,
            }
          ),
          dimensions.width
        )}
      />
      <Utils.CustomCodeErrorBoundary>
        <DismissKeyboardView.Index style={{ flex: 1 }}>
          {/* Container */}
          <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
            {/* iOS Margin View */}
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
                    borderBottomWidth: 0.5,
                    borderColor: palettes.App.Outline,
                    paddingLeft: 10,
                    paddingRight: 10,
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

              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                    {
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
                {'My Notebook'}
              </Text>
              {/* Right */}
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
              >
                <Pressable
                  onPress={() => {
                    const handler = async () => {
                      try {
                        navigation.navigate('MoreStack', {});
                        await waitUtil({ milliseconds: 100 });
                        navigation.navigate('NoteDetailScreen', {
                          noteId: null,
                          type: 'my_note',
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    };
                    handler();
                  }}
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
                          fontSize: 18,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Add'}
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* Search Bar */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  borderColor: palettes.App.Outline,
                  borderRadius: 12,
                  borderWidth: 1,
                  flexDirection: 'row',
                  marginBottom: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginTop: 15,
                  opacity: 1,
                  paddingBottom: 4,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 4,
                },
                dimensions.width
              )}
            >
              <Icon
                color={palettes.Brand.Surface}
                name={'Feather/search'}
                size={22}
              />
              <View
                style={StyleSheet.applyWidth(
                  { flex: 1, gap: 1 },
                  dimensions.width
                )}
              >
                {/* Search Input */}
                <TextInput
                  autoCapitalize={'none'}
                  autoCorrect={true}
                  onBlur={() => {
                    const textInputValue = undefined;
                    try {
                      setIsFocusSearchInput(false);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  onChangeText={newSearchInputValue => {
                    const textInputValue = newSearchInputValue;
                    try {
                      if (!newSearchInputValue) {
                        setSearchTermDebounce('');
                      } else {
                      }

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
                  onFocus={() => {
                    const textInputValue = undefined;
                    try {
                      setIsFocusSearchInput(true);
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  onSubmitEditing={() => {
                    const textInputValue = undefined;
                    try {
                      if (searchTerm?.length === 0) {
                        if (true) {
                          return;
                        }
                      } else {
                      }
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  webShowOutline={true}
                  {...GlobalStyles.TextInputStyles(theme)['Text Input'].props}
                  autoComplete={'off'}
                  autoFocus={false}
                  changeTextDelay={250}
                  placeholder={'Search'}
                  placeholderTextColor={palettes.Brand.Surface}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextInputStyles(theme)['Text Input'].style,
                      {
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderBottomWidth: 0,
                        borderLeftWidth: 0,
                        borderRadius: 0,
                        borderRightWidth: 0,
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 20,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 13,
                      }
                    ),
                    dimensions.width
                  )}
                  value={searchTerm}
                />
              </View>
              <>
                {!(searchTerm?.length > 0) ? null : (
                  <IconButton
                    onPress={() => {
                      try {
                        setSearchTerm('');
                        setSearchTermDebounce('');
                        setIsFocusSearchInput(false);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    color={palettes.Brand.Surface}
                    hitSlop={10}
                    icon={'EvilIcons/close-o'}
                    size={32}
                    style={StyleSheet.applyWidth(
                      { position: 'absolute', right: 7 },
                      dimensions.width
                    )}
                  />
                )}
              </>
            </View>
            {/* Search Result */}
            <>
              {!(searchTerm?.length > 0) ? null : (
                <View
                  style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                >
                  {/* Search Result */}
                  <>
                    {!(searchTermDebounce?.length > 0) ? null : (
                      <XanoBackendApi.FetchSearchNotesGET
                        handlers={{
                          onData: searchResultData => {
                            try {
                              console.log(searchResultData);
                            } catch (err) {
                              Sentry.captureException(err);
                              console.error(err);
                            }
                          },
                        }}
                        search_term={searchTermDebounce}
                      >
                        {({ loading, error, data, refetchSearchNotes }) => {
                          const searchResultData = data?.json;
                          if (loading) {
                            return <CommonLoadingBlock />;
                          }

                          if (
                            error ||
                            data?.status < 200 ||
                            data?.status >= 300
                          ) {
                            return <ActivityIndicator />;
                          }

                          return (
                            <>
                              <>
                                {!(searchResultData?.length > 0) ? null : (
                                  <SimpleStyleFlatList
                                    data={searchResultData}
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
                                    listKey={
                                      'Custom Code->Container->Search Result->Search Result->List'
                                    }
                                    nestedScrollEnabled={false}
                                    numColumns={1}
                                    onEndReachedThreshold={0.5}
                                    pagingEnabled={false}
                                    renderItem={({ item, index }) => {
                                      const listData = item;
                                      return (
                                        <>
                                          {/* Checkin Note Item */}
                                          <>
                                            {!(
                                              listData?.type === 'checkin_note'
                                            ) ? null : (
                                              <Pressable
                                                onPress={() => {
                                                  try {
                                                    navigation.navigate(
                                                      'CheckInNoteDetailScreen',
                                                      {
                                                        check_in_note: listData,
                                                      }
                                                    );
                                                  } catch (err) {
                                                    Sentry.captureException(
                                                      err
                                                    );
                                                    console.error(err);
                                                  }
                                                }}
                                              >
                                                <View
                                                  {...GlobalStyles.ViewStyles(
                                                    theme
                                                  )['Menu View'].props}
                                                  style={StyleSheet.applyWidth(
                                                    StyleSheet.compose(
                                                      GlobalStyles.ViewStyles(
                                                        theme
                                                      )['Menu View'].style,
                                                      {
                                                        borderColor:
                                                          palettes.App.Outline,
                                                        height: null,
                                                        paddingBottom: 15,
                                                        paddingTop: 15,
                                                      }
                                                    ),
                                                    dimensions.width
                                                  )}
                                                >
                                                  <Image
                                                    {...GlobalStyles.ImageStyles(
                                                      theme
                                                    )['Image'].props}
                                                    resizeMode={'contain'}
                                                    source={imageSource(
                                                      Images['IcBrain']
                                                    )}
                                                    style={StyleSheet.applyWidth(
                                                      StyleSheet.compose(
                                                        GlobalStyles.ImageStyles(
                                                          theme
                                                        )['Image'].style,
                                                        {
                                                          height: 55,
                                                          width: 55,
                                                        }
                                                      ),
                                                      dimensions.width
                                                    )}
                                                  />
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        flex: 1,
                                                        gap: 3,
                                                        paddingLeft: 15,
                                                        paddingRight: 15,
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Menu Name'].props}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Menu Name'].style,
                                                          {
                                                            fontFamily:
                                                              'Rasa_600SemiBold',
                                                            fontSize: 22,
                                                            marginLeft: null,
                                                            paddingTop: 3,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {'Check-In Notes'}
                                                    </Text>
                                                    {/* Answers */}
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Text'].props}
                                                      ellipsizeMode={'tail'}
                                                      numberOfLines={5}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Text'].style,
                                                          {
                                                            color:
                                                              palettes.Brand
                                                                .Surface,
                                                            fontFamily:
                                                              'Rasa_400Regular',
                                                            fontSize: 16,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {joinArrayToString(
                                                        listData?.answers
                                                      )}
                                                    </Text>
                                                  </View>
                                                  {/* arrow */}
                                                  <Icon
                                                    size={24}
                                                    color={
                                                      palettes.App[
                                                        'Custom Color'
                                                      ]
                                                    }
                                                    name={
                                                      'Feather/chevron-right'
                                                    }
                                                    style={StyleSheet.applyWidth(
                                                      { opacity: 0.6 },
                                                      dimensions.width
                                                    )}
                                                  />
                                                </View>
                                              </Pressable>
                                            )}
                                          </>
                                          {/* Lesson Note Item */}
                                          <>
                                            {!(
                                              listData?.type === 'lesson_note'
                                            ) ? null : (
                                              <Pressable
                                                onPress={() => {
                                                  try {
                                                    navigation.navigate(
                                                      'NoteDetailScreen',
                                                      {
                                                        noteId: listData?.id,
                                                        title:
                                                          listData?.lesson
                                                            ?.title,
                                                        type: 'lesson_note',
                                                      }
                                                    );
                                                  } catch (err) {
                                                    Sentry.captureException(
                                                      err
                                                    );
                                                    console.error(err);
                                                  }
                                                }}
                                              >
                                                <View
                                                  {...GlobalStyles.ViewStyles(
                                                    theme
                                                  )['Menu View'].props}
                                                  style={StyleSheet.applyWidth(
                                                    StyleSheet.compose(
                                                      GlobalStyles.ViewStyles(
                                                        theme
                                                      )['Menu View'].style,
                                                      {
                                                        borderColor:
                                                          palettes.App.Outline,
                                                        height: null,
                                                        paddingBottom: 15,
                                                        paddingTop: 15,
                                                      }
                                                    ),
                                                    dimensions.width
                                                  )}
                                                >
                                                  <Image
                                                    {...GlobalStyles.ImageStyles(
                                                      theme
                                                    )['Image'].props}
                                                    resizeMode={'contain'}
                                                    source={imageSource(
                                                      `${listData?.lesson?.tactic?.photo?.url}`
                                                    )}
                                                    style={StyleSheet.applyWidth(
                                                      StyleSheet.compose(
                                                        GlobalStyles.ImageStyles(
                                                          theme
                                                        )['Image'].style,
                                                        {
                                                          borderColor:
                                                            palettes.App
                                                              .Outline,
                                                          borderRadius: 7,
                                                          borderWidth: 1,
                                                          height: 55,
                                                          width: 55,
                                                        }
                                                      ),
                                                      dimensions.width
                                                    )}
                                                  />
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        flex: 1,
                                                        gap: 3,
                                                        paddingLeft: 15,
                                                        paddingRight: 15,
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    {/* Tactic title */}
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Menu Name'].props}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Menu Name'].style,
                                                          {
                                                            fontFamily:
                                                              'Rasa_600SemiBold',
                                                            fontSize: 22,
                                                            marginLeft: null,
                                                            paddingTop: 3,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {
                                                        listData?.lesson?.tactic
                                                          ?.title
                                                      }
                                                      {' - '}
                                                      {listData?.lesson?.title}
                                                    </Text>
                                                    {/* Text content */}
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Menu Name'].props}
                                                      ellipsizeMode={'tail'}
                                                      numberOfLines={5}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Menu Name'].style,
                                                          {
                                                            color:
                                                              palettes.Brand
                                                                .Surface,
                                                            fontSize: 16,
                                                            marginLeft: null,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {listData?.content}
                                                    </Text>
                                                  </View>
                                                  {/* arrow */}
                                                  <Icon
                                                    size={24}
                                                    color={
                                                      palettes.App[
                                                        'Custom Color'
                                                      ]
                                                    }
                                                    name={
                                                      'Feather/chevron-right'
                                                    }
                                                    style={StyleSheet.applyWidth(
                                                      { opacity: 0.6 },
                                                      dimensions.width
                                                    )}
                                                  />
                                                </View>
                                              </Pressable>
                                            )}
                                          </>
                                          {/* My Note Item */}
                                          <>
                                            {!(
                                              listData?.type === 'my_note'
                                            ) ? null : (
                                              <Pressable
                                                onPress={() => {
                                                  try {
                                                    navigation.navigate(
                                                      'NoteDetailScreen',
                                                      {
                                                        noteId: listData?.id,
                                                        type: 'my_note',
                                                      }
                                                    );
                                                  } catch (err) {
                                                    Sentry.captureException(
                                                      err
                                                    );
                                                    console.error(err);
                                                  }
                                                }}
                                              >
                                                <View
                                                  {...GlobalStyles.ViewStyles(
                                                    theme
                                                  )['Menu View'].props}
                                                  style={StyleSheet.applyWidth(
                                                    StyleSheet.compose(
                                                      GlobalStyles.ViewStyles(
                                                        theme
                                                      )['Menu View'].style,
                                                      {
                                                        borderColor:
                                                          palettes.App.Outline,
                                                        height: null,
                                                        paddingBottom: 15,
                                                        paddingTop: 15,
                                                      }
                                                    ),
                                                    dimensions.width
                                                  )}
                                                >
                                                  <Image
                                                    {...GlobalStyles.ImageStyles(
                                                      theme
                                                    )['Image'].props}
                                                    resizeMode={'contain'}
                                                    source={imageSource(
                                                      Images['IcBrain']
                                                    )}
                                                    style={StyleSheet.applyWidth(
                                                      StyleSheet.compose(
                                                        GlobalStyles.ImageStyles(
                                                          theme
                                                        )['Image'].style,
                                                        {
                                                          height: 55,
                                                          width: 55,
                                                        }
                                                      ),
                                                      dimensions.width
                                                    )}
                                                  />
                                                  <View
                                                    style={StyleSheet.applyWidth(
                                                      {
                                                        flex: 1,
                                                        gap: 3,
                                                        justifyContent:
                                                          'center',
                                                        paddingLeft: 15,
                                                        paddingRight: 15,
                                                      },
                                                      dimensions.width
                                                    )}
                                                  >
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Menu Name'].props}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Menu Name'].style,
                                                          {
                                                            fontFamily:
                                                              'Rasa_600SemiBold',
                                                            fontSize: 22,
                                                            marginLeft: null,
                                                            paddingTop: 3,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {listData?.title}
                                                    </Text>
                                                    {/* Text content */}
                                                    <Text
                                                      accessible={true}
                                                      selectable={false}
                                                      {...GlobalStyles.TextStyles(
                                                        theme
                                                      )['Menu Name'].props}
                                                      ellipsizeMode={'tail'}
                                                      numberOfLines={5}
                                                      style={StyleSheet.applyWidth(
                                                        StyleSheet.compose(
                                                          GlobalStyles.TextStyles(
                                                            theme
                                                          )['Menu Name'].style,
                                                          {
                                                            color:
                                                              palettes.Brand
                                                                .Surface,
                                                            fontSize: 16,
                                                            marginLeft: null,
                                                            paddingTop: 3,
                                                          }
                                                        ),
                                                        dimensions.width
                                                      )}
                                                    >
                                                      {listData?.content}
                                                    </Text>
                                                  </View>
                                                  {/* arrow */}
                                                  <Icon
                                                    size={24}
                                                    color={
                                                      palettes.App[
                                                        'Custom Color'
                                                      ]
                                                    }
                                                    name={
                                                      'Feather/chevron-right'
                                                    }
                                                    style={StyleSheet.applyWidth(
                                                      { opacity: 0.6 },
                                                      dimensions.width
                                                    )}
                                                  />
                                                </View>
                                              </Pressable>
                                            )}
                                          </>
                                        </>
                                      );
                                    }}
                                    showsHorizontalScrollIndicator={true}
                                    showsVerticalScrollIndicator={true}
                                    snapToAlignment={'start'}
                                    style={StyleSheet.applyWidth(
                                      { flex: 1, paddingBottom: 120 },
                                      dimensions.width
                                    )}
                                  />
                                )}
                              </>
                              {/* Empty List State */}
                              <>
                                {!(searchResultData?.length === 0) ? null : (
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        flex: 1,
                                        paddingBottom: 30,
                                        paddingTop: 30,
                                      },
                                      dimensions.width
                                    )}
                                  >
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
                                            fontFamily: 'Rasa_500Medium',
                                            fontSize: 22,
                                          }
                                        ),
                                        dimensions.width
                                      )}
                                    >
                                      {'No data'}
                                    </Text>
                                  </View>
                                )}
                              </>
                            </>
                          );
                        }}
                      </XanoBackendApi.FetchSearchNotesGET>
                    )}
                  </>
                </View>
              )}
            </>
            <>
              {!(searchTerm?.length === 0) ? null : (
                <SimpleStyleScrollView
                  bounces={true}
                  horizontal={false}
                  keyboardShouldPersistTaps={'never'}
                  nestedScrollEnabled={false}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                >
                  {/* Check-In Notes */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.navigate('BottomTabNavigator', {
                          screen: 'MoreStack',
                          params: { screen: 'CheckInNotesScreen' },
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
                  >
                    <View
                      {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ViewStyles(theme)['Menu View'].style,
                          { borderColor: palettes.App.Outline, height: 55 }
                        ),
                        dimensions.width
                      )}
                    >
                      <Image
                        {...GlobalStyles.ImageStyles(theme)['Image'].props}
                        resizeMode={'contain'}
                        source={imageSource(Images['IcBrain'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ImageStyles(theme)['Image'].style,
                            { height: 30, width: 30 }
                          ),
                          dimensions.width
                        )}
                      />
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Menu Name'].style,
                            { marginLeft: 12, paddingTop: 3 }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Check-In Notes'}
                      </Text>
                      {/* arrow */}
                      <Icon
                        size={24}
                        color={palettes.App['Custom Color']}
                        name={'Feather/chevron-right'}
                        style={StyleSheet.applyWidth(
                          { opacity: 0.6 },
                          dimensions.width
                        )}
                      />
                    </View>
                  </Pressable>
                  {/* Lesson Notes */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.navigate('BottomTabNavigator', {
                          screen: 'MoreStack',
                          params: { screen: 'LessonNotesTacticsScreen' },
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
                  >
                    <View
                      {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ViewStyles(theme)['Menu View'].style,
                          { borderColor: palettes.App.Outline, height: 55 }
                        ),
                        dimensions.width
                      )}
                    >
                      <Image
                        {...GlobalStyles.ImageStyles(theme)['Image'].props}
                        resizeMode={'contain'}
                        source={imageSource(Images['IcBrain'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ImageStyles(theme)['Image'].style,
                            { height: 30, width: 30 }
                          ),
                          dimensions.width
                        )}
                      />
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Menu Name'].style,
                            { marginLeft: 12, paddingTop: 3 }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Lesson Notes'}
                      </Text>
                      {/* arrow */}
                      <Icon
                        size={24}
                        color={palettes.App['Custom Color']}
                        name={'Feather/chevron-right'}
                        style={StyleSheet.applyWidth(
                          { opacity: 0.6 },
                          dimensions.width
                        )}
                      />
                    </View>
                  </Pressable>
                  {/* My Notes */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.navigate('BottomTabNavigator', {
                          screen: 'MoreStack',
                          params: { screen: 'MyNotesScreen' },
                        });
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                    activeOpacity={0.3}
                  >
                    <View
                      {...GlobalStyles.ViewStyles(theme)['Menu View'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.ViewStyles(theme)['Menu View'].style,
                          { borderColor: palettes.App.Outline, height: 55 }
                        ),
                        dimensions.width
                      )}
                    >
                      <Image
                        {...GlobalStyles.ImageStyles(theme)['Image'].props}
                        resizeMode={'contain'}
                        source={imageSource(Images['IcBrain'])}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.ImageStyles(theme)['Image'].style,
                            { height: 30, width: 30 }
                          ),
                          dimensions.width
                        )}
                      />
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Menu Name'].style,
                            { marginLeft: 12, paddingTop: 3 }
                          ),
                          dimensions.width
                        )}
                      >
                        {'My Notes'}
                      </Text>
                      {/* arrow */}
                      <Icon
                        size={24}
                        color={palettes.App['Custom Color']}
                        name={'Feather/chevron-right'}
                        style={StyleSheet.applyWidth(
                          { opacity: 0.6 },
                          dimensions.width
                        )}
                      />
                    </View>
                  </Pressable>
                </SimpleStyleScrollView>
              )}
            </>
          </View>
        </DismissKeyboardView.Index>
      </Utils.CustomCodeErrorBoundary>
    </ScreenContainer>
  );
};

export default withTheme(NotebookScreen);
