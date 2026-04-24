import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ActivityIndicator, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import CommonLoadingBlock from '../../../components/CommonLoadingBlock';
import EmptyListStateBlock from '../../../components/EmptyListStateBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import formatDateTime from '../../../global-functions/formatDateTime';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const CheckInNotesScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const safeAreaInsets = useSafeAreaInsets();
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
      hasTopSafeArea={false}
    >
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          { flex: 1, paddingTop: safeAreaInsets.top },
          dimensions.width
        )}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              alignItems: 'center',
              borderBottomWidth: 1,
              borderColor: palettes.App.Outline,
              flexDirection: 'row',
              height: 48,
              justifyContent: 'space-between',
              paddingLeft: 15,
              paddingRight: 15,
            },
            dimensions.width
          )}
        >
          {/* Back  */}
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
          {/* Text 2 */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                {
                  color: [
                    {
                      minWidth: Breakpoints.Mobile,
                      value: palettes.App['Custom Color'],
                    },
                    {
                      minWidth: Breakpoints.Mobile,
                      value: Constants['APP_FONT_COLOR'],
                    },
                  ],
                  fontFamily: 'Rasa_500Medium',
                  fontSize: 20,
                }
              ),
              dimensions.width
            )}
          >
            {'Nightly Intentionality Check-In Notes'}
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

        <XanoBackendApi.FetchGetCheckinNotesGET>
          {({ loading, error, data, refetchGetCheckinNotes }) => {
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
                  listKey={'Container->Fetch->List'}
                  nestedScrollEnabled={false}
                  numColumns={1}
                  onEndReachedThreshold={0.5}
                  pagingEnabled={false}
                  renderItem={({ item, index }) => {
                    const listData = item;
                    return (
                      <Pressable
                        onPress={() => {
                          try {
                            navigation.navigate('CheckInNoteDetailScreen', {
                              check_in_note: listData,
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
                              borderBottomWidth: 1,
                              borderColor: palettes.App.Outline,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              paddingBottom: 20,
                              paddingLeft: 17,
                              paddingRight: 17,
                              paddingTop: 20,
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
                                  fontFamily: 'Rasa_400Regular',
                                  fontSize: 20,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {formatDateTime(
                              listData?.created_at,
                              'MMMM Do YYYY, h:mm'
                            )}
                          </Text>
                          <Icon
                            color={palettes.App['Custom Color']}
                            name={'Feather/chevron-right'}
                            size={22}
                            style={StyleSheet.applyWidth(
                              { opacity: 0.7 },
                              dimensions.width
                            )}
                          />
                        </View>
                      </Pressable>
                    );
                  }}
                  showsHorizontalScrollIndicator={true}
                  showsVerticalScrollIndicator={true}
                  snapToAlignment={'start'}
                />
                <>
                  {!(fetchData?.length === 0) ? null : <EmptyListStateBlock />}
                </>
              </>
            );
          }}
        </XanoBackendApi.FetchGetCheckinNotesGET>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(CheckInNotesScreen);
