import { showMessage } from 'react-native-flash-message';

export const myMessage = ({ message, description }) => {
  showMessage({
    message: message,
    description: description,
    type: 'success',
    duration: 3000,
    color: 'white',
    backgroundColor: '#0177D9',
    floating: true,
    titleStyle: {
      fontSize: 18,
      fontFamily: 'Rasa_600SemiBold',
      paddingTop: 4,
    },
    textStyle: {
      fontSize: 15,
      fontFamily: 'Rasa_400Regular',
    },
  });
};
