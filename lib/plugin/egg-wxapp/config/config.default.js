'use strict';

/**
 * egg-wxapp default config
 * @member Config#wxapp
 * @property {String} SOME_KEY - some description
 */
exports.wxapp = {
  token_id: 'wx-token',
  api_regexp: '',
  strict_mode: true,
  prefix: 'WXID',

  we_plat_id_key: 'we-plat-id',
  plat_info: { plat_id: 'itomix' },

  Redis_Name: 'wxToken',
  TTL: 7200
};
