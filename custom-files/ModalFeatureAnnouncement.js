import React from 'react';
import { Pressable } from 'react-native';
import {
  Button,
  IconButton,
  LinearGradient,
  Swiper,
  SwiperItem,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import * as ExpoImage from '../custom-files/ExpoImage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useWindowDimensions from '../utils/useWindowDimensions';

const ModalFeatureAnnouncement = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const Variables = Constants;
  const [reachedEnd, setReachedEnd] = React.useState(false);
  const safeAreaInsets = useSafeAreaInsets();
  const xanoBackendCloseFeatureAnnouncementPOST =
    XanoBackendApi.useCloseFeatureAnnouncementPOST();
  const xanoBackendReadFeatureAnnouncementPOST =
    XanoBackendApi.useReadFeatureAnnouncementPOST();
  const swiperDthLQhyzRef = React.useRef();

  const featureAnnoucement = Constants['feature_announcement'];
  React.useEffect(() => {
    // If only have 1 item, which mean it's reached end
    if (featureAnnoucement && featureAnnoucement?.pages?.length === 1) {
      setReachedEnd(true);
    }
  }, [featureAnnoucement]);

  if (Variables['feature_announcement'] === null) {
    return null;
  }

  async function lastLeftOff() {
    const resultLastLeftOff = (
      await XanoBackendApi.checkLastLeftOffGET(Constants)
    )?.json;
    setGlobalVariableValue({
      key: 'LAST_LEFTOFF_LESSON',
      value: resultLastLeftOff,
    });
    if (
      resultLastLeftOff?.last_lesson != null &&
      resultLastLeftOff?.next_lesson != null
    ) {
      // setVisibleModalPickUpLeftOff(true);
      setGlobalVariableValue({
        key: 'SHOW_LEFTOFF_MODAL',
        value: true,
      });
    }
  }
  return (
    <View
      style={StyleSheet.applyWidth(
        { height: '100%', position: 'absolute', width: '100%' },
        dimensions.width
      )}
    >
      <View
        style={StyleSheet.applyWidth(
          {
            backgroundColor: palettes.App.Black,
            flex: 1,
            height: '100%',
            paddingBottom: safeAreaInsets.bottom,
            paddingTop: safeAreaInsets.top,
            width: '100%',
          },
          dimensions.width
        )}
      >
        <LinearGradient
          startX={0}
          {...GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].props}
          color1={palettes.App.Black_Alpha_80}
          color2={palettes.App['Background 90 Opacity']}
          color3={palettes.App.Black_Alpha_80}
          endX={0}
          endY={90}
          startY={0}
          style={StyleSheet.applyWidth(
            GlobalStyles.LinearGradientStyles(theme)['Linear Gradient'].style,
            dimensions.width
          )}
        >
          {/* Header */}
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'flex-end',
                paddingBottom: 5,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
              },
              dimensions.width
            )}
          >
            <IconButton
              onPress={() => {
                const handler = async () => {
                  try {
                    if (Constants['INITIALIZE_HOMESCREEN'] === true) {
                      lastLeftOff();
                    }

                    (
                      await xanoBackendCloseFeatureAnnouncementPOST.mutateAsync(
                        {
                          feature_announcement_id:
                            Constants['feature_announcement']?.id,
                        }
                      )
                    )?.json;
                    setGlobalVariableValue({
                      key: 'feature_announcement',
                      value: null,
                    });
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
              color={palettes.App.White}
              icon={'MaterialIcons/close'}
              size={32}
            />
          </View>
          <Swiper
            data={Constants['feature_announcement']?.pages}
            hideDots={false}
            keyExtractor={(swiperData, index) =>
              swiperData?.id ??
              swiperData?.uuid ??
              index?.toString() ??
              JSON.stringify(swiperData)
            }
            listKey={'DthLQhyz'}
            loop={false}
            minDistanceForAction={0.2}
            minDistanceToCapture={5}
            onIndexChanged={newIndex => {
              try {
                if (
                  newIndex ===
                  Constants['feature_announcement']?.pages?.length - 1
                ) {
                  setReachedEnd(true);
                } else {
                  setReachedEnd(false);
                }
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            renderItem={({ item, index }) => {
              const swiperData = item;
              return (
                <SwiperItem>
                  {/* Centerize */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        flex: 1,
                        justifyContent: 'center',
                      },
                      dimensions.width
                    )}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flex: 0.7,
                          justifyContent: 'center',
                          width: '70%',
                        },
                        dimensions.width
                      )}
                    >
                      <Utils.CustomCodeErrorBoundary>
                        <ExpoImage.Index
                          source={{
                            uri: swiperData?.image?.url,
                          }}
                          contentFit="contain"
                          transition={1000}
                        />
                      </Utils.CustomCodeErrorBoundary>
                    </View>
                    {/* View 2 */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          alignSelf: 'center',
                          flex: 0.4,
                          gap: 20,
                          justifyContent: 'center',
                          paddingBottom: 40,
                          paddingLeft: 30,
                          paddingRight: 30,
                          paddingTop: 20,
                        },
                        dimensions.width
                      )}
                    >
                      {/* Title */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.App.White,
                              fontFamily: 'Rasa_700Bold',
                              fontSize: 36,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {swiperData?.title}
                      </Text>
                      {/* Decription */}
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
                              opacity: 0.8,
                              textAlign: 'center',
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {swiperData?.description}
                      </Text>
                    </View>
                  </View>
                </SwiperItem>
              );
            }}
            timeout={0}
            vertical={false}
            {...GlobalStyles.SwiperStyles(theme)['Swiper'].props}
            dotActiveColor={palettes.App.White}
            dotColor={palettes.App.Outline}
            dotsTouchable={true}
            ref={swiperDthLQhyzRef}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.SwiperStyles(theme)['Swiper'].style,
                { flex: 1, paddingBottom: 20, paddingTop: 20 }
              ),
              dimensions.width
            )}
          />
          {/* Footer */}
          <View
            style={StyleSheet.applyWidth({ padding: 15 }, dimensions.width)}
          >
            <Pressable
              onPress={() => {
                const handler = async () => {
                  try {
                    if (reachedEnd === true) {
                      if (Constants['INITIALIZE_HOMESCREEN'] === true) {
                        lastLeftOff();
                      }

                      (
                        await xanoBackendReadFeatureAnnouncementPOST.mutateAsync(
                          {
                            feature_announcement_id:
                              Constants['feature_announcement']?.id,
                          }
                        )
                      )?.json;
                      setGlobalVariableValue({
                        key: 'feature_announcement',
                        value: null,
                      });
                    } else {
                      swiperDthLQhyzRef.current?.swipeNext();
                    }
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                };
                handler();
              }}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'center',
                    backgroundColor: palettes.App['App Buttons Color'],
                    justifyContent: 'center',
                    width: '60%',
                    alignSelf: 'center',
                    borderRadius: 24,
                    paddingBottom: 12,
                    paddingLeft: 24,
                    paddingRight: 24,
                    paddingTop: 12,
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
                        color: palettes.App.White,
                        fontFamily: 'Rasa_500Medium',
                        fontSize: 22,
                        paddingTop: 2,
                        textAlign: 'center',
                      }
                    ),
                    dimensions.width
                  )}
                >
                  {reachedEnd === true ? 'Continue' : 'Next'}
                </Text>
              </View>
            </Pressable>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default withTheme(ModalFeatureAnnouncement);
