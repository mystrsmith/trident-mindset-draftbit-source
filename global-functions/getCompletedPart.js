const getCompletedPart = (completedParts, part) => {
  const foundResult = completedParts?.find(item => item?.part === part);
  return foundResult;
};

export default getCompletedPart;
