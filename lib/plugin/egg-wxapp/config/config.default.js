'use strict';

/**
 * egg-wxapp default config
 * @member Config#wxapp
 * @property {String} SOME_KEY - some description
 */
exports.wxapp = {
  default: {},
  app: true,
  clients: {
    // 微信定义
    wechat: {
      type: 'wechat',
      api_host: 'http://localhost:3800/',
      wx_app: 'itomix',
      api_token: '',
      authorizer_appid: 'wxcdb0862dac3b38b1',
      client_id: 'a381f89d73804dfaa7cb869f9ba96302',
      client_secret:
      'b624c1370e0e9849a9e7ebb8e25734b5334756652e17b2c496694f42204ae068'
    },
    // 微信小程序
    weapp: {
      type: 'weapp',
      api_host: 'http://localhost:3800',
      wx_app: 'hotpot',
      api_token: 'C596B',
      authorizer_appid: '',
      watermark_ttl: 7200, // 敏感数据有效期(s)
      token_prefix: 'WXID', // token前缀
      token_ttl: 36000, // token有效期(s)
      share_prefix: 'WXSHARE', // 分享前缀
      share_ttl: 3600 * 48, // 分享有效期(s)
      werun_prefix: 'WERUN', // 分享前缀
      werun_ttl: 86400 * 30, // 分享有效期(s)
      strict_mode: true,
      formid_days: 7, // formid的有效天数
      silent_days: 5 // 长期未参与的提醒天数
    },
  },

  token_id: 'wx-token',
  api_regexp: '',

  // 平台相关
  we_plat_id_key: 'we-plat-id',
  plat_info: { plat_id: 'itomix' },
  // redis相关
  Redis_Name: 'wxToken',
  Redis_TTL: 7200
};
