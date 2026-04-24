import React from 'react';
import {
  Button,
  Divider,
  Icon,
  IconButton,
  LoadingIndicator,
  Pressable,
  ScreenContainer,
  SimpleStyleFlatList,
  Switch,
  withTheme,
} from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Image, Modal, Platform, StatusBar, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as GlobalStyles from '../GlobalStyles.js';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import Images from '../config/Images';
import * as CommonPackages from '../custom-files/CommonPackages';
import * as CustomCode from '../custom-files/CustomCode';
import * as CustomPopover from '../custom-files/CustomPopover';
import * as CustomWheelPicker from '../custom-files/CustomWheelPicker';
import Player_LoadAndPlayMeditation from '../global-functions/Player_LoadAndPlayMeditation';
import getRevCatCustomerInfo from '../global-functions/getRevCatCustomerInfo';
import isSubscribed from '../global-functions/isSubscribed';
import showToastMessage from '../global-functions/showToastMessage';
import palettes from '../themes/palettes';
import * as Utils from '../utils';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import imageSource from '../utils/imageSource';
import useIsFocused from '../utils/useIsFocused';
import useNavigation from '../utils/useNavigation';
import useParams from '../utils/useParams';
import useWindowDimensions from '../utils/useWindowDimensions';

const DesignYourMeditationScreen = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const navigation = useNavigation();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const setGlobalVariableValue = GlobalVariables.useSetValue();
  const safeAreaInsets = useSafeAreaInsets();
  const [backgroundSounds, setBackgroundSounds] = React.useState([]);
  const [enabledSwtich, setEnabledSwtich] = React.useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = React.useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = React.useState(false);
  const [isMeditationSettingExist, setIsMeditationSettingExist] =
    React.useState(false);
  const [meditationTimerSettings, setMeditationTimerSettings] = React.useState(
    []
  );
  const [selectedBackgroundSound, setSelectedBackgroundSound] =
    React.useState(null);
  const [selectedIntervalBell, setSelectedIntervalBell] = React.useState(null);
  const [selectedMinutes, setSelectedMinutes] = React.useState(5);
  const [tactic, setTactic] = React.useState('');
  const [visibleModalBackgroundSound, setVisibleModalBackgroundSound] =
    React.useState(false);
  const [visibleModalIntervalBell, setVisibleModalIntervalBell] =
    React.useState(false);
  const initMeditationSetting = meditationSettings => {
    if (!meditationSettings) {
      setEnabledSwtich(false);
      return;
    }
    const minutesDuration = meditationSettings?.minutes_duration;
    const backgroundSound = meditationSettings?.background_sound;
    const intervalBell = meditationSettings?.interval_bell;
    setSelectedMinutes(minutesDuration);
    setSelectedBackgroundSound(backgroundSound);
    setSelectedIntervalBell(intervalBell);
    setEnabledSwtich(true);
  };

  const onPressAnimateLesson = async () => {
    const PlayerAnimationValues = CommonPackages?.PlayerAnimationValues;
    PlayerAnimationValues.goDownRead.value = true;
    PlayerAnimationValues.goUpAudio.value = true;
  };

  const toggleSwitchMeditationSetting = (newSwitchValue, listData) => {
    setSelectedMinutes(listData?.minutes_duration);
    setSelectedBackgroundSound(listData?.background_sound);
    setSelectedIntervalBell(listData?.interval_bell);
    setMeditationTimerSettings(
      meditationTimerSettings.map(item =>
        item?.id === listData?.id
          ? {
              ...item,
              enabled: newSwitchValue,
            }
          : {
              ...item,
              enabled: false,
            }
      )
    );
  };
  // const isEmpty = (data) => {
  //   return data === null || data === undefined || data === '';
  // };

  // const isExist = meditationTimerSettings?.length > 0 && meditationTimerSettings.find(
  //   item =>
  //     item?.minutes_duration === selectedMinutes &&
  //     isEmpty(item?.background_sound?.id) === isEmpty(selectedBackgroundSound?.id) &&
  //     isEmpty(item?.interval_bell?.value) === isEmpty(selectedIntervalBell?.value)
  // );

  // React.useEffect(() => {
  //   setIsMeditationSettingExist(isExist)
  // }, [isExist])
  const xanoBackendCreateMeditationTimerSettingPOST =
    XanoBackendApi.useCreateMeditationTimerSettingPOST();
  const xanoBackendDeleteMeditationTimerSettingDELETE =
    XanoBackendApi.useDeleteMeditationTimerSettingDELETE();
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const handler = async () => {
      try {
        if (!isFocused) {
          return;
        }
        setIsLoadingScreen(true);
        const resultMeditationTactic = (
          await XanoBackendApi.getMeditationTacticGET(Constants)
        )?.json;
        setTactic(resultMeditationTactic);
        const resultBackgroundSounds = (
          await XanoBackendApi.getBackgroundSoundsGET(Constants)
        )?.json;
        setBackgroundSounds(resultBackgroundSounds);
        setSelectedBackgroundSound(
          resultBackgroundSounds && resultBackgroundSounds[0]
        );
        const resultSettings = (
          await XanoBackendApi.getMeditationTimerSettingsGET(Constants)
        )?.json;
        setIsLoadingScreen(false);
        if (resultSettings) {
          setMeditationTimerSettings(resultSettings);
          initMeditationSetting(resultSettings);
        } else {
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
    <ScreenContainer
      scrollable={false}
      hasLeftSafeArea={false}
      hasRightSafeArea={false}
      hasSafeArea={false}
      style={StyleSheet.applyWidth(
        { backgroundColor: palettes.App['Resolution Blue'], flex: 1 },
        dimensions.width
      )}
    >
      <Image
        resizeMode={'cover'}
        {...GlobalStyles.ImageStyles(theme)['Image'].props}
        source={imageSource(Images['OceanFinisherStory'])}
        style={StyleSheet.applyWidth(
          StyleSheet.compose(GlobalStyles.ImageStyles(theme)['Image'].style, {
            height: '100%',
            position: 'absolute',
            width: '100%',
          }),
          dimensions.width
        )}
      />
      {/* Header */}
      <View
        style={StyleSheet.applyWidth(
          {
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: safeAreaInsets.top,
          },
          dimensions.width
        )}
      >
        {/* Left */}
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
        >
          <IconButton
            onPress={() => {
              try {
                navigation.goBack();
              } catch (err) {
                Sentry.captureException(err);
                console.error(err);
              }
            }}
            size={32}
            color={palettes.Brand.Surface}
            icon={'Ionicons/arrow-back-outline'}
          />
        </View>

        <View
          style={StyleSheet.applyWidth(
            { alignItems: 'center', flex: 1, justifyContent: 'center' },
            dimensions.width
          )}
        >
          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.Brand.Surface,
                fontFamily: 'Rasa_700Bold',
                fontSize: 24,
                paddingTop: 2,
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {'Design Your Meditation'}
          </Text>
        </View>
        {/* Right */}
        <View
          style={StyleSheet.applyWidth(
            { height: 40, width: 40 },
            dimensions.width
          )}
        />
      </View>
      <>
        {!isLoadingScreen ? null : (
          <View
            style={StyleSheet.applyWidth(
              {
                alignItems: 'center',
                justifyContent: 'center',
                paddingBottom: 15,
                paddingTop: 40,
              },
              dimensions.width
            )}
          >
            <LoadingIndicator
              color={palettes.App.White}
              size={35}
              type={'swing'}
            />
          </View>
        )}
      </>
      {/* Content */}
      <>
        {isLoadingScreen ? null : (
          <View
            style={StyleSheet.applyWidth(
              { flex: 1, paddingBottom: 100 },
              dimensions.width
            )}
          >
            {/* Configuration View */}
            <View style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}>
              {/* Padding */}
              <View
                style={StyleSheet.applyWidth(
                  { paddingLeft: 20, paddingRight: 20 },
                  dimensions.width
                )}
              >
                <View
                  style={StyleSheet.applyWidth(
                    { justifyContent: 'center' },
                    dimensions.width
                  )}
                >
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'flex-end',
                        backgroundColor: theme.colors.background.brand,
                        borderRadius: 15,
                        height: 50,
                        justifyContent: 'center',
                        paddingRight: 60,
                        paddingTop: 2,
                        position: 'absolute',
                        width: '100%',
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
                            fontSize: 20,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'minutes'}
                    </Text>
                  </View>
                  <Utils.CustomCodeErrorBoundary>
                    <CustomWheelPicker.Index
                      {...{
                        value: selectedMinutes,
                        setValue: setSelectedMinutes,
                      }}
                      options={
                        Variables['APP_CONFIG']?.meditation_minutes_options ??
                        []
                      }
                      onChange={async () => {
                        setEnabledSwtich(false);
                        await xanoBackendDeleteMeditationTimerSettingDELETE.mutateAsync();
                      }}
                    />
                  </Utils.CustomCodeErrorBoundary>
                </View>
                {/* Card */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      backgroundColor: theme.colors.background.brand,
                      borderRadius: 15,
                      marginTop: 1,
                    },
                    dimensions.width
                  )}
                >
                  {/* Background Sound */}
                  <Pressable
                    onPress={() => {
                      try {
                        setVisibleModalBackgroundSound(true);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                  >
                    {/* Background Sound */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: 16,
                          paddingLeft: 20,
                          paddingRight: 20,
                          paddingTop: 18,
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
                              fontFamily: 'Rasa_700Bold',
                              fontSize: 18,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Background Sound'}
                      </Text>
                      {/* Sound name */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Rasa_500Medium',
                              fontSize: 18,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {selectedBackgroundSound?.name || 'None'}
                      </Text>
                    </View>
                  </Pressable>
                  <Divider
                    {...GlobalStyles.DividerStyles(theme)['Divider'].props}
                    color={palettes.App.Outline}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.DividerStyles(theme)['Divider'].style,
                        { opacity: 0.5 }
                      ),
                      dimensions.width
                    )}
                  />
                  {/* Interval Bell */}
                  <Pressable
                    onPress={() => {
                      try {
                        setVisibleModalIntervalBell(true);
                      } catch (err) {
                        Sentry.captureException(err);
                        console.error(err);
                      }
                    }}
                  >
                    {/* Interval Bell */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: 16,
                          paddingLeft: 20,
                          paddingRight: 20,
                          paddingTop: 18,
                        },
                        dimensions.width
                      )}
                    >
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            flexDirection: 'row',
                            gap: 8,
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
                                fontFamily: 'Rasa_700Bold',
                                fontSize: 18,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Interval Bell'}
                        </Text>
                        <Utils.CustomCodeErrorBoundary>
                          <CustomPopover.Index
                            {...{
                              theme,
                              label:
                                'You can choose to have a bell chime at set intervals to remind you to bring your attention back to the exercise if it has wandered',
                            }}
                          />
                        </Utils.CustomCodeErrorBoundary>
                      </View>
                      {/* Internal bell value */}
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Rasa_500Medium',
                              fontSize: 18,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {selectedIntervalBell?.label || 'None'}
                      </Text>
                    </View>
                  </Pressable>
                </View>
                {/* Save Section */}
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 40,
                      paddingLeft: 5,
                      paddingRight: 5,
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
                          fontSize: 18,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Save meditation timer setting'}
                  </Text>
                  <Switch
                    onValueChange={newSwitchValue => {
                      const handler = async () => {
                        try {
                          setEnabledSwtich(newSwitchValue);
                          if (newSwitchValue === true) {
                            (
                              await xanoBackendCreateMeditationTimerSettingPOST.mutateAsync(
                                {
                                  background_sound_id:
                                    selectedBackgroundSound?.id,
                                  interval_bell: selectedIntervalBell,
                                  minutes_duration: selectedMinutes,
                                }
                              )
                            )?.json;
                          } else {
                            (
                              await xanoBackendDeleteMeditationTimerSettingDELETE.mutateAsync()
                            )?.json;
                          }
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    activeTrackColor={palettes.App['App Buttons Color']}
                    value={enabledSwtich}
                  />
                </View>
              </View>
            </View>
            {/* Begin Button */}
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: 2,
                },
                dimensions.width
              )}
            >
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  const handler = async () => {
                    try {
                      if (Platform.OS === 'ios' || Platform.OS === 'android') {
                        await getRevCatCustomerInfo(setGlobalVariableValue);
                      }
                      if (isSubscribed(Variables) === true) {
                        await onPressAnimateLesson();
                        await Player_LoadAndPlayMeditation(
                          Variables,
                          setGlobalVariableValue,
                          tactic,
                          selectedMinutes,
                          selectedBackgroundSound,
                          selectedIntervalBell
                        );
                      } else {
                        showToastMessage(
                          'Alert',
                          'Please subscribe to use this feature'
                        );
                      }
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  };
                  handler();
                }}
                {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                icon={
                  isSubscribed(Variables) === true
                    ? undefined
                    : 'FontAwesome/lock'
                }
                iconSize={20}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ButtonStyles(theme)['Button'].style,
                    {
                      backgroundColor: palettes.App['App Buttons Color'],
                      borderRadius: 120,
                      fontFamily: 'Rasa_600SemiBold',
                      fontSize: 20,
                      width: '40%',
                    }
                  ),
                  dimensions.width
                )}
                title={'Begin'}
              />
            </View>
          </View>
        )}
      </>
      {/* Modal Interval Bell */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'slide'}
        transparent={false}
        visible={Boolean(visibleModalIntervalBell)}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: theme.colors.background.brand,
              flex: 1,
              paddingTop: safeAreaInsets.top,
            },
            dimensions.width
          )}
        >
          {/* Common Header */}
          <View
            {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                {
                  height: 45,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 10,
                }
              ),
              dimensions.width
            )}
          >
            {/* Back */}
            <Pressable
              onPress={() => {
                try {
                  setVisibleModalIntervalBell(false);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
              style={StyleSheet.applyWidth({ width: 45 }, dimensions.width)}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'flex-start',
                    height: 45,
                    justifyContent: 'center',
                    width: 45,
                  },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'MaterialIcons/arrow-back'}
                  size={27}
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
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 24,
                    paddingTop: 3,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Interval Bell'}
            </Text>
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 45,
                  justifyContent: 'center',
                  width: 45,
                },
                dimensions.width
              )}
            />
          </View>
          <SimpleStyleFlatList
            data={Constants['INTERVAL_BELL_OPTIONS']}
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
            listKey={'Modal Interval Bell->View->List'}
            nestedScrollEnabled={false}
            numColumns={1}
            onEndReachedThreshold={0.5}
            pagingEnabled={false}
            renderItem={({ item, index }) => {
              const listData = item;
              return (
                <>
                  <Pressable
                    onPress={() => {
                      const handler = async () => {
                        try {
                          setEnabledSwtich(false);
                          setSelectedIntervalBell(listData);
                          (
                            await xanoBackendDeleteMeditationTimerSettingDELETE.mutateAsync()
                          )?.json;
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    activeOpacity={1}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: 20,
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
                              fontSize: 21,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {listData?.label}
                      </Text>
                      {/* Unselect */}
                      <>
                        {!(
                          selectedIntervalBell?.value !== listData?.value
                        ) ? null : (
                          <IconButton
                            onPress={() => {
                              try {
                                setSelectedIntervalBell(listData);
                              } catch (err) {
                                Sentry.captureException(err);
                                console.error(err);
                              }
                            }}
                            color={palettes.Brand.Surface}
                            icon={'MaterialCommunityIcons/radiobox-blank'}
                            size={28}
                          />
                        )}
                      </>
                      {/* Selected */}
                      <>
                        {!(
                          selectedIntervalBell?.value === listData?.value
                        ) ? null : (
                          <IconButton
                            color={palettes.App['App Buttons Color']}
                            icon={'MaterialCommunityIcons/radiobox-marked'}
                            size={28}
                          />
                        )}
                      </>
                    </View>
                  </Pressable>
                  <Divider
                    {...GlobalStyles.DividerStyles(theme)['Divider'].props}
                    color={palettes.App.Outline}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.DividerStyles(theme)['Divider'].style,
                        { opacity: 0.8 }
                      ),
                      dimensions.width
                    )}
                  />
                </>
              );
            }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            snapToAlignment={'start'}
            style={StyleSheet.applyWidth(
              { flex: 1, marginTop: 15, paddingLeft: 15, paddingRight: 15 },
              dimensions.width
            )}
          />
        </View>
      </Modal>
      {/* Modal Background Sounds */}
      <Modal
        supportedOrientations={['portrait', 'landscape']}
        animationType={'slide'}
        transparent={false}
        visible={Boolean(visibleModalBackgroundSound)}
      >
        <View
          style={StyleSheet.applyWidth(
            {
              backgroundColor: theme.colors.background.brand,
              flex: 1,
              paddingTop: safeAreaInsets.top,
            },
            dimensions.width
          )}
        >
          {/* Common Header */}
          <View
            {...GlobalStyles.ViewStyles(theme)['Screen_Header'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(
                GlobalStyles.ViewStyles(theme)['Screen_Header'].style,
                {
                  height: 45,
                  justifyContent: 'space-between',
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingTop: 10,
                }
              ),
              dimensions.width
            )}
          >
            {/* Back */}
            <Pressable
              onPress={() => {
                try {
                  setVisibleModalBackgroundSound(false);
                } catch (err) {
                  Sentry.captureException(err);
                  console.error(err);
                }
              }}
              activeOpacity={0.3}
              style={StyleSheet.applyWidth({ width: 45 }, dimensions.width)}
            >
              <View
                style={StyleSheet.applyWidth(
                  {
                    alignItems: 'flex-start',
                    height: 45,
                    justifyContent: 'center',
                    width: 45,
                  },
                  dimensions.width
                )}
              >
                <Icon
                  color={palettes.App['Custom Color']}
                  name={'MaterialIcons/arrow-back'}
                  size={27}
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
                    color: palettes.Brand.Surface,
                    fontFamily: 'Rasa_600SemiBold',
                    fontSize: 24,
                    paddingTop: 3,
                    textAlign: 'center',
                  }
                ),
                dimensions.width
              )}
            >
              {'Background Sound'}
            </Text>
            <View
              style={StyleSheet.applyWidth(
                {
                  alignItems: 'center',
                  height: 45,
                  justifyContent: 'center',
                  width: 45,
                },
                dimensions.width
              )}
            />
          </View>
          <SimpleStyleFlatList
            data={backgroundSounds}
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
            listKey={'Modal Background Sounds->View->List'}
            nestedScrollEnabled={false}
            numColumns={1}
            onEndReachedThreshold={0.5}
            pagingEnabled={false}
            renderItem={({ item, index }) => {
              const listData = item;
              return (
                <>
                  <Pressable
                    onPress={() => {
                      const handler = async () => {
                        try {
                          setEnabledSwtich(false);
                          setSelectedBackgroundSound(listData);
                          (
                            await xanoBackendDeleteMeditationTimerSettingDELETE.mutateAsync()
                          )?.json;
                        } catch (err) {
                          Sentry.captureException(err);
                          console.error(err);
                        }
                      };
                      handler();
                    }}
                    activeOpacity={1}
                  >
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingBottom: 20,
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
                              fontSize: 21,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {listData?.name}
                      </Text>
                      {/* Unselect */}
                      <>
                        {!(
                          selectedBackgroundSound?.id !== listData?.id
                        ) ? null : (
                          <IconButton
                            onPress={() => {
                              try {
                                setSelectedBackgroundSound(listData);
                              } catch (err) {
                                Sentry.captureException(err);
                                console.error(err);
                              }
                            }}
                            color={palettes.Brand.Surface}
                            icon={'MaterialCommunityIcons/radiobox-blank'}
                            size={28}
                          />
                        )}
                      </>
                      {/* Selected */}
                      <>
                        {!(
                          selectedBackgroundSound?.id === listData?.id
                        ) ? null : (
                          <IconButton
                            color={palettes.App['App Buttons Color']}
                            icon={'MaterialCommunityIcons/radiobox-marked'}
                            size={28}
                          />
                        )}
                      </>
                    </View>
                  </Pressable>
                  <Divider
                    {...GlobalStyles.DividerStyles(theme)['Divider'].props}
                    color={palettes.App.Outline}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.DividerStyles(theme)['Divider'].style,
                        { opacity: 0.8 }
                      ),
                      dimensions.width
                    )}
                  />
                </>
              );
            }}
            showsHorizontalScrollIndicator={true}
            showsVerticalScrollIndicator={true}
            snapToAlignment={'start'}
            style={StyleSheet.applyWidth(
              { flex: 1, marginTop: 15, paddingLeft: 15, paddingRight: 15 },
              dimensions.width
            )}
          />
        </View>
      </Modal>
    </ScreenContainer>
  );
};

export default withTheme(DesignYourMeditationScreen);
