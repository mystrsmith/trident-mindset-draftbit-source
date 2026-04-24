import React from 'react';
import { Divider, Pressable, withTheme } from '@draftbit/ui';
import * as Sentry from '@sentry/react-native';
import { Text, View } from 'react-native';
import * as GlobalStyles from '../GlobalStyles.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import * as CustomCode from '../custom-files/CustomCode';
import palettes from '../themes/palettes';
import Breakpoints from '../utils/Breakpoints';
import * as StyleSheet from '../utils/StyleSheet';
import useNavigation from '../utils/useNavigation';
import useWindowDimensions from '../utils/useWindowDimensions';

const defaultProps = {
  availablePackages: null,
  isEligibleForTrial: null,
  onPressPackage: () => {},
  onPressPurchasePackage: () => {},
  selectedPackage: null,
};

const SubscriptionPricingSectionNewBlock = props => {
  const { theme } = props;
  const dimensions = useWindowDimensions();
  const Constants = GlobalVariables.useValues();
  const Variables = Constants;
  const getAnnualPackage = availablePackages => {
    const annualPackage =
      availablePackages?.find(item => item?.packageType === 'ANNUAL') ?? null;
    return annualPackage;
  };

  const getDescriptionMessage = (Variables, selectedPackage) => {
    if (!props.isEligibleForTrial) {
      if (selectedPackage?.packageType === 'ANNUAL') {
        const monthlyPriceFromAnnual = getMonthlyPriceFromAnnual(
          getAnnualPackage(props.availablePackages ?? null)?.product
        );
        return `${monthlyPriceFromAnnual}/month, billed annually at ${selectedPackage?.product?.priceString}/year. Cancel anytime.`;
      }
      if (selectedPackage?.packageType === 'MONTHLY') {
        return `Monthly at ${selectedPackage?.product?.priceString}/month. Cancel anytime.`;
      }
    }
    if (selectedPackage?.packageType === 'ANNUAL') {
      const monthlyPriceFromAnnual = getMonthlyPriceFromAnnual(
        getAnnualPackage(props.availablePackages ?? null)?.product
      );
      return `Totally free for 7 days. Then ${monthlyPriceFromAnnual}/month, billed annually at ${selectedPackage?.product?.priceString}/year. Cancel anytime.`;
    }
    if (selectedPackage?.packageType === 'MONTHLY') {
      return `Free trial for 7 days. Then billed monthly at ${selectedPackage?.product?.priceString}/month. Cancel anytime.`;
    }
  };

  const getMonthlyPackage = availablePackages => {
    const monthlyPacakage =
      availablePackages?.find(item => item?.packageType === 'MONTHLY') ?? null;
    return monthlyPacakage;
  };

  const getMonthlyPriceFromAnnual = product => {
    if (!product) {
      return '';
    }
    const price = product?.price;
    const priceString = product?.priceString;
    const monthlyPrice = (price / 12).toFixed(2);
    const currencySymbol = priceString?.match(/[^\d.,]/g).join('');
    const formattedMonthlyPrice = monthlyPrice?.replace(
      /\B(?=(\d{3})+(?!\d))/g,
      '.'
    );

    return `${currencySymbol}${formattedMonthlyPrice}`;
  };

  return (
    <View>
      {/* Container */}
      <View
        style={StyleSheet.applyWidth(
          { gap: 20, paddingLeft: 0 },
          dimensions.width
        )}
      >
        {/* Price View */}
        <>
          {!(
            props.availablePackages ?? defaultProps.availablePackages
          ) ? null : (
            <View
              style={StyleSheet.applyWidth(
                {
                  alignSelf: 'center',
                  flexDirection: 'row',
                  gap: 20,
                  justifyContent: 'space-around',
                  width:
                    (props.availablePackages ?? defaultProps.availablePackages)
                      ?.length === 1
                      ? '50%'
                      : '100%',
                },
                dimensions.width
              )}
            >
              {/* Monthly */}
              <View
                style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
              >
                {/* Monthly Pressable */}
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
                >
                  {/* Trial Badge */}
                  <>
                    {!(
                      props.isEligibleForTrial ??
                      defaultProps.isEligibleForTrial
                    ) ? null : (
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: palettes.App['Gold Box'],
                            borderRadius: 8,
                            opacity: 0.96,
                            paddingBottom: 2,
                            paddingTop: 2,
                            position: 'absolute',
                            top: -10,
                            width: '80%',
                            zIndex: 5,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Text 3 */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App.Black_Alpha_80,
                                fontFamily: 'Rasa_600SemiBold',
                                fontSize: 17,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'7-Day Free Trial'}
                        </Text>
                      </View>
                    )}
                  </>
                  {/* Monthly */}
                  <View
                    style={StyleSheet.applyWidth(
                      {
                        borderColor: [
                          {
                            minWidth: Breakpoints.Mobile,
                            value: palettes.App.Outline,
                          },
                          {
                            minWidth: Breakpoints.Mobile,
                            value:
                              (
                                props.selectedPackage ??
                                defaultProps.selectedPackage
                              )?.packageType ===
                              getMonthlyPackage(
                                props.availablePackages ??
                                  defaultProps.availablePackages
                              )?.packageType
                                ? palettes.App.White
                                : palettes.App.Outline,
                          },
                        ],
                        borderRadius: 8,
                        borderWidth: 2,
                        gap: 10,
                        height: 150,
                        justifyContent: 'center',
                        padding: 10,
                      },
                      dimensions.width
                    )}
                  >
                    {/* Monthly */}
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
                            fontSize: 19,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {'Monthly'}
                    </Text>
                    <Divider
                      {...GlobalStyles.DividerStyles(theme)['Divider'].props}
                      color={palettes.App.White}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.DividerStyles(theme)['Divider'].style,
                          { opacity: 0.5 }
                        ),
                        dimensions.width
                      )}
                    />
                    {/* Price Value */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: palettes.App.White,
                            fontFamily: 'Rasa_600SemiBold',
                            fontSize: 21,
                            letterSpacing: 0.5,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        getMonthlyPackage(
                          props.availablePackages ??
                            defaultProps.availablePackages
                        )?.product?.priceString
                      }
                      {/* /mo. */}
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
                              fontSize: 19,
                              opacity: 0.5,
                            }
                          ),
                          dimensions.width
                        )}
                      >
                        {'/mo.'}
                      </Text>
                    </Text>
                    {/* Space */}
                    <Text
                      accessible={true}
                      selectable={false}
                      {...GlobalStyles.TextStyles(theme)['Text'].props}
                      style={StyleSheet.applyWidth(
                        StyleSheet.compose(
                          GlobalStyles.TextStyles(theme)['Text'].style,
                          {
                            color: 'rgba(0, 0, 0, 0)',
                            fontFamily: 'Rasa_400Regular',
                            fontSize: 17,
                            opacity: 0,
                          }
                        ),
                        dimensions.width
                      )}
                    >
                      {
                        getMonthlyPackage(
                          props.availablePackages ??
                            defaultProps.availablePackages
                        )?.product?.priceString
                      }
                      {' every 12 months'}
                    </Text>
                  </View>
                </Pressable>
              </View>
              {/* Annual */}
              <>
                {!(
                  (props.availablePackages ?? defaultProps.availablePackages)
                    ?.length > 1
                ) ? null : (
                  <View
                    style={StyleSheet.applyWidth({ flex: 1 }, dimensions.width)}
                  >
                    {/* Yearly Pressable */}
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
                    >
                      {/* Trial Badge */}
                      <>
                        {!(
                          props.isEligibleForTrial ??
                          defaultProps.isEligibleForTrial
                        ) ? null : (
                          <View
                            style={StyleSheet.applyWidth(
                              {
                                alignItems: 'center',
                                alignSelf: 'center',
                                backgroundColor: palettes.App['Gold Box'],
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
                                opacity: 0.96,
                                paddingBottom: 2,
                                paddingTop: 2,
                                position: 'absolute',
                                top: -20,
                                width: '80%',
                                zIndex: 5,
                              },
                              dimensions.width
                            )}
                          >
                            {/* Text 3 */}
                            <Text
                              accessible={true}
                              selectable={false}
                              {...GlobalStyles.TextStyles(theme)['Text'].props}
                              style={StyleSheet.applyWidth(
                                StyleSheet.compose(
                                  GlobalStyles.TextStyles(theme)['Text'].style,
                                  {
                                    color: palettes.App.Black_Alpha_80,
                                    fontFamily: 'Rasa_600SemiBold',
                                    fontSize: 17,
                                  }
                                ),
                                dimensions.width
                              )}
                            >
                              {'7-Day Free Trial'}
                            </Text>
                          </View>
                        )}
                      </>
                      {/* Discount */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            alignItems: 'center',
                            alignSelf: 'center',
                            backgroundColor: palettes.Brand['Base Blue'],
                            borderBottomLeftRadius: 8,
                            borderBottomRightRadius: 8,
                            borderRadius:
                              (props.isEligibleForTrial ??
                                defaultProps.isEligibleForTrial) === false
                                ? 8
                                : undefined,
                            paddingBottom: 2,
                            paddingTop: 2,
                            position: 'absolute',
                            top: [
                              { minWidth: Breakpoints.Mobile, value: 0 },
                              {
                                minWidth: Breakpoints.Mobile,
                                value:
                                  (props.isEligibleForTrial ??
                                    defaultProps.isEligibleForTrial) === false
                                    ? -10
                                    : undefined,
                              },
                            ],
                            width: '80%',
                            zIndex: 5,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Text 3 */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App.White,
                                fontFamily: 'Rasa_600SemiBold',
                                fontSize: 17,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'20% Discount'}
                        </Text>
                      </View>
                      {/* Yearly */}
                      <View
                        style={StyleSheet.applyWidth(
                          {
                            borderColor: [
                              {
                                minWidth: Breakpoints.Mobile,
                                value: palettes.App.Outline,
                              },
                              {
                                minWidth: Breakpoints.Mobile,
                                value:
                                  (
                                    props.selectedPackage ??
                                    defaultProps.selectedPackage
                                  )?.packageType ===
                                  getAnnualPackage(
                                    props.availablePackages ??
                                      defaultProps.availablePackages
                                  )?.packageType
                                    ? palettes.App.White
                                    : palettes.App.Outline,
                              },
                            ],
                            borderRadius: 8,
                            borderWidth: 2,
                            gap: 10,
                            height: 150,
                            justifyContent: 'center',
                            padding: 10,
                          },
                          dimensions.width
                        )}
                      >
                        {/* Yearly */}
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
                                fontSize: 19,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {'Yearly'}
                        </Text>
                        <Divider
                          {...GlobalStyles.DividerStyles(theme)['Divider']
                            .props}
                          color={palettes.App.White}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.DividerStyles(theme)['Divider']
                                .style,
                              { opacity: 0.5 }
                            ),
                            dimensions.width
                          )}
                        />
                        {/* Price Value */}
                        <Text
                          accessible={true}
                          selectable={false}
                          {...GlobalStyles.TextStyles(theme)['Text'].props}
                          style={StyleSheet.applyWidth(
                            StyleSheet.compose(
                              GlobalStyles.TextStyles(theme)['Text'].style,
                              {
                                color: palettes.App.White,
                                fontFamily: 'Rasa_600SemiBold',
                                fontSize: 21,
                                letterSpacing: 0.5,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {
                            getAnnualPackage(
                              props.availablePackages ??
                                defaultProps.availablePackages
                            )?.product?.priceString
                          }
                          {/* /yr. */}
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
                                  fontSize: 19,
                                  opacity: 0.5,
                                }
                              ),
                              dimensions.width
                            )}
                          >
                            {'/yr.'}
                          </Text>
                        </Text>
                        {/* Total Price Value */}
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
                                fontSize: 17,
                                opacity: 0.5,
                              }
                            ),
                            dimensions.width
                          )}
                        >
                          {getMonthlyPriceFromAnnual(
                            getAnnualPackage(
                              props.availablePackages ??
                                defaultProps.availablePackages
                            )?.product
                          )}
                          {' each month'}
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                )}
              </>
            </View>
          )}
        </>
        {/* Button View */}
        <View>
          {/* Purchase Button */}
          <Pressable
            onPress={() => {
              try {
                props.onPressPurchasePackage?.(
                  props.selectedPackage ?? defaultProps.selectedPackage
                );
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
                  alignSelf: 'center',
                  backgroundColor: palettes.App.Success,
                  borderRadius: 100,
                  justifyContent: 'center',
                  paddingBottom: 10,
                  paddingLeft: 35,
                  paddingRight: 35,
                  paddingTop: 10,
                  width: '100%',
                },
                dimensions.width
              )}
            >
              <>
                {!(
                  props.isEligibleForTrial ?? defaultProps.isEligibleForTrial
                ) ? null : (
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.App.White,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 21,
                          paddingTop: 2,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Start Your Free Trial'}
                  </Text>
                )}
              </>
              {/* Subscribe */}
              <>
                {props.isEligibleForTrial ??
                defaultProps.isEligibleForTrial ? null : (
                  <Text
                    accessible={true}
                    selectable={false}
                    {...GlobalStyles.TextStyles(theme)['Text'].props}
                    style={StyleSheet.applyWidth(
                      StyleSheet.compose(
                        GlobalStyles.TextStyles(theme)['Text'].style,
                        {
                          color: palettes.App.White,
                          fontFamily: 'Rasa_600SemiBold',
                          fontSize: 21,
                          paddingTop: 2,
                        }
                      ),
                      dimensions.width
                    )}
                  >
                    {'Subscribe for Full Access'}
                  </Text>
                )}
              </>
            </View>
          </Pressable>

          <Text
            accessible={true}
            selectable={false}
            {...GlobalStyles.TextStyles(theme)['Text'].props}
            style={StyleSheet.applyWidth(
              StyleSheet.compose(GlobalStyles.TextStyles(theme)['Text'].style, {
                color: palettes.App.White,
                fontFamily: 'Rasa_300Light',
                fontSize: 14,
                marginTop: 12,
                opacity: 0.7,
                textAlign: 'center',
              }),
              dimensions.width
            )}
          >
            {getDescriptionMessage(
              Variables,
              props.selectedPackage ?? defaultProps.selectedPackage
            )}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default withTheme(SubscriptionPricingSectionNewBlock);
