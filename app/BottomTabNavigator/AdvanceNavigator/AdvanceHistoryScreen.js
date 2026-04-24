import React from 'react';
import {
  Icon,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
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
import { Fetch } from 'react-request';
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import AdvanceHistoryCardBlock from '../../../components/AdvanceHistoryCardBlock';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const AdvanceHistoryScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [historyList, setHistoryList] = React.useState([
    {
      id: 1,
      title: 'Week 1',
      ended_at: 1744361963432,
      started_at: 1743757163432,
      total_points: 200,
      completed_points: 120,
    },
    {
      id: 2,
      title: 'Week 2',
      ended_at: 1744966763432,
      started_at: 1744361963432,
      total_points: 200,
      completed_points: 150,
    },
    {
      id: 3,
      title: 'Week 3',
      ended_at: 1745571563432,
      started_at: 1744966763432,
      total_points: 200,
      completed_points: 100,
    },
    {
      id: 4,
      title: 'Week 4',
      ended_at: 1746176363432,
      started_at: 1745571563432,
      total_points: 200,
      completed_points: 180,
    },
    {
      id: 5,
      title: 'Week 5',
      ended_at: 1746781163432,
      started_at: 1746176363432,
      total_points: 200,
      completed_points: 95,
    },
  ]);
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
        { backgroundColor: palettes.App.Black },
        dimensions.width
      )}
    >
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
                  color: palettes.App.White,
                  fontFamily: 'Rasa_600SemiBold',
                  fontSize: 25,
                  paddingTop: 2,
                }
              ),
              dimensions.width
            )}
          >
            {'History'}
          </Text>
          {/* Blank View */}
          <View
            style={StyleSheet.applyWidth(
              { height: 20, width: 20 },
              dimensions.width
            )}
          />
        </View>

        <XanoBackendApi.FetchAdvanceProgramHistoryGET
          is_test_user={Constants['PROFILE_DETAILS']?.is_test_user}
        >
          {({ loading, error, data, refetchAdvanceProgramHistory }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
              <>
                {/* Content */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      flex: 1,
                      marginTop: 15,
                      paddingBottom: 100,
                      paddingLeft: 15,
                      paddingRight: 15,
                    },
                    dimensions.width
                  )}
                >
                  {/* History List */}
                  <>
                    {!(fetchData?.length > 0) ? null : (
                      <SimpleStyleFlatList
                        data={fetchData}
                        decelerationRate={'normal'}
                        horizontal={false}
                        inverted={false}
                        keyExtractor={(historyListData, index) =>
                          historyListData?.id ??
                          historyListData?.uuid ??
                          index?.toString() ??
                          JSON.stringify(historyListData)
                        }
                        keyboardShouldPersistTaps={'never'}
                        listKey={'Container->Fetch->Content->History List'}
                        nestedScrollEnabled={false}
                        numColumns={1}
                        onEndReachedThreshold={0.5}
                        pagingEnabled={false}
                        renderItem={({ item, index }) => {
                          const historyListData = item;
                          return (
                            <AdvanceHistoryCardBlock
                              onPress={() => {
                                try {
                                  navigation.navigate('BottomTabNavigator', {
                                    screen: 'AdvanceNavigator',
                                    params: {
                                      screen: 'AdvanceHistoryDaysScreen',
                                      params: {
                                        advance_program_id: historyListData?.id,
                                        week_title: historyListData?.name,
                                        advance_program: historyListData,
                                      },
                                    },
                                  });
                                } catch (err) {
                                  Sentry.captureException(err);
                                  console.error(err);
                                }
                              }}
                              item={historyListData}
                            />
                          );
                        }}
                        showsHorizontalScrollIndicator={true}
                        showsVerticalScrollIndicator={true}
                        snapToAlignment={'start'}
                        style={StyleSheet.applyWidth(
                          { flex: 1, gap: 10 },
                          dimensions.width
                        )}
                      />
                    )}
                  </>
                  {/* No Data */}
                  <>
                    {!(fetchData?.length === 0) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            height: '70%',
                            justifyContent: 'center',
                            marginTop: 20,
                          },
                          dimensions.width
                        )}
                      >
                        <Icon
                          color={palettes.Brand.White_Opacity}
                          name={'FontAwesome/folder-open'}
                          size={160}
                        />
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App.White,
                                fontFamily: 'Rasa_500Medium',
                                fontSize: 18,
                                textAlign: 'center',
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'No Advance Programs Yet'}
                        </Text>
                      </View>
                    )}
                  </>
                </View>
              </>
            );
          }}
        </XanoBackendApi.FetchAdvanceProgramHistoryGET>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(AdvanceHistoryScreen);
