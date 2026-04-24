import React from 'react';
import { Button, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { ImageBackground, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import GuestShareImageCardBlock from '../components/GuestShareImageCardBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import formatDateTime from '../global-functions/formatDateTime';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { guest_pass: null };

const GuestPassAppliedInformationScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const params = useParams();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
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
    <ScreenContainer hasSafeArea={false} scrollable={false}>
      <View
        style={StyleSheet.applyWidth(
          {
            flex: 1,
            justifyContent: 'flex-end',
            paddingTop: safeAreaInsets.top,
          },
          dimensions.width
        )}
      >
        <ImageBackground
          resizeMode={'cover'}
          {...GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
            .props}
          source={imageSource(Images['OceanFinisherStory'])}
          style={StyleSheet.applyWidth(
            StyleSheet.compose(
              GlobalStyles.ImageBackgroundStyles(theme)['Image Background']
                .style,
              {
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                bottom: 0,
                left: 0,
                opacity: 1,
                position: 'absolute',
                right: 0,
                top: 0,
              }
            ),
            dimensions.width
          )}
        />
        <View
          style={StyleSheet.applyWidth(
            {
              height: '100%',
              justifyContent: 'space-between',
              paddingLeft: 20,
              paddingRight: 20,
            },
            dimensions.width
          )}
        >
          <View style={StyleSheet.applyWidth({ gap: 20 }, dimensions.width)}>
            {/* Header */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  gap: 6,
                  justifyContent: 'center',
                  marginTop: 50,
                },
                dimensions.width
              )}
            >
              {/* Welcome */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Screen_Title'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Screen_Title'].style,
                    {
                      color: Constants['APP_FONT_COLOR'],
                      fontFamily: 'Rasa_500Medium',
                      fontSize: 30,
                      textAlign: 'left',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Welcome!'}
              </Text>

              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.App.Studily_Snow_White,
                      fontFamily: 'Rasa_300Light',
                      fontSize: 18,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
              >
                {'Your 30-day guest pass starts now'}
              </Text>
            </View>
            <GuestShareImageCardBlock />
            {/* Bullets */}
            <View
              style={StyleSheet.applyWidth(
                { gap: 8, paddingLeft: 5 },
                dimensions.width
              )}
            >
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', flexDirection: 'row', gap: 15 },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.Brand.Surface,
                      borderRadius: 100,
                      height: 5,
                      width: 5,
                    },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_300Light',
                        fontSize: 18,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Completely free for 30 days'}
                </Text>
              </View>
              {/* View 3 */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', flexDirection: 'row', gap: 15 },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.Brand.Surface,
                      borderRadius: 100,
                      height: 5,
                      width: 5,
                    },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_300Light',
                        fontSize: 18,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Enjoy unlimited access for the next 30 days'}
                </Text>
              </View>
              {/* View 2 */}
              <View
                style={StyleSheet.applyWidth(
                  { flexDirection: 'row', gap: 15 },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: palettes.Brand.Surface,
                      borderRadius: 100,
                      height: 5,
                      marginTop: 8,
                      width: 5,
                    },
                    dimensions.width
                  )}
                />
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.Brand.Surface,
                        fontFamily: 'Rasa_300Light',
                        fontSize: 18,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'No need to cancel. You will not be charged unless you choose to purchase a subscription'
                  }
                </Text>
              </View>
            </View>
          </View>
          {/* Duration Message */}
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand.Surface,
                fontFamily: 'Rasa_600SemiBold',
                fontSize: 20,
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {'Your guest pass ends '}
            {formatDateTime(
              (params?.guest_pass ?? defaultProps.guest_pass)?.expiration_at,
              'dddd MM/DD [at] hh:mmA'
            )}
          </Text>
          {/* Bottom */}
          <View
            style={StyleSheet.applyWidth(
              { paddingBottom: 50 },
              dimensions.width
            )}
          >
            <Button
              accessible={true}
              iconPosition={'left'}
              onPress={() => {
                const handler = async () => {
                  try {
                    if (navigation.canGoBack()) {
                      navigation.popToTop();
                    }
                    navigation.replace('', {});
                    const authMe = (await XanoBackendApi.authMeGET(Constants))
                      ?.json;
                    await setGlobalVariableValue({
                      key: 'PROFILE_DETAILS',
                      value: authMe,
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
              {...GlobalStyles.ButtonStyles(theme)['Button'].props}
              style={StyleSheet.applyWidth(
                StyleSheet.compose(
                  GlobalStyles.ButtonStyles(theme)['Button'].style,
                  {
                    backgroundColor: palettes.App['App Buttons Color'],
                    fontFamily: 'Rasa_700Bold',
                    fontSize: 16,
                    height: 50,
                    marginLeft: 10,
                    marginRight: 10,
                  }
                ),
                dimensions.width
              )}
              title={'Onward'}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(GuestPassAppliedInformationScreen);
