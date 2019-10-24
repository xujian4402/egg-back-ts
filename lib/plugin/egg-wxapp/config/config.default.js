'use strict';

/**
 * egg-wxapp default config
 * @member Config#wxapp
 * @property {String} SOME_KEY - some description
 */
exports.wxapp = {
  token_id: 'wx-token',
  api_regexp: '',
  strict_mode: '',
  prefix: 'WXID',

  Redis_Name: 'wxToken',
  TTL: 7200
};
// module.exports = () => {
//   const exports = {};

//   return exports;
// };
