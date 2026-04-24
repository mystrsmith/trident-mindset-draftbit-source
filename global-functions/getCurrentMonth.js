const getCurrentMonth = () => {
  const today = new Date();
  let month = today.getMonth() + 1;
  return month;
};

export default getCurrentMonth;
