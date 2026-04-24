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
import { Image, Modal, Platform, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonHeaderBlock from '../../../components/CommonHeaderBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import * as CustomCode from '../../../custom-files/CustomCode';
import isNullOrUndefined from '../../../global-functions/isNullOrUndefined';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const defaultProps = { tactic: null };

const LessonNotesLessonsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [deletingItem, setDeletingItem] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [local_tactic, setLocal_tactic] = React.useState(
    params?.tactic ?? defaultProps.tactic
  );
  const [myDetails, setMyDetails] = React.useState({});
  const [notificationSetting, setNotificationSetting] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
  const handleLocalDeleteNote = deletedNoteId => {
    try {
      let updatedLocalTactic = { ...local_tactic };
      updatedLocalTactic.lessons = updatedLocalTactic?.lessons?.filter(
        lesson => lesson.note.id !== deletedNoteId
      );
      setLocal_tactic(updatedLocalTactic);
      if (updatedLocalTactic?.lessons?.length === 0) {
        navigation.goBack();
      } else {
      }
    } catch (error) {
      console.error('Error updating local tactic after deletion:', error);
    }
  };
  const xanoBackendDeleteNoteDELETE = XanoBackendApi.useDeleteNoteDELETE();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    try {
      if (!isFocused) {
        return;
      }
      setLocal_tactic(params?.tactic ?? defaultProps.tactic);
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
          <CommonHeaderBlock
            title={(params?.tactic ?? defaultProps.tactic)?.title}
          />
          <SimpleStyleFlatList
            data={local_tactic?.lessons}
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
            listKey={'Linear Gradient->Container->List'}
            nestedScrollEnabled={false}
            numColumns={1}
            onEndReachedThreshold={0.5}
            pagingEnabled={false}
            renderItem={({ item, index }) => {
              const listData = item;
              return (
                <>
                  {/* Lesson Item */}
                  <Pressable
                    onPress={() => {
                      try {
                        navigation.navigate('NoteDetailScreen', {
                          noteId: listData?.note?.id,
                          title: listData?.title,
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
                      {/* Image Wrapper */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            backgroundColor: palettes.App.Black_Alpha_80,
                            borderColor: palettes.App.Outline,
                            borderRadius: 12,
                            borderWidth: 1,
                            justifyContent: 'center',
                            padding: 5,
                          },
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
                              { borderRadius: 12, height: 35, width: 35 }
                            ),
                            dimensions.width
                          )}
                        />
                      </View>

                      <View
                        style={StyleSheet.applyWidth(
                          {
                            flex: 1,
                            justifyContent: 'center',
                            paddingLeft: 15,
                            paddingRight: 15,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Title */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Menu Name'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Menu Name'].style,
                              {
                                flex: null,
                                fontFamily: 'Rasa_600SemiBold',
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
                        {/* Sub title */}
                        <>
                          {!listData?.sub_title ? null : (
                            <Text
                              accessible={true}
                              selectable={false}
                              {...GlobalStyles.TextStyles(theme)['Menu Name']
                                .props}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextStyles(theme)['Menu Name']
                                    .style,
                                  {
                                    color: palettes.App.Studily_Purple_Light,
                                    flex: null,
                                    fontFamily: 'Rasa_500Medium_Italic',
                                    fontSize: 16,
                                    marginLeft: null,
                                    paddingTop: 3,
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
                      {/* Actions */}
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
                            name={'MaterialCommunityIcons/trash-can-outline'}
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
                </>
              );
            }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            snapToAlignment={'start'}
          />
        </View>
      </LinearGradient>
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
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
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
                    backgroundColor: palettes.App['App Buttons Color'],
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
                        await xanoBackendDeleteNoteDELETE.mutateAsync({
                          note_id: deletingItem?.note?.id,
                        })
                      )?.json;
                      handleLocalDeleteNote(deletingItem?.note?.id);
                      setDeletingItem(null);
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
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
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
    </ScreenContainer>
  );
};

export default withTheme(LessonNotesLessonsScreen);
