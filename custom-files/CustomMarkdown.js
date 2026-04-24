import React, { useMemo, useRef, useImperativeHandle } from 'react';
import { SelectableText } from './SelectableText';
import CustomSelectableTextIOS from './CustomSelectableTextIOS';
import { Platform, Text } from 'react-native';
import Markdown, { Renderer } from 'react-native-marked';
import * as XanoBackendApi from '../apis/XanoBackendApi.js';
import * as GlobalVariables from '../config/GlobalVariableContext';
import { useNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';

class CustomRenderer extends Renderer {
  constructor(onPressLink) {
    super();
    this.onPressLink = onPressLink;
  }

  text(text, _styles) {
    return (
      <Text key={this.getKey()} style={_styles} selectable={false}>
        {text}
      </Text>
    );
  }

  link(href, url, _styles) {
    return (
      <Text
        key={this.getKey()}
        style={_styles}
        selectable={false}
        onPress={() => {
          this.onPressLink(url);
        }}
      >
        {href}
      </Text>
    );
  }
}

const CustomMarkdownComponent = React.forwardRef(
  (
    {
      content = '',
      selectable = false,
      onSelectionHighlight = () => {},
      fontSize = 18,
      isScrolling = false,
    },
    ref
  ) => {
    const selectableTextRef = useRef(null);

    useImperativeHandle(ref, () => ({
      clearSelection: () => {
        if (selectableTextRef.current) {
          selectableTextRef.current.clearSelection();
        }
      },
    }));

    if (content === null || content === undefined) {
      return null;
    }

    const textComponentProps = useMemo(
      () => ({
        style: {
          color: 'white',
          fontSize: fontSize,
          lineHeight: fontSize * 1.5,
        },
        multiline: true,
        selectable: selectable,
      }),
      [fontSize]
    );

    const menuItems = useMemo(
      () => (selectable ? ['Save highlighted text', 'Cancel'] : []),
      []
    );

    if (selectable === true) {
      return Platform.OS === 'android' ? (
        <SelectableText
          value={content}
          textComponentProps={textComponentProps}
          menuItems={menuItems}
          onSelection={onSelectionHighlight}
          selectable={!isScrolling}
        />
      ) : (
        <CustomSelectableTextIOS
          ref={selectableTextRef}
          textComponentProps={textComponentProps}
          value={content}
          onSelection={onSelectionHighlight}
        />
      );
    }

    const onPressLink = async url => {
      console.log('onPressLink', url);
      try {
        Linking.openURL(url);
      } catch (error) {
        console.error('Error opening URL:', error);
      }
    };

    const renderer = useMemo(() => new CustomRenderer(onPressLink), []);

    const memoizedMarkdown = useMemo(
      () => (
        <Markdown
          value={content}
          flatListProps={{
            initialNumToRender: 8,
            contentContainerStyle: {
              backgroundColor: 'rgb(0, 15, 82)',
            },
            scrollEnabled: false,
          }}
          renderer={renderer}
          styles={{
            em: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            strong: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_700Bold',
            },
            strikethrough: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            text: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            link: {
              color: '#4A9EFF',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular_Italic',
            },
            h1: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            h2: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            h3: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            h4: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            h5: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            h6: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            codespan: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
            li: {
              color: 'white',
              fontSize: 18,
              lineHeight: 25,
              fontFamily: 'Rasa_400Regular',
            },
          }}
        />
      ),
      [content, renderer, fontSize]
    );

    const styles = {
      paragraph: {
        fontSize: fontSize,
        color: '#fff',
        marginBottom: 16,
        lineHeight: fontSize * 1.5,
      },
      heading1: {
        fontSize: fontSize * 1.5,
      },
      heading2: {
        fontSize: fontSize * 1.3,
      },
    };

    return memoizedMarkdown;
  }
);

export const Component = React.memo(CustomMarkdownComponent);

// import React, { useMemo } from 'react';
// import { SelectableText } from './SelectableText';
// import Markdown, { Renderer } from 'react-native-marked';
// import { Text } from 'react-native';
// import * as XanoBackendApi from '../apis/XanoBackendApi.js';
// import * as GlobalVariables from '../config/GlobalVariableContext';
// import { useNavigation } from '@react-navigation/native';
// import * as Linking from 'expo-linking';

// class CustomRenderer extends Renderer {
//   constructor(onPressLink) {
//     super();
//     this.onPressLink = onPressLink;
//   }

//   text(text, _styles) {
//     return (
//       <Text key={this.getKey()} style={_styles} selectable={false}>
//         {text}
//       </Text>
//     );
//   }

//   link(href, url, _styles) {
//     return (
//       <Text
//         key={this.getKey()}
//         style={_styles}
//         selectable={false}
//         onPress={() => {
//           this.onPressLink(url);
//         }}
//       >
//         {href}
//       </Text>
//     );
//   }
// }

// export const Component = React.memo(
//   ({
//     content = '',
//     selectable = false,
//     onSelectionHighlight = () => {},
//     fontSize = 18,
//     isScrolling = false,
//   }) => {
//     if (content === null || content === undefined) {
//       return null;
//     }

//     const textComponentProps = useMemo(
//       () => ({
//         style: {
//           color: 'white',
//           fontSize: fontSize,
//           lineHeight: fontSize * 1.5,
//         },
//         multiline: true,
//         selectable: selectable,
//       }),
//       [fontSize]
//     );

//     const menuItems = useMemo(
//       () => (selectable ? ['Save highlighted text', 'Cancel'] : []),
//       []
//     );

//     if (selectable === true) {
//       return (
//         <SelectableText
//           value={content}
//           textComponentProps={textComponentProps}
//           menuItems={menuItems}
//           onSelection={onSelectionHighlight}
//           selectable={!isScrolling}
//         />
//       );
//     }

//     const onPressLink = async url => {
//       console.log('onPressLink', url);
//       try {
//         Linking.openURL(url);
//       } catch (error) {
//         console.error('Error opening URL:', error);
//       }
//     };

//     const renderer = useMemo(() => new CustomRenderer(onPressLink), []);

//     const memoizedMarkdown = useMemo(
//       () => (
//         <Markdown
//           value={content}
//           flatListProps={{
//             initialNumToRender: 8,
//             contentContainerStyle: {
//               backgroundColor: 'rgb(0, 15, 82)',
//             },
//             scrollEnabled: false,
//           }}
//           renderer={renderer}
//           styles={{
//             em: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             strong: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_700Bold',
//             },
//             strikethrough: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             text: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             link: {
//               color: '#4A9EFF',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular_Italic',
//             },
//             h1: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             h2: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             h3: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             h4: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             h5: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             h6: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             codespan: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//             li: {
//               color: 'white',
//               fontSize: 18,
//               lineHeight: 25,
//               fontFamily: 'Rasa_400Regular',
//             },
//           }}
//         />
//       ),
//       [content, renderer, fontSize]
//     );

//     const styles = {
//       paragraph: {
//         fontSize: fontSize,
//         color: '#fff',
//         marginBottom: 16,
//         lineHeight: fontSize * 1.5,
//       },
//       heading1: {
//         fontSize: fontSize * 1.5,
//       },
//       heading2: {
//         fontSize: fontSize * 1.3,
//       },
//     };

//     return memoizedMarkdown;
//   },
//   (prevProps, nextProps) => {
//     return (
//       prevProps.content === nextProps.content &&
//       prevProps.fontSize === nextProps.fontSize &&
//       prevProps.isScrolling === nextProps.isScrolling
//     );
//   }
// );
