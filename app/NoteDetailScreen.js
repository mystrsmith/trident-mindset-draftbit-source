import React from 'react';
import {
  Icon,
  LinearGradient,
  Pressable,
  ScreenContainer,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  Text,
  View,
} from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../components/CommonLoadingBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as DismissKeyboardView from '../custom-files/DismissKeyboardView';
import * as NoteEditor from '../custom-files/NoteEditor';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';
import waitUtil from '../utils/wait';

const defaultProps = { noteId: null, title: null, type: null };

const NoteDetailScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [content, setContent] = React.useState('');
  const [isLoadingDone, setIsLoadingDone] = React.useState(false);
  const [isLoadingNote, setIsLoadingNote] = React.useState(true);
  const [title, setTitle] = React.useState('');
  const xanoBackendCreateNotePOST = XanoBackendApi.useCreateNotePOST();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        if (params?.noteId ?? defaultProps.noteId) {
          setIsLoadingNote(true);
          const resultNote = (
            await XanoBackendApi.getNoteGET(Constants, {
              note_id: params?.noteId ?? defaultProps.noteId,
            })
          )?.json;
          setTitle(resultNote?.title);
          setContent(resultNote?.content);
          setIsLoadingNote(false);
        } else {
          setIsLoadingNote(false);
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
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      <Utils.CustomCodeErrorBoundary>
        <DismissKeyboardView.Index style={{ flex: 1 }}>
          <LinearGradient
            endX={100}
            endY={100}
            startX={0}
            startY={0}
            {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient']
              .props}
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
                        height: 50,
                        justifyContent: 'center',
                        width: 50,
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
                <>
                  {!(params?.title ?? defaultProps.title) ? null : (
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                      ellipsizeMode={'tail'}
                      numberOfLines={1}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                          {
                            color: Constants['APP_FONT_COLOR'],
                            flex: 1,
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 25,
                            paddingLeft: 15,
                            paddingRight: 15,
                            textAlign: 'center',
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {params?.title ?? defaultProps.title}
                    </Text>
                  )}
                </>
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'flex-end',
                      height: 50,
                      justifyContent: 'center',
                      width: 50,
                    },
                    dimensions.width
                  )}
                >
                  <>
                    {params?.noteId ?? defaultProps.noteId ? null : (
                      <Pressable
                        onPress={() => {
                          const handler = async () => {
                            try {
                              if (
                                title?.length === 0 ||
                                content?.length === 0
                              ) {
                                showToastMessage(
                                  'Alert',
                                  'Please fill the note title and content'
                                );
                                if (true) {
                                  return;
                                }
                              } else {
                              }

                              setIsLoadingDone(true);
                              if (
                                (params?.noteId ?? defaultProps.noteId) === null
                              ) {
                                (
                                  await xanoBackendCreateNotePOST.mutateAsync({
                                    content: content,
                                    title: title,
                                    type: 'my_note',
                                  })
                                )?.json;
                              } else {
                              }

                              undefined;
                              await waitUtil({ milliseconds: 250 });
                              setIsLoadingDone(false);
                              navigation.goBack();
                            } catch (err) {
                              Sentry.captureException(err);
                              console.error(err);
                            }
                          };
                          handler();
                        }}
                        disabledOpacity={0.5}
                      >
                        <View
                          style={StyleSheet.applyWidth(
                            { alignItems: 'center', justifyContent: 'center' },
                            dimensions.width
                          )}
                        >
                          <>
                            {isLoadingDone ? null : (
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
                                      color: palettes.App.White,
                                      fontFamily: 'Rasa_600SemiBold',
                                      fontSize: 16,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              >
                                {params?.noteId ?? defaultProps.noteId
                                  ? ''
                                  : 'Create'}
                              </Text>
                            )}
                          </>
                          <>
                            {!isLoadingDone ? null : (
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
                            )}
                          </>
                        </View>
                      </Pressable>
                    )}
                  </>
                </View>
              </View>

              <View
                style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
              >
                <>{!isLoadingNote ? null : <CommonLoadingBlock />}</>
                <>
                  {isLoadingDone ? null : (
                    <Utils.CustomCodeErrorBoundary>
                      <NoteEditor.Index
                        noteId={
                          props.route?.params?.noteId ?? defaultProps.noteId
                        }
                        content={content}
                        setContent={setContent}
                        title={title}
                        setTitle={setTitle}
                        type={props.route?.params?.type ?? defaultProps.type}
                      />
                    </Utils.CustomCodeErrorBoundary>
                  )}
                </>
              </View>
            </View>
          </LinearGradient>
        </DismissKeyboardView.Index>
      </Utils.CustomCodeErrorBoundary>
    </ScreenContainer>
  );
};

export default withTheme(NoteDetailScreen);
