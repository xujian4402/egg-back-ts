'use strict';

exports.flatten = object => {
  const map = {};
  Object.keys(object).forEach(k => {
    const obj = object[k],
      type = typeof obj;
    if (type.match(/object|function/)) {
      map[k] = JSON.stringify(obj);
    } else {
      map[k] = obj;
    }
  });

  return map;
};
