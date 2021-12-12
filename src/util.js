module.exports.pick = (obj, ...attr) => {
  return attr.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
};

module.exports.installTimerFunctions = (obj, opts) => {
  obj.setTimeoutFn = function(fn, time) {
    return setTimeout(() => {
      fn()
    }, time)
  };
  obj.clearTimeoutFn = function(timer) {
    clearTimeout(timer)
  };
};
