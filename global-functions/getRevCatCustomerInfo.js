import * as CommonPackages from '../custom-files/CommonPackages';

const getRevCatCustomerInfo = async setGlobalVariableValue => {
  const Purchases = CommonPackages.Purchases;
  const customerInfo = await Purchases.getCustomerInfo();
  setGlobalVariableValue({
    key: 'CUSTOMER_INFO',
    value: customerInfo,
  });
};

export default getRevCatCustomerInfo;
