// import React from 'react';

// const SelectableText = () => {
//   return null;
// };

// export { SelectableText };

import React, { ReactNode, useMemo, useCallback } from 'react';
import {
  Text,
  requireNativeComponent,
  Platform,
  StyleSheet,
} from 'react-native';
import memoize from 'fast-memoize';

const RNSelectableText = requireNativeComponent('RNSelectableText');

const combineHighlights = memoize(numbers => {
  return numbers
    .sort((a, b) => a.start - b.start || a.end - b.end)
    .reduce((combined, next) => {
      if (!combined.length || combined[combined.length - 1].end < next.start) {
        combined.push(next);
      } else {
        const prev = combined.pop();
        if (prev) {
          combined.push({
            start: prev.start,
            end: Math.max(prev.end, next.end),
            id: next.id,
            color: prev.color,
          });
        }
      }
      return combined;
    }, []);
});

const mapHighlightsRanges = memoize((value, highlights) => {
  const combinedHighlights = combineHighlights(highlights);

  if (combinedHighlights.length === 0) {
    return [
      { isHighlight: false, text: value, id: undefined, color: undefined },
    ];
  }

  const data = [
    {
      isHighlight: false,
      text: value.slice(0, combinedHighlights[0].start),
      id: combinedHighlights[0].id,
      color: combinedHighlights[0].color,
    },
  ];

  combinedHighlights.forEach(({ start, end, id, color }, idx) => {
    data.push({
      isHighlight: true,
      text: value.slice(start, end),
      id: id,
      color: color,
    });

    if (combinedHighlights[idx + 1]) {
      data.push({
        isHighlight: false,
        text: value.slice(end, combinedHighlights[idx + 1].start),
        id: combinedHighlights[idx + 1].id,
        color: combinedHighlights[idx + 1].color,
      });
    }
  });

  data.push({
    isHighlight: false,
    text: value.slice(
      combinedHighlights[combinedHighlights.length - 1].end,
      value.length
    ),
    id: combinedHighlights[combinedHighlights.length - 1].id,
    color: combinedHighlights[combinedHighlights.length - 1].color,
  });

  return data.filter(x => x.text);
});

const parseMarkdown = memoize(text => {
  const parts = [];
  let currentText = '';
  let isBold = false;
  let isItalic = false;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '*' || text[i] === '_') {
      if (currentText) {
        parts.push({ text: currentText, isBold, isItalic });
        currentText = '';
      }

      const marker = text[i];
      if (i + 1 < text.length && text[i + 1] === marker) {
        // Double markers for bold
        isBold = !isBold;
        i++;
      } else {
        // Single marker for italic
        isItalic = !isItalic;
      }
    } else {
      currentText += text[i];
    }
  }

  if (currentText) {
    parts.push({ text: currentText, isBold, isItalic });
  }

  return parts;
});

export const SelectableText = React.memo(
  ({
    onSelection,
    onHighlightPress,
    textValueProp,
    value,
    TextComponent,
    textComponentProps,
    prependToChild,
    selectable = false,
    ...props
  }) => {
    const TX = TextComponent || Text;
    const finalTextValueProp = textValueProp || 'children';

    const handleSelection = useCallback(
      event => {
        if (!selectable) return;
        const nativeEvent = event.nativeEvent;
        onSelection && onSelection(nativeEvent);
      },
      [selectable, onSelection]
    );

    const onHighlightPressNative = useMemo(() => {
      if (!onHighlightPress) return () => {};

      if (Platform.OS === 'ios') {
        return ({ nativeEvent: { clickedRangeStart, clickedRangeEnd } }) => {
          if (!props.highlights || props.highlights.length === 0) return;
          const mergedHighlights = combineHighlights(props.highlights);

          const highlightInRange = mergedHighlights.find(
            ({ start, end }) =>
              clickedRangeStart >= start - 1 && clickedRangeEnd <= end + 1
          );

          if (highlightInRange) {
            onHighlightPress(highlightInRange.id);
          }
        };
      }

      return onHighlightPress;
    }, [onHighlightPress, props.highlights]);

    const textValue = useMemo(() => {
      let result = value;

      if (TX === Text) {
        const parsedValue = parseMarkdown(value);

        result =
          props.highlights && props.highlights.length > 0
            ? mapHighlightsRanges(value, props.highlights).map(
                ({ id, isHighlight, text, color }) => {
                  const styledTexts = parseMarkdown(text).map((part, index) => (
                    <Text
                      key={`${id}-${index}-${part.text}`}
                      style={[
                        styles.default,
                        part.isBold && styles.bold,
                        part.isItalic && styles.italic,
                      ]}
                    >
                      {part.text}
                    </Text>
                  ));

                  const handlePress = e => {
                    if (selectable === false) {
                      return;
                    }
                    if (textComponentProps && textComponentProps.onPress)
                      textComponentProps.onPress(e);
                    if (isHighlight && onHighlightPress)
                      onHighlightPress(id ?? '');
                  };

                  const textStyle = [
                    styles.default,
                    isHighlight && {
                      backgroundColor: color ?? props.highlightColor,
                    },
                    textComponentProps?.style,
                  ];

                  return (
                    <Text
                      key={`${id}-${text}-${String(color)}`}
                      {...textComponentProps}
                      style={textStyle}
                      onPress={handlePress}
                    >
                      {styledTexts}
                    </Text>
                  );
                }
              )
            : parsedValue.map((part, index) => {
                const textStyle = [
                  styles.default,
                  part.isBold && styles.bold,
                  part.isItalic && styles.italic,
                  textComponentProps?.style,
                ];

                return (
                  <Text key={`text-${index}`} style={textStyle}>
                    {part.text}
                  </Text>
                );
              });

        if (props.appendToChildren) {
          result = [...result, props.appendToChildren];
        }

        if (prependToChild) {
          result = [prependToChild, ...result];
        }
      }

      return result;
    }, [
      value,
      props.highlights,
      props.highlightColor,
      props.appendToChildren,
      prependToChild,
      TX,
      textComponentProps,
      selectable,
      onHighlightPress,
    ]);

    const txProps = useMemo(
      () => ({
        [finalTextValueProp]: textValue,
        ...textComponentProps,
      }),
      [finalTextValueProp, textValue, textComponentProps]
    );

    const txStyle = useMemo(
      () => [styles.default, textComponentProps?.style],
      [textComponentProps?.style]
    );

    return (
      <RNSelectableText
        {...props}
        onHighlightPress={onHighlightPressNative}
        onSelection={handleSelection}
        selectable={selectable}
      >
        <TX {...txProps} style={txStyle} selectable={selectable} />
      </RNSelectableText>
    );
  }
);

const styles = StyleSheet.create({
  default: {
    fontFamily: 'Rasa_400Regular',
  },
  bold: {
    fontFamily: 'Rasa_700Bold',
  },
  italic: {
    fontFamily: 'Rasa_300Light_Italic',
  },
});
