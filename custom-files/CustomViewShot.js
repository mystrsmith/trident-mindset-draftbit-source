import React from 'react';
import ViewShot from 'react-native-view-shot';

export const Component = React.forwardRef((props, ref) => {
  return (
    <ViewShot
      ref={ref}
      options={{ fileName: 'Your-File-Name', format: 'jpg', quality: 0.9 }}
    >
      {props?.children}
    </ViewShot>
  );
});
