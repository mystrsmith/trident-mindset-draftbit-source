import { BlurView } from 'expo-blur';

const Index = ({ children }) => {
  return (
    <BlurView
      tint={'dark'}
      experimentalBlurMethod="dimezisBlurView"
      intensity={40}
      style={{
        height: '100%',
        position: 'absolute',
        width: '100%',
      }}
    >
      {children}
    </BlurView>
  );
};

export { Index };
