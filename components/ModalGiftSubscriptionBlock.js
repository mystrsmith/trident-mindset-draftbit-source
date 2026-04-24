import React from 'react';
import { Button, IconButton, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import * as Linking from 'expo-linking';
import * as Sharing from 'expo-sharing';
import { ImageBackground, Modal, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import GuestShareImageCardBlock from '../components/GuestShareImageCardBlock';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import openShareUtil from '../utils/openShare';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { onClose: () => {}, visible: true };

const ModalGiftSubscriptionBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const onPressShareMyStreaks = async () => {
    if (viewShotRef && viewShotRef?.current) {
      setLoadingCapture(true);
      const uri = await viewShotRef?.current?.capture();
      console.log('do something with ', uri);
      Sharing.shareAsync(`file://${uri}`);
      setLoadingCapture(false);
    }
  };
  const viewShotRef = React.useRef();
  const xanoBackendGiveGuestPassPOST = XanoBackendApi.useGiveGuestPassPOST();

  return (
    <Modal
      supportedOrientations={['portrait', 'landscape']}
      animationType={'slide'}
      transparent={false}
      visible={Boolean(props.visible ?? defaultProps.visible)}
    >
      <View
        style={StyleSheet.applyWidth(
          { flex: 1, paddingTop: safeAreaInsets.top },
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
        {/* Header */}
        <View style={StyleSheet.applyWidth({ padding: 15 }, dimensions.width)}>
          <IconButton
            onPress={() => {
              try {
                props.onClose?.();
                /* 'If/Else' action requires configuration: select If Condition */
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            color={palettes.Brand.Surface}
            icon={'Ionicons/close'}
            size={35}
          />
        </View>
        {/* Content */}
        <View
          style={StyleSheet.applyWidth(
            { flex: 1, paddingLeft: 20, paddingRight: 20, paddingTop: 15 },
            dimensions.width
          )}
        >
          <View
            style={StyleSheet.applyWidth(
              { flex: 1, justifyContent: 'space-between' },
              dimensions.width
            )}
          >
            <View style={StyleSheet.applyWidth({ gap: 20 }, dimensions.width)}>
              {/* Header */}
              <View
                style={StyleSheet.applyWidth(
                  { alignItems: 'center', justifyContent: 'center' },
                  dimensions.width
                )}
              >
                {/* Top */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      borderRadius: 15,
                      gap: 10,
                      justifyContent: 'center',
                      width: '80%',
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
                          fontSize: 26,
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Share Trident Mindset'}
                  </Text>
                  {/* Text 2 */}
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
                          textAlign: 'center',
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'As a member, you can give a free month to anyone'}
                  </Text>
                </View>
              </View>
              <GuestShareImageCardBlock />
              {/* Center */}
              <View>
                {/* Description */}
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
                        marginTop: 20,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {
                    'Every guest pass includes 30 days of full access - no credit card required.'
                  }
                </Text>
              </View>
            </View>
            {/* Bottom */}
            <View
              style={StyleSheet.applyWidth(
                { alignItems: 'center', paddingBottom: 50 },
                dimensions.width
              )}
            >
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  const handler = async () => {
                    try {
                      if (!Constants['GUEST_PASS_URL']) {
                        const resultGuestPassCodeLink = (
                          await XanoBackendApi.guestPassCodeLinkGET(Constants)
                        )?.json;
                        if (
                          resultGuestPassCodeLink?.status ===
                          Constants['SUCCESS_API_RESPONSE']
                        ) {
                          await setGlobalVariableValue({
                            key: 'GUEST_PASS_URL',
                            value: resultGuestPassCodeLink?.url,
                          });
                          Linking.openURL(`${resultGuestPassCodeLink?.url}`);
                        } else {
                        }
                      } else {
                        await openShareUtil(`${Constants['GUEST_PASS_URL']}`);
                      }

                      const resultGiveGuestPass = (
                        await xanoBackendGiveGuestPassPOST.mutateAsync()
                      )?.json;
                      console.log(resultGiveGuestPass);
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
                      width: '60%',
                    }
                  ),
                  dimensions.width
                )}
                title={'Give Guest Pass'}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default withTheme(ModalGiftSubscriptionBlock);
