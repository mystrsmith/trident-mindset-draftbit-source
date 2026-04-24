import { Stagger } from '@animatereactnative/stagger';
import {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  ZoomInEasyDown,
  ZoomInRight,
} from 'react-native-reanimated';

function Index({ children }) {
  return (
    <Stagger
      stagger={50}
      duration={300}
      exitDirection={-1}
      entering={() => ZoomInEasyDown.springify()}
      exiting={() => FadeOutDown.springify()}
    >
      {children}
    </Stagger>
  );
}

export { Index };
