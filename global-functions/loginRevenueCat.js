import * as CommonPackages from '../custom-files/CommonPackages';

const loginRevenueCat = async (setGlobalVariableValue, userId) => {
  const Purchases = CommonPackages.Purchases;
  try {
    const { customerInfo, created } = await Purchases.logIn(String(userId));
    setGlobalVariableValue({
      key: 'CUSTOMER_INFO',
      value: customerInfo,
    });
    return { customerInfo, created };
  } catch (e) {
    console.error('error loginRevenueCat : ', e);
  }
};

export default loginRevenueCat;
