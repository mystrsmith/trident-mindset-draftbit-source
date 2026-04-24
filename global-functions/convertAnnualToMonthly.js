const convertAnnualToMonthly = annualPrice => {
  let roundedAmount = Math.round(((annualPrice / 12) * 100) / 100);
  return roundedAmount.toLocaleString();
};

export default convertAnnualToMonthly;
