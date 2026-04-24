import * as ShowMessage from '../custom-files/ShowMessage';

const showToastMessage = (message, description) => {
  ShowMessage.myMessage({
    message,
    description,
  });
};

export default showToastMessage;
