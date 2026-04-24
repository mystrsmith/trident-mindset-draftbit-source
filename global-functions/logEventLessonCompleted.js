import * as CommonPackages from '../custom-files/CommonPackages';

const logEventLessonCompleted = (lessonName, lessonCompleted) => {
  try {
    const appsFlyer = CommonPackages?.appsFlyer;
    appsFlyer.logEvent(
      'lesson_completed',
      {
        lesson_name: lessonName,
        lesson_completed: lessonCompleted,
      },
      res => {},
      err => {
        console.error(err);
      }
    );
  } catch (error) {
    console.error('Error logEventLessonCompleted : ', lessonName);
  }
};

export default logEventLessonCompleted;
