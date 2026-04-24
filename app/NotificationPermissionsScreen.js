import React from 'react';
import { Button, ScreenContainer, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, ImageBackground, StatusBar, Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import getPushTokenUtil from '../utils/getPushToken';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const NotificationPermissionsScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
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
              opacity: 0.5,
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
            flex: 1,
            justifyContent: 'space-between',
            marginBottom: 20,
            padding: 20,
          },
          dimensions.width
        )}
      >
        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <Image
            resizeMode={'cover'}
            source={imageSource(Images['PermissionsNotification'])}
            style={StyleSheet.applyWidth(
              { height: 128, width: 128 },
              dimensions.width
            )}
          />
          <Text
            accessible={true}
            selectable={false}
            style={StyleSheet.applyWidth(
              {
                color: Constants['APP_FONT_COLOR'],
                fontFamily: 'Inter_600SemiBold',
                fontSize: 24,
                lineHeight: 45,
                textAlign: 'center',
              },
              dimensions.width
            )}
          >
            {'Enable Notifications'}
          </Text>

          <Text
            accessible={true}
            selectable={false}
            style={StyleSheet.applyWidth(
              {
                color: Constants['APP_FONT_COLOR'],
                fontFamily: 'Inter_300Light',
                fontSize: 16,
                lineHeight: 27,
                opacity: 0.8,
                padding: 15,
                textAlign: 'center',
              },
              dimensions.width
            )}
          >
            {
              'Enable notifications to receive important updates, personalized recommendations, and invitations to live events.'
            }
          </Text>
        </View>

        <View
          style={StyleSheet.applyWidth(
            { justifyContent: 'space-evenly' },
            dimensions.width
          )}
        >
          {/* Skip */}
          <Button
            accessible={true}
            iconPosition={'left'}
            activeOpacity={0.3}
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0)',
                borderRadius: 64,
                color: Constants['APP_FONT_COLOR'],
                flexDirection: 'row',
                fontFamily: 'Inter_600SemiBold',
                fontSize: 16,
                justifyContent: 'center',
                marginTop: 16,
                textAlign: 'center',
              },
              dimensions.width
            )}
            title={'SKIP'}
          >
            {'Sign Up'}
          </Button>
          {/* Enable Notifications */}
          <Button
            accessible={true}
            iconPosition={'left'}
            onPress={() => {
              const handler = async () => {
                try {
                  const pushToken = await getPushTokenUtil({
                    permissionErrorMessage:
                      'Sorry, we need notifications permissions to make this work.',
                    deviceErrorMessage:
                      'Must use physical device for Push Notifications.',
                    showAlertOnPermissionError: true,
                    showAlertOnDeviceError: true,
                  });

                  const api_Response = (
                    await XanoBackendApi.updatePushTokenPOST(Constants, {
                      push_token: pushToken,
                    })
                  )?.json;
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              };
              handler();
            }}
            {...GlobalStyles.ButtonStyles(theme)['Action Button'].props}
            activeOpacity={0.3}
            icon={'MaterialIcons/notifications-active'}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ButtonStyles(theme)['Action Button'].style,
                {
                  alignItems: 'center',
                  backgroundColor: palettes.App['App Buttons Color'],
                  flexDirection: 'row',
                  fontFamily: 'Poppins_500Medium',
                  justifyContent: 'center',
                  marginTop: 16,
                  textTransform: 'capitalize',
                }
              ),
              dimensions.width
            )}
            title={' ENABLE NOTIFICATIONS'}
          >
            {'Sign Up'}
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
};

export default withTheme(NotificationPermissionsScreen);
