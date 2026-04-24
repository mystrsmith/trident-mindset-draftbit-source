import React from 'react';
import { Button, Icon, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import convertAnnualToMonthly from '../global-functions/convertAnnualToMonthly';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  availablePackages: null,
  onPressPackage: () => {},
  onPressPurchase: () => {},
  selectedPackage: null,
};

const SubscriptionPricingSectionBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const getAnnualPackage = availablePackages => {
    const annualPackage =
      availablePackages?.find(item => item?.packageType === 'ANNUAL') ?? null;
    return annualPackage;
  };

  const getMonthlyPackage = availablePackages => {
    const monthlyPacakage =
      availablePackages?.find(item => item?.packageType === 'MONTHLY') ?? null;
    return monthlyPacakage;
  };

  const onPressPackageItem = targetPackage => {
    setSelectedPackage(targetPackage);
  };

  return (
    <View>
      {/* Container */}
      <>
        {!(
          (props.availablePackages ?? defaultProps.availablePackages)?.length >
          0
        ) ? null : (
          <View style={StyleSheet.applyWidth({ margin: 20 }, dimensions.width)}>
            {/* Montly Selected */}
            <>
              {!(
                (props.selectedPackage ?? defaultProps.selectedPackage)
                  ?.packageType ===
                getMonthlyPackage(
                  props.availablePackages ?? defaultProps.availablePackages
                )?.packageType
              ) ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    {
                      alignItems: 'center',
                      backgroundColor: palettes.App['App Buttons Color'],
                      borderColor: palettes.App['Custom Color_11'],
                      borderRadius: 15,
                      borderWidth: 5,
                      flexDirection: 'row',
                      height: 75,
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                      paddingBottom: 15,
                      paddingLeft: 20,
                      paddingRight: 20,
                      paddingTop: 15,
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
                          fontFamily: 'Poppins_600SemiBold',
                          fontSize: 15,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Monthly - '}
                    {
                      getMonthlyPackage(
                        props.availablePackages ??
                          defaultProps.availablePackages
                      )?.product?.priceString
                    }
                    {'/month'}
                  </Text>
                  <Icon
                    color={palettes.App['Purchase Button']}
                    name={'Ionicons/checkmark-circle'}
                    size={30}
                  />
                </View>
              )}
            </>
            {/* Monthly Not Selected */}
            <>
              {!(
                (props.selectedPackage ?? defaultProps.selectedPackage)
                  ?.packageType !==
                getMonthlyPackage(
                  props.availablePackages ?? defaultProps.availablePackages
                )?.packageType
              ) ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      props.onPressPackage?.(
                        getMonthlyPackage(
                          props.availablePackages ??
                            defaultProps.availablePackages
                        )
                      );
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  style={StyleSheet.applyWidth(
                    { height: 75 },
                    dimensions.width
                  )}
                >
                  {/* Montly InActive */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        backgroundColor: palettes.App['App Buttons Color'],
                        borderColor: 'rgba(0, 0, 0, 0)',
                        borderRadius: 15,
                        borderWidth: 5,
                        flexDirection: 'row',
                        height: 75,
                        justifyContent: 'space-between',
                        opacity: 0.35,
                        overflow: 'hidden',
                        paddingBottom: 15,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 15,
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
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 15,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Monthly - '}
                      {
                        getMonthlyPackage(
                          props.availablePackages ??
                            defaultProps.availablePackages
                        )?.product?.priceString
                      }
                      {'/month'}
                    </Text>
                  </View>
                </Pressable>
              )}
            </>
            {/* Yearly Selected */}
            <>
              {!(
                (props.selectedPackage ?? defaultProps.selectedPackage)
                  ?.packageType ===
                  getAnnualPackage(
                    props.availablePackages ?? defaultProps.availablePackages
                  )?.packageType &&
                getAnnualPackage(
                  props.availablePackages ?? defaultProps.availablePackages
                ) !== null
              ) ? null : (
                <View
                  style={StyleSheet.applyWidth(
                    { height: 75, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {/* Yearly */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        alignItems: 'center',
                        backgroundColor: palettes.App['App Buttons Color'],
                        borderColor: palettes.App['Custom Color_11'],
                        borderRadius: 15,
                        borderWidth: 5,
                        flexDirection: 'row',
                        height: 75,
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        paddingBottom: 10,
                        paddingLeft: 20,
                        paddingRight: 20,
                        paddingTop: 10,
                      },
                      dimensions.width
                    )}
                  >
                    <View>
                      <Text
                        accessible={true}
                        selectable={false}
                        {...GlobalStyles.TextStyles(theme)['Text'].props}
                        style={StyleSheet.applyWidth(
                          StyleSheet.compose(
                            GlobalStyles.TextStyles(theme)['Text'].style,
                            {
                              color: palettes.Brand.Surface,
                              fontFamily: 'Poppins_600SemiBold',
                              fontSize: 15,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Yearly - '}
                        {
                          getAnnualPackage(
                            props.availablePackages ??
                              defaultProps.availablePackages
                          )?.product?.priceString
                        }
                        {'/year'}
                      </Text>
                      {/* Text per month */}
                      <>
                        {!convertAnnualToMonthly(
                          getAnnualPackage(
                            props.availablePackages ??
                              defaultProps.availablePackages
                          )?.product?.price
                        ) ? null : (
                          <Text
                            accessible={true}
                            selectable={false}
                            {...GlobalStyles.TextStyles(theme)['Text'].props}
                            style={StyleSheet.applyWidth(
                              StyleSheet.compose(
                                GlobalStyles.TextStyles(theme)['Text'].style,
                                {
                                  color: theme.colors.border.brand,
                                  fontFamily: 'Poppins_600SemiBold',
                                  fontSize: 11,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {convertAnnualToMonthly(
                              getAnnualPackage(
                                props.availablePackages ??
                                  defaultProps.availablePackages
                              )?.product?.price
                            )}{' '}
                            {
                              getAnnualPackage(
                                props.availablePackages ??
                                  defaultProps.availablePackages
                              )?.product?.currencyCode
                            }
                            {' per month'}
                          </Text>
                        )}
                      </>
                    </View>
                    <Icon
                      color={palettes.App['Purchase Button']}
                      name={'Ionicons/checkmark-circle'}
                      size={30}
                    />
                  </View>

                  <View
                    style={StyleSheet.applyWidth(
                      {
                        backgroundColor: palettes.App.Success,
                        borderRadius: 4,
                        paddingBottom: 3,
                        paddingLeft: 6,
                        paddingRight: 6,
                        paddingTop: 3,
                        position: 'absolute',
                        right: 10,
                        top: -4,
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
                            fontFamily: 'Poppins_300Light',
                            fontSize: 11,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Save 20%'}
                    </Text>
                  </View>
                </View>
              )}
            </>
            {/* Yearly Not Selected */}
            <>
              {!(
                (props.selectedPackage ?? defaultProps.selectedPackage)
                  ?.packageType !==
                  getAnnualPackage(
                    props.availablePackages ?? defaultProps.availablePackages
                  )?.packageType &&
                getAnnualPackage(
                  props.availablePackages ?? defaultProps.availablePackages
                ) !== null
              ) ? null : (
                <Pressable
                  onPress={() => {
                    try {
                      props.onPressPackage?.(
                        getAnnualPackage(
                          props.availablePackages ??
                            defaultProps.availablePackages
                        )
                      );
                    } catch (err) {
                      Sentry.captureException(err);
                      console.error(err);
                    }
                  }}
                  style={StyleSheet.applyWidth(
                    { height: 75, marginTop: 10 },
                    dimensions.width
                  )}
                >
                  {/* Yearly InActive */}
                  <View
                    style={StyleSheet.applyWidth(
                      { opacity: 0.35 },
                      dimensions.width
                    )}
                  >
                    {/* Yearly */}
                    <View
                      style={StyleSheet.applyWidth(
                        {
                          alignItems: 'center',
                          backgroundColor: palettes.App['App Buttons Color'],
                          borderColor: 'rgba(0, 0, 0, 0)',
                          borderRadius: 15,
                          borderWidth: 5,
                          flexDirection: 'row',
                          height: 75,
                          justifyContent: 'space-between',
                          overflow: 'hidden',
                          paddingBottom: 10,
                          paddingLeft: 20,
                          paddingRight: 20,
                          paddingTop: 10,
                        },
                        dimensions.width
                      )}
                    >
                      <View>
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.Brand.Surface,
                                fontFamily: 'Poppins_600SemiBold',
                                fontSize: 15,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Yearly - '}
                          {
                            getAnnualPackage(
                              props.availablePackages ??
                                defaultProps.availablePackages
                            )?.product?.priceString
                          }
                          {'/year'}
                        </Text>
                        {/* Text per month */}
                        <>
                          {!convertAnnualToMonthly(
                            getAnnualPackage(
                              props.availablePackages ??
                                defaultProps.availablePackages
                            )?.product?.price
                          ) ? null : (
                            <Text
                              accessible={true}
                              selectable={false}
                              {...GlobalStyles.TextStyles(theme)['Text'].props}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextStyles(theme)['Text'].style,
                                  {
                                    color: theme.colors.border.brand,
                                    fontFamily: 'Poppins_600SemiBold',
                                    fontSize: 11,
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {convertAnnualToMonthly(
                                getAnnualPackage(
                                  props.availablePackages ??
                                    defaultProps.availablePackages
                                )?.product?.price
                              )}{' '}
                              {
                                getAnnualPackage(
                                  props.availablePackages ??
                                    defaultProps.availablePackages
                                )?.product?.currencyCode
                              }
                              {' per month'}
                            </Text>
                          )}
                        </>
                      </View>
                    </View>

                    <View
                      style={StyleSheet.applyWidth(
                        {
                          backgroundColor: palettes.App.Success,
                          borderRadius: 4,
                          paddingBottom: 3,
                          paddingLeft: 6,
                          paddingRight: 6,
                          paddingTop: 3,
                          position: 'absolute',
                          right: 10,
                          top: -4,
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
                              fontFamily: 'Poppins_300Light',
                              fontSize: 11,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'Save 20%'}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            </>
            <View
              style={StyleSheet.applyWidth({ marginTop: 15 }, dimensions.width)}
            >
              <Button
                accessible={true}
                iconPosition={'left'}
                onPress={() => {
                  try {
                    props.onPressPurchase?.();
                  } catch (err) {
                    Sentry.captureException(err);
                    console.error(err);
                  }
                }}
                title={'Get Started'}
                {...GlobalStyles.ButtonStyles(theme)['Button'].props}
                style={StyleSheet.applyWidth(
                  StyleSheet.compose(
                    GlobalStyles.ButtonStyles(theme)['Button'].style,
                    {
                      backgroundColor: theme.colors.branding.primary,
                      borderRadius: 10,
                    }
                  ),
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
                      alignSelf: 'center',
                      color: palettes.Brand.Surface,
                      fontFamily: 'Poppins_500Medium_Italic',
                      fontSize: 12,
                      marginTop: 10,
                    }
                  ),
                  dimensions.width
                )}
              >
                {'No commitment. Cancel anytime.'}
              </Text>
            </View>
          </View>
        )}
      </>
    </View>
  );
};

export default withTheme(SubscriptionPricingSectionBlock);
