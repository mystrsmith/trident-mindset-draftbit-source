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
import { ActivityIndicator, Image, Platform, Text, View } from 'react-native';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonHeaderBlock from '../../../components/CommonHeaderBlock';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import EmptyListStateBlock from '../../../components/EmptyListStateBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const LessonNotesTacticsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [myDetails, setMyDetails] = React.useState({});
  const [notificationSetting, setNotificationSetting] = React.useState(true);
  const [password, setPassword] = React.useState('');
  const [showLogOutModal, setShowLogOutModal] = React.useState(false);
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
          <CommonHeaderBlock title={'Tactics'} />
          <XanoBackendApi.FetchGetTacticsGET favorited={false} noted={true}>
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
                        <>
                          {/* Tactic Item */}
                          <Pressable
                            onPress={() => {
                              try {
                                navigation.navigate('BottomTabNavigator', {
                                  screen: 'MoreStack',
                                  params: {
                                    screen: 'LessonNotesLessonsScreen',
                                    params: { tactic: listData },
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
                              {...GlobalStyles.ViewStyles(theme)['Menu View']
                                .props}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.ViewStyles(theme)['Menu View']
                                    .style,
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
                              <Image
                                {...GlobalStyles.ImageStyles(theme)['Image']
                                  .props}
                                resizeMode={'cover'}
                                source={imageSource(`${listData?.photo?.url}`)}
                                style={StyleSheet.applyWidth(
                                  StyleSheet.compose(
                                    GlobalStyles.ImageStyles(theme)['Image']
                                      .style,
                                    {
                                      borderColor: palettes.App.Outline,
                                      borderRadius: 12,
                                      borderWidth: 1,
                                      height: 80,
                                      width: 80,
                                    }
                                  ),
                                  dimensions.width
                                )}
                              />
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
                                {/* Notes count */}
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
                                        color:
                                          palettes.App.Studily_Purple_Light,
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
                                  {listData?.lessons?.length}{' '}
                                  {listData?.lessons?.length > 1
                                    ? 'notes'
                                    : 'note'}
                                </Text>
                              </View>
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
                        </>
                      );
                    }}
                    showsHorizontalScrollIndicator={true}
                    showsVerticalScrollIndicator={true}
                    snapToAlignment={'start'}
                  />
                  <>
                    {!(fetchData?.length === 0) ? null : (
                      <EmptyListStateBlock />
                    )}
                  </>
                </>
              );
            }}
          </XanoBackendApi.FetchGetTacticsGET>
        </View>
      </LinearGradient>
    </ScreenContainer>
  );
};

export default withTheme(LessonNotesTacticsScreen);
