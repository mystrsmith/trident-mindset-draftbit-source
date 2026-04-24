import React, { useState } from 'react';
import { View } from 'react-native';
import ProgressSteps, {
  Title,
  Content,
} from '@joaosousa/react-native-progress-steps';

export const Index = ({ step, quizQuestions }) => {
  if (quizQuestions === null || quizQuestions === undefined) {
    return null;
  }
  if (quizQuestions?.length === 0) {
    return null;
  }
  const stepsWithUniqueKeys = quizQuestions.map((item, index) => ({
    ...item,
    id: item.id != null ? `step-${item.id}-${index}` : index,
  }));

  return (
    <View style={{ height: 60 }}>
      <ProgressSteps
        orientation="horizontal"
        currentStep={step}
        steps={stepsWithUniqueKeys}
        colors={{
          title: {
            text: {
              normal: 'rgba(92, 180, 243, 0.35)',
              active: '#5CB4F3',
              completed: '#5CB4F3',
            },
          },
          marker: {
            text: {
              normal: 'rgba(92, 180, 243, 0.35)',
              active: '#5CB4F3',
              completed: 'white',
            },
            line: {
              normal: 'rgba(92, 180, 243, 0.35)',
              active: '#5CB4F3',
              completed: '#5CB4F3',
            },
          },
        }}
      />
    </View>
  );
};
