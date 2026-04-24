import React from 'react';
import { ExpoImage, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import isSubscribed from '../global-functions/isSubscribed';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = { item: {} };

const MoreItemCardBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation(props.navigation);
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;

  return (
    <View
      style={StyleSheet.applyWidth({ flexDirection: 'row' }, dimensions.width)}
    >
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            marginBottom: 15,
            width: dimensions.width / 2,
          },
          dimensions.width
        )}
      >
        <Pressable
          onPress={() => {
            try {
              if ((props.item ?? defaultProps.item)?.tactic_id === null) {
                if ((props.item ?? defaultProps.item)?.type === 'NOTEBOOK') {
                  navigation.navigate('MoreStack', {});
                } else {
                }

                if ((props.item ?? defaultProps.item)?.type === 'PROFILE') {
                  navigation.navigate('BottomTabNavigator', {
                    screen: 'MoreStack',
                    params: { screen: 'ProfileScreen' },
                  });
                } else {
                }

                if (
                  (props.item ?? defaultProps.item)?.type === 'MEDITATION_TIMER'
                ) {
                  navigation.navigate('MoreStack', {});
                } else {
                }
              } else {
                navigation.navigate('RootNavigator', {});
              }
            } catch (err) {
              Sentry.captureException(err);
              console.error(err);
            }
          }}
          disabledOpacity={1}
        >
          <View
            style={StyleSheet.applyWidth(
              { borderRadius: 20 },
              dimensions.width
            )}
          >
            {/* Image Wrapper */}
            <View>
              <ExpoImage
                allowDownscaling={true}
                cachePolicy={'disk'}
                contentPosition={'center'}
                transitionDuration={300}
                transitionEffect={'cross-dissolve'}
                transitionTiming={'ease-in-out'}
                {...GlobalStyles.ExpoImageStyles(theme)['Image 19'].props}
                resizeMode={'contain'}
                source={imageSource(
                  'https://storage.googleapis.com/xfbv-qcqq-txoe.n7c.xano.io/vault/XKQzl2Np/EKygt6GtwRnP_5mokmP1TvqiTdo/Rd8sPQ../Principles_photo.png'
                )}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ExpoImageStyles(theme)['Image 19'].style,
                    {
                      borderColor: 'rgba(0, 0, 0, 0.25)',
                      borderRadius: 20,
                      borderWidth: 1,
                      height: 165,
                      opacity: [
                        { minWidth: Breakpoints.Mobile, value: 1 },
                        {
                          minWidth: Breakpoints.Mobile,
                          value:
                            (props.item ?? defaultProps.item)?.is_paid_only ===
                              true && isSubscribed(Variables) === false
                              ? 0.5
                              : 1,
                        },
                      ],
                      width: 165,
                    }
                  ),
                  dimensions.width
                )}
              />
            </View>
            {/* Title Wrapper */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: dimensions.width / 2.5,
                },
                dimensions.width
              )}
            >
              {/* Title */}
              <Text
                accessible={true}
                selectable={false}
                {...GlobalStyles.TextStyles(theme)['Text'].props}
                numberOfLines={2}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.TextStyles(theme)['Text'].style,
                    {
                      color: palettes.App.White,
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 17,
                      marginTop: 10,
                      textAlign: 'center',
                    }
                  ),
                  dimensions.width
                )}
                contentContainerStyle={StyleSheet.applyWidth(
                  GlobalStyles.TextStyles(theme)['Text'].style,
                  dimensions.width
                )}
              >
                {(props.item ?? defaultProps.item)?.title}
              </Text>
            </View>
          </View>
          {/* Coming Soon View */}
          <>
            {!(props.item ?? defaultProps.item)?.coming_soon ? null : (
              <View
                style={[
                  StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      alignSelf: 'center',
                      backgroundColor: theme.colors.background.danger,
                      borderRadius: 6,
                      paddingBottom: 2,
                      paddingTop: 2,
                      position: 'absolute',
                      top: 65,
                      width: 170,
                    },
                    dimensions.width
                  ),
                  { transform: [{ rotate: '-35deg' }] },
                ]}
              >
                {/* Coming Soon Text */}
                <Text
                  accessible={true}
                  selectable={false}
                  {...GlobalStyles.TextStyles(theme)['Text'].props}
                  style={StyleSheet.applyWidth(
                    StyleSheet.compose(
                      GlobalStyles.TextStyles(theme)['Text'].style,
                      {
                        color: palettes.App.White,
                        fontFamily: 'Rasa_400Regular',
                        fontSize: 20,
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {'Coming Soon'}
                </Text>
              </View>
            )}
          </>
        </Pressable>
      </View>
    </View>
  );
};

export default withTheme(MoreItemCardBlock);
