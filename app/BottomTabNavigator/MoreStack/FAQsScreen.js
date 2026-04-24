import React from 'react';
import {
  AccordionGroup,
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
import * as GlobalStyles from '../../../GlobalStyles.js';
import * as XanoBackendApi from '../../../apis/XanoBackendApi.js';
import * as GlobalVariables from '../../../config/GlobalVariableContext';
import Images from '../../../config/Images';
import palettes from '../../../themes/palettes';
import Breakpoints from '../../../utils/Breakpoints';
import * as StyleSheet from '../../../utils/StyleSheet';
import imageSource from '../../../utils/imageSource';
import useIsFocused from '../../../utils/useIsFocused';
import useNavigation from '../../../utils/useNavigation';
import useParams from '../../../utils/useParams';
import useWindowDimensions from '../../../utils/useWindowDimensions';

const FAQsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [password, setPassword] = React.useState('');
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
        { backgroundColor: theme.colors.background.brand },
        dimensions.width
      )}
    >
      <ImageBackground
        resizeMode={'cover'}
        {...GlobalStyles.ImageBackgroundStyles(theme)['Screen BG Image'].props}
        source={imageSource(Images['BG'])}
        style={StyleSheet.applyWidth(
          GlobalStyles.ImageBackgroundStyles(theme)['Screen BG Image'].style,
          dimensions.width
        )}
      />
      {/* Container */}
      <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
        {/* iOS Safe Area */}
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
            style={StyleSheet.applyWidth({ width: 30 }, dimensions.width)}
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
                  textAlign: 'center',
                }
              ),
              dimensions.width
            )}
          >
            {'FAQs'}
          </Text>
          {/* copy link */}
          <Pressable
            activeOpacity={0.3}
            style={StyleSheet.applyWidth({ width: 30 }, dimensions.width)}
          >
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 48,
                  justifyContent: 'center',
                  width: 48,
                },
                dimensions.width
              )}
            ></View>
          </Pressable>
        </View>

        <XanoBackendApi.FetchFAQsGET>
          {({ loading, error, data, refetchFAQs }) => {
            const fetchData = data?.json;
            if (loading) {
              return <ActivityIndicator />;
            }

            if (error || data?.status < 200 || data?.status >= 300) {
              return <ActivityIndicator />;
            }

            return (
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
                    <AccordionGroup
                      caretSize={24}
                      iconSize={24}
                      {...GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                        .props}
                      caretColor={palettes.App['Custom Color']}
                      closedColor={palettes.App['Custom Color']}
                      icon={'EvilIcons/question'}
                      label={listData?.title}
                      openColor={palettes.App['Custom Color']}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.AccordionGroupStyles(theme)['Accordion']
                            .style,
                          {
                            backgroundColor: palettes.App.Avi,
                            fontFamily: 'Rasa_500Medium',
                            fontSize: 20,
                            marginTop: 5,
                            minHeight: 45,
                            paddingLeft: 12,
                            paddingRight: 12,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'stretch',
                            backgroundColor: palettes.App['Custom Color'],
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 12,
                          },
                          dimensions.width
                        )}
                      >
                        {/* details */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: theme.colors.text.strong,
                                fontFamily: 'Rasa_400Regular',
                                fontSize: 16,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {listData?.description}
                        </Text>
                      </View>
                    </AccordionGroup>
                  );
                }}
                showsVerticalScrollIndicator={true}
                snapToAlignment={'start'}
                showsHorizontalScrollIndicator={false}
                style={StyleSheet.applyWidth(
                  { marginTop: -5, paddingBottom: 100 },
                  dimensions.width
                )}
              />
            );
          }}
        </XanoBackendApi.FetchFAQsGET>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(FAQsScreen);
