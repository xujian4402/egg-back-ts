/**
 * Created by lintry on 16/6/1.
 */

'use strict';

const _ = require('lodash'),
  url_utils = require('url'),
  crypto_utils = require('kml-crypto-utils'),
  apiSdk = require('kml-api-request')(),
  xml2js = require('xml2js')
;

/**
 * 微信模块初始化，对应一个公众号
 */
function WxApi(config) {
  if (!(this instanceof WxApi)) {
    return new WxApi(config);
  }

  const wx_config = config || {},
    api_token = wx_config.api_token, // api访问token
    API_HOST = wx_config.api_host, // api访问host
    wx_app = wx_config.wx_app, // 微信公众号
    authorizer_appid = wx_config.authorizer_appid; // 授权给第三方平台的微信公众号

  /**
     * 生成参数签名
     * @param params
     * @return {{timestamp: number, nonce: string, sign: *}}
     */
  this.getSignature = function (params) {
        if (api_token) {
            let timestamp = Date.now(), nonce = (~~(Math.random() * 1000000000)).toString(36);
            return _.merge({}, params, crypto_utils.signature(api_token, timestamp, nonce));
        } 
            return params;
        
    };

  /**
     * 获取微信接口地址
     * @param mod
     * @param cmd
     * @param route api地址的路由，默认api
     * @return {Promise.<string>|*}
     */
  this.getApiURI = function(mod, cmd, route) {
    const api = route || 'api';
    return url_utils.resolve(API_HOST, `${api}/${mod}/${cmd}/${wx_app}`) + (authorizer_appid ? '/' + authorizer_appid : '');
  };

  /**
     * json转成xml
     * @param obj
     */
  this.buildXml = function(obj) {
    const builder = new xml2js.Builder({
      allowSurrogateChars: true
    });
    return builder.buildObject({ xml: obj });
  };

  /**
     * 设定请求方法
     */
  this.request = apiSdk.get;

  /**
     * 设定发送方法
     */
  this.send = apiSdk.post;
  return this;
}

/**
 * 将对象合并到prototype上
 * @param {Object} obj 要合并的对象
 */
WxApi.mixin = function(obj) {
  for (const key in obj) {
    if (WxApi.prototype.hasOwnProperty(key)) {
      throw new Error('Don\'t allow override existed prototype method. method: ' + key);
    }
    WxApi.prototype[key] = obj[key];
  }
};

WxApi.mixin(require('./wx_api_interface'));

module.exports = WxApi;
