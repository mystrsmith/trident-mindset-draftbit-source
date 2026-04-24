import React, { useState, useRef } from 'react';
import {
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as XanoBackendApi from '../apis/XanoBackendApi';
import useWindowDimensions from '../utils/useWindowDimensions';

const Index = ({ noteId, title, setTitle, content, setContent, type }) => {
  const dimensions = useWindowDimensions();
  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const xanoBackendEditNotePATCH = XanoBackendApi.useEditNotePATCH();
  const [isScrolling, setIsScrolling] = useState(false);

  const onBlurInput = async inputType => {
    setIsScrolling(false);
    await xanoBackendEditNotePATCH.mutateAsync({
      note_id: noteId,
      title: title,
      content: content,
    });
  };

  const handleOnChangeText = (text, setter) => {
    setter(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={120}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="never"
        onScroll={() => setIsScrolling(true)}
        onMomentumScrollEnd={() => setIsScrolling(false)}
      >
        {type === 'my_note' && (
          <TextInput
            ref={titleInputRef}
            style={styles.titleInput}
            value={title}
            onChangeText={text => handleOnChangeText(text, setTitle)}
            placeholder="Title"
            placeholderTextColor={styles.placeholder.color}
            returnKeyType="next"
            onSubmitEditing={() => contentInputRef.current?.focus()}
            onBlur={() => onBlurInput('title')}
            editable={!isScrolling || titleInputRef.current?.isFocused()}
          />
        )}
        <TextInput
          ref={contentInputRef}
          style={styles.contentInput}
          value={content}
          onChangeText={text => handleOnChangeText(text, setContent)}
          placeholder="Put your note here"
          placeholderTextColor={styles.placeholder.color}
          multiline
          textAlignVertical="top"
          onBlur={() => onBlurInput('content')}
          editable={!isScrolling || contentInputRef.current?.isFocused()}
          scrollEnabled={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  titleInput: {
    fontFamily: 'Rasa_400Regular',
    fontSize: 35,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    paddingVertical: 8,
  },
  contentInput: {
    flex: 1,
    fontFamily: 'Rasa_400Regular',
    fontSize: 20,
    color: '#ffffff',
    lineHeight: 24,
  },
  placeholder: {
    color: '#8e8e93',
  },
});

export { Index };
