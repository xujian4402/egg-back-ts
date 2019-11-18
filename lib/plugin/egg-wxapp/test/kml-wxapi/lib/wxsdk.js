/**
 * Created by lintry on 2017/7/10.
 */

'use strict';

const _ = require('lodash'),
  querystring = require('querystring'),
  crypto_utils = require('kml-crypto-utils'),
  API = require('kml-si-client').CoreAPI;

const TAG = 'wx4api_client_token';

/**
 * wx4api客户端sdk，一个客户端对应多个公众号
 */
class WXSdk extends API {
  constructor(client_id, client_secret, host, getToken, saveToken, ghost) {
    let config = {
      identity: { client_id, client_secret },
      endpoint: { host: '', accessToken: 'si/app/token' }
    };

    if (typeof host === 'string') {
      config.endpoint.host = host;
    } else if (typeof host === 'object') {
      config = host;
    } else {
      throw new Error('wrong constructor params, CONFIRM: client_id, client_secret, host[, getToken, saveToken]');
    }
    super(config, getToken, saveToken, ghost);

    /**
     * 生成参数签名
     * @param params
     * @param api_token
     * @return {{timestamp: number, nonce: string, sign: *}}
     */
    this.getSignature = function(params, api_token) {
      if (api_token) {
        const timestamp = Date.now(),
          nonce = (~~(Math.random() * 1000000000)).toString(36);
        return _.merge({}, params, crypto_utils.signature(api_token, timestamp, nonce));
      }
      return params;

    };

    /**
         * 设置当前使用的微信配置
         * @param wx_app
         * @param authorizer_appid
         */
    this.use = function(wx_app, authorizer_appid) {
      this.wx_app = wx_app;
      this.authorizer_appid = authorizer_appid;
      return this;
    };

    /**
         * 创建API的地址格式
         * @param mod
         * @param cmd
         * @param route api地址的路由，默认spi
         * @return {string}
         */
    this.getApiURI = function(mod, cmd, route) {
      const spi = route || 'spi';
      if (!this.wx_app) {
        throw new Error('Please choose the WX_APP ID first.');
      }
      return `${spi}/${mod}/${cmd}/${this.wx_app}` + (this.authorizer_appid ? '/' + this.authorizer_appid : '');
    };
  }
}

WXSdk.TAG = TAG;

/**
 * 将对象合并到prototype上
 * @param {Object} obj 要合并的对象
 */
WXSdk.mixin = function(obj) {
  for (const key in obj) {
    if (WXSdk.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: ' + key);
    }
    WXSdk.prototype[key] = obj[key];
  }
};

WXSdk.mixin(require('./wx_api_interface'));

/**
 * 添加公众号参数
 * @param app
 * @return {Promise.<Result>|*}
 */
WXSdk.prototype.add = function(app) {
  return this.send('si/app/add', app);
};
/**
 * 保存公众号参数
 * @param app
 * @return {Promise.<Result>|*}
 */
WXSdk.prototype.save = function(app) {
  return this.send('si/app/save', app);
};
/**
 * 查看公众号
 * @param appid
 * @return {Promise.<Result>|*}
 */
WXSdk.prototype.info = function(appid) {
  return this.request('si/app/info', { appid });
};
/**
 * 公众号列表
 * @return {Promise.<Result>|*}
 */
WXSdk.prototype.list = function() {
  return this.request('si/app/list');
};

module.exports = WXSdk;
