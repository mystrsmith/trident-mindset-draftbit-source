import React from 'react';
import {
  Icon,
  LinearGradient,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import EmptyListStateBlock from '../../../components/EmptyListStateBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import formatDateTime from '../../../global-functions/formatDateTime';
import isNullOrUndefined from '../../../global-functions/isNullOrUndefined';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const MyNotesScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [deletingItem, setDeletingItem] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [myDetails, setMyDetails] = React.useState({});
  const [notificationSetting, setNotificationSetting] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
  const xanoBackendDeleteNoteDELETE = XanoBackendApi.useDeleteNoteDELETE();
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
      <LinearGradient
        endX={100}
        endY={100}
        startX={0}
        startY={0}
        {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
        color1={palettes.App.Black_Alpha_80}
        color2={palettes.App['Background 90 Opacity']}
        color3={palettes.App.Black_Alpha_80}
        style={StyleSheet.applyWidth(
          GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
          dimensions.width
        )}
      >
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
          {/* Common Header */}
          <View
            {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                {
                  borderBottomWidth: 1,
                  borderColor: palettes.App.Outline,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
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
                    flex: 1,
                    fontFamily: 'Rasa_500Medium',
                    fontSize: 24,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'My Notes'}
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
            >
              <Pressable
                onPress={() => {
                  try {
                    navigation.navigate('NoteDetailScreen', {
                      noteId: null,
                      type: 'my_note',
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
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

          <XanoBackendApi.FetchGetNotesGET type={'my_note'}>
            {({ loading, error, data, refetchGetNotes }) => {
              const fetchData = data?.json;
              if (loading) {
                return <CommonLoadingBlock />;
              }

              if (error || data?.status < 200 || data?.status >= 300) {
                return <ActivityIndicator />;
              }

              return (
                <>
                  <>
                    {!(fetchData?.length === 0) ? null : (
                      <EmptyListStateBlock />
                    )}
                  </>
                  <>
                    {!(fetchData?.length > 0) ? null : (
                      <SimpleStyleFlatList
                        data={fetchData}
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
                        listKey={'Linear Gradient->Container->Fetch->List'}
                        nestedScrollEnabled={false}
                        numColumns={1}
                        onEndReachedThreshold={0.5}
                        pagingEnabled={false}
                        renderItem={({ item, index }) => {
                          const listData = item;
                          return (
                            <View>
                              {/* Note */}
                              <Pressable
                                onPress={() => {
                                  try {
                                    navigation.navigate('NoteDetailScreen', {
                                      noteId: listData?.id,
                                      type: 'my_note',
                                    });
                                  } catch (err) {
                                    Sentry.captureException(err);
                                    console.error(err);
                                  }
                                }}
                                activeOpacity={0.3}
                              >
                                <View
                                  {...GlobalStyles.ViewStyles(theme)[
                                    'Menu View'
                                  ].props}
                                  style={StyleSheet.applyWidth(
                                    StyleSheet.compose(
                                      GlobalStyles.ViewStyles(theme)[
                                        'Menu View'
                                      ].style,
                                      {
                                        borderColor: palettes.App.Outline,
                                        height: null,
                                        paddingBottom: 15,
                                        paddingTop: 15,
                                      }
                                    ),
                                    dimensions.width
                                  )}
                                >
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        flex: 1,
                                        gap: 10,
                                        justifyContent: 'center',
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                      },
                                      dimensions.width
                                    )}
                                  >
                                    {/* Title */}
                                    <>
                                      {!listData?.title ? null : (
                                        <Text
                                          accessible={true}
                                          selectable={false}
                                          {...GlobalStyles.TextStyles(theme)[
                                            'Menu Name'
                                          ].props}
                                          style={StyleSheet.applyWidth(
                                            StyleSheet.compose(
                                              GlobalStyles.TextStyles(theme)[
                                                'Menu Name'
                                              ].style,
                                              {
                                                color: palettes.Brand.Surface,
                                                flex: null,
                                                fontFamily: 'Rasa_600SemiBold',
                                                fontSize: 23,
                                                marginLeft: null,
                                                paddingTop: 3,
                                              }
                                            ),
                                            dimensions.width
                                          )}
                                        >
                                          {formatDateTime(
                                            listData?.updated_at,
                                            'MM/DD/YY'
                                          )}
                                          {' - '}
                                          {listData?.title}
                                        </Text>
                                      )}
                                    </>
                                    {/* Content */}
                                    <>
                                      {!listData?.content ? null : (
                                        <Text
                                          accessible={true}
                                          selectable={false}
                                          {...GlobalStyles.TextStyles(theme)[
                                            'Menu Name'
                                          ].props}
                                          style={StyleSheet.applyWidth(
                                            StyleSheet.compose(
                                              GlobalStyles.TextStyles(theme)[
                                                'Menu Name'
                                              ].style,
                                              {
                                                color: palettes.Brand.Surface,
                                                flex: null,
                                                fontSize: 17,
                                                marginLeft: null,
                                                paddingTop: 3,
                                              }
                                            ),
                                            dimensions.width
                                          )}
                                        >
                                          {listData?.content}
                                        </Text>
                                      )}
                                    </>
                                  </View>
                                  {/* View 2 */}
                                  <View
                                    style={StyleSheet.applyWidth(
                                      {
                                        alignItems: 'center',
                                        gap: 15,
                                        justifyContent: 'space-between',
                                      },
                                      dimensions.width
                                    )}
                                  >
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
                                    <Pressable
                                      onPress={() => {
                                        try {
                                          setDeletingItem(listData);
                                        } catch (err) {
                                          Sentry.captureException(err);
                                          console.error(err);
                                        }
                                      }}
                                    >
                                      {/* delete */}
                                      <Icon
                                        color={palettes.App['Custom Color']}
                                        name={
                                          'MaterialCommunityIcons/trash-can-outline'
                                        }
                                        size={21}
                                        style={StyleSheet.applyWidth(
                                          { opacity: 0.6 },
                                          dimensions.width
                                        )}
                                      />
                                    </Pressable>
                                  </View>
                                </View>
                              </Pressable>
                            </View>
                          );
                        }}
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                        snapToAlignment={'start'}
                        style={StyleSheet.applyWidth(
                          { flex: 1 },
                          dimensions.width
                        )}
                      />
                    )}
                  </>
                  {/* Modal Confirm Delete */}
                  <Modal
                    supportedOrientations={['portrait', 'landscape']}
                    animationType={'slide'}
                    transparent={true}
                    visible={Boolean(!isNullOrUndefined(deletingItem))}
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
                        {
                          alignItems: 'center',
                          flex: 1,
                          justifyContent: 'center',
                        },
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
                                fontSize: 24,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Are you sure you’d like to delete this note?'}
                        </Text>
                        {/* CTAs */}
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
                          {/* Cancel */}
                          <Pressable
                            onPress={() => {
                              try {
                                setDeletingItem(null);
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
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: palettes.Brand.Surface,
                                      fontFamily: 'Poppins_600SemiBold',
                                      fontSize: 16,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'No'}
                              </Text>
                            </View>
                          </Pressable>
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                backgroundColor:
                                  palettes.App['App Buttons Color'],
                                height: '100%',
                                width: 1,
                              },
                              dimensions.width
                            )}
                          />
                          {/* Confirm */}
                          <Pressable
                            onPress={() => {
                              const handler = async () => {
                                try {
                                  (
                                    await xanoBackendDeleteNoteDELETE.mutateAsync(
                                      { note_id: deletingItem?.id }
                                    )
                                  )?.json;
                                  setDeletingItem(null);
                                  await refetchGetNotes();
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              };
                              handler();
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
                                {...GlobalStyles.TextStyles(theme)['Text']
                                  .props}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.TextStyles(theme)['Text']
                                      .style,
                                    {
                                      color: palettes.Brand.Surface,
                                      fontFamily: 'Poppins_600SemiBold',
                                      fontSize: 16,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {'Yes'}
                              </Text>
                            </View>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </>
              );
            }}
          </XanoBackendApi.FetchGetNotesGET>
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
};

export default withTheme(MyNotesScreen);
