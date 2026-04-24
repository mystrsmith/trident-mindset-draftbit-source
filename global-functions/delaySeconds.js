const delaySeconds = async miliseconds => {
  return new Promise(res => setTimeout(res, miliseconds));
};

export default delaySeconds;
