import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';

const CustomSelectableText = forwardRef(
  (
    {
      value,
      onSelection = () => {},
      style,
      menuItems = [],
      textComponentProps,
    },
    ref
  ) => {
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const textInputRef = useRef(null);

    const clearSelection = () => {
      if (textInputRef.current) {
        setSelection({ start: 0, end: 0 });
        textInputRef.current.setNativeProps({
          selection: { start: 0, end: 0 },
        });
        onSelection({ type: 'deselect' });
      }
    };

    useImperativeHandle(ref, () => ({
      clearSelection,
    }));

    const handleSelectionChange = ({ nativeEvent: { selection } }) => {
      const { start, end } = selection;

      // Only update if there's an actual selection
      if (start !== end) {
        setSelection({ start, end });
        const highlighted = value.slice(start, end);
        onSelection({ type: 'select', content: highlighted });
      } else {
        // Clear selection
        setSelection({ start: 0, end: 0 });
        onSelection({ type: 'deselect' });
      }
    };

    // Platform specific props
    const platformProps = Platform.select({
      ios: {
        editable: false,
        contextMenuHidden: true,
        caretHidden: true,
        selectable: true,
      },
      android: {
        editable: true,
        contextMenuHidden: false,
        caretHidden: false,
        selectable: true,
      },
    });

    return (
      <View style={styles.container}>
        <TextInput
          ref={textInputRef}
          multiline
          value={value}
          style={[
            styles.textInput,
            Platform.OS === 'android' && styles.androidTextInput,
            style,
            textComponentProps.style,
          ]}
          onSelectionChange={handleSelectionChange}
          selection={selection}
          showSoftInputOnFocus={false}
          scrollEnabled={false}
          {...platformProps}
        />
      </View>
    );
  }
);

export default CustomSelectableText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginTop: 30,
  },
  textInput: {
    flex: 1,
    color: '#fff',
    backgroundColor: 'transparent',
    padding: 0,
    textAlignVertical: 'top',
    includeFontPadding: false,
    lineHeight: 24,
    fontSize: 18,
    fontFamily: 'Rasa_400Regular',
  },
  androidTextInput: {
    lineHeight: Platform.OS === 'android' ? 26 * 1.15 : 26,
    padding: 0,
    includeFontPadding: false,
    textAlignVertical: 'top',
    minHeight: 0,
    maxHeight: undefined,
    letterSpacing: 0,
  },
});
