const generateCheckinNotesQuestionAnswer = checkInNote => {
  const questions = checkInNote?.questions ?? [];
  const answers = checkInNote?.answers ?? [];
  if (!questions || !answers) return [];

  const length = Math.min(questions.length, answers.length);
  return Array.from({ length }, (_, i) => ({
    question: questions[i],
    answer: answers[i],
  }));
};

export default generateCheckinNotesQuestionAnswer;
