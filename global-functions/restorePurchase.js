import * as CommonPackages from '../custom-files/CommonPackages';

const restorePurchase = async () => {
  try {
    const restore = await CommonPackages.Purchases.restorePurchases();
    return restore;
  } catch (e) {
    console.error('restore purchase error : ', e);
  }
};

export default restorePurchase;
