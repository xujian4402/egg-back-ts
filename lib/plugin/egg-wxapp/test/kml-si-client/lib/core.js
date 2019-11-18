'use strict';
/**
 * Created by lintry on 2017/3/7.
 */

const Promise = require('bluebird'),
  chalk = require('chalk'),
  url_utils = require('url'),
  querystring = require('querystring'),
  StageLib = require('kml-express-stage-lib'),
  lib_utils = StageLib.LibUtils,
  api_request = require('kml-api-request')()
;

const AccessToken = require('./access_token');

/**
 * 根据id和secret获取token
 * @param config 配置
 * @param getToken 获取token方法
 * @param saveToken 保存token方法
 * @param ghost 强制隐身模式，存储token在内存
 * @class
 */
const API = function(config, getToken, saveToken, ghost) {
  if (!this instanceof API) {
    return new API(config, getToken, saveToken);
  }

  const _config = config || {};
  this.setIdentity(_config.identity);
  this.setEndpoint(_config.endpoint);
  this.getToken = (!ghost && getToken) || getTokenFromMemory;
  this.saveToken = (!ghost && saveToken) || saveTokenToMemory;

  if (!ghost && this.saveToken === saveTokenToMemory) {
    console.warn(chalk.magenta("ALERT: It isn't a good idea to save token in memory. Persist it in file, redis or database for cluster!"));
  }

  /**
   * 默认的读取token方法
   * @return {Promise.<AccessToken>}
   */
  function getTokenFromMemory() {
    return Promise.resolve(this.store);
  }

  /**
   * 默认的存储token方法
   * @param token
   * @return {Promise.<AccessToken>}
   */
  function saveTokenToMemory(token) {
    this.store = token;
    console.warn(chalk.yellow('token saved in memory.'));
    return Promise.resolve(token);
  }

};

/**
 * 设置获取token的身份识别参数
 * 通常包含了{app_id, app_secret}, {client_id, client_secret}
 * @param identity
 */
API.prototype.setIdentity = function(identity) {
  if (!identity) {
    throw new Error('wrong identity config');
  }
  this.identity = identity;
};

/**
 * 添加身份识别参数
 * @param key{String|Object} 参数键或k/v对象
 * @param value{String|null} 参数值，key为object时无效
 */
API.prototype.addIdentity = function(key, value) {
  if (typeof key === 'object') {
    for (const k in key) {
      if (key.hasOwnProperty(k)) {
        this.identity[k] = key[k];
      }
    }
  } else {
    this.identity[key] = value;
  }
};

/**
 * 设置endpoint
 * endpoint.host: endpoint的域名主机
 * endpoint.access_token: 请求access_token的路径
 * @param endpoint
 */
API.prototype.setEndpoint = function(endpoint) {
  if (!endpoint || !endpoint.host || !endpoint.accessToken) {
    throw new Error('wrong endpoint config!');
  }
  this.endpoint = endpoint;
};

/**
 * 获取服务端的access_token
 * @return {Promise.<AccessToken>}
 */
API.prototype.getAccessToken = function() {
  const me = this;
  const url = me.getUrl(me.endpoint.accessToken + '?grant_type=all&' + querystring.stringify(me.identity));
  return api_request.get(url)
    .then(function(result) {
      if (result && result.ret === 'OK') {
        const content = result.content;
        const access_token = new AccessToken(content.access_token, content.expires_time, content.expires_in);

        return me.saveToken(access_token)
          .then(function(access_token) {
            me.store = access_token;
            return access_token;
          });
      }
      throw result;

    });
};

/**
 * 获取请求url
 * @param remote_method
 * @return {*}
 */
API.prototype.getUrl = function(remote_method) {
  return url_utils.resolve(this.endpoint.host, remote_method);
};

/**
 * 访问api前准备相应的access_token
 * @param remote_method
 * @return {Promise.<url>}
 */
API.prototype.preAccessToken = function(remote_method) {
  const me = this;
  return (me.getToken()
    .then(function(token) {
      let access_token;
      if (token && (access_token = new AccessToken(token.access_token, token.expires_time, token.expires_in)).isValid()) {
        me.store = access_token;
        return access_token;
      }
      // token失效，需要抓取
      console.warn(chalk.yellow('token失效，重新抓取'));
      return me.getAccessToken();
    })
    .catch(function(e) {
      console.warn(chalk.styles.yellow.open, 'getToken失败，重新抓取', StageLib.SerialError(e), chalk.styles.yellow.close);
      return me.getAccessToken();
    }))
    .then(function(access_token) {
      const to_url = url_utils.parse(me.getUrl(remote_method));
      if (!to_url.search) {
        to_url.search = 'access_token=' + access_token.access_token;
      } else {
        to_url.search += '&access_token=' + access_token.access_token;
      }
      return to_url.format();
    });
};

/**
 * 直接访问api
 * @param remote_method
 * @param data
 * @param options
 * @return {Promise.<Result>}
 */
API.prototype.requestDirect = function(remote_method, data, options) {
  return api_request.get(this.getUrl(remote_method), data, options);
};

/**
 * 直接向api发送数据
 * @param remote_method
 * @param data
 * @param options
 * @return {Promise.<Result>}
 */
API.prototype.sendDirect = function(remote_method, data, options) {
  return api_request.post(this.getUrl(remote_method), data, options);
};

/**
 * 需要预先获取access_token的请求api
 * @param remote_method
 * @param data
 * @param options
 * @return {Promise.<Result>}
 */
API.prototype.request = function(remote_method, data, options) {
  return this._do_request('get', remote_method, data, options);
};

/**
 * 需要预先获取access_token的发送数据到api
 * @param remote_method
 * @param data
 * @param options
 * @return {Promise.<Result>}
 */
API.prototype.send = function(remote_method, data, options) {
  return this._do_request('post', remote_method, data, options);
};

/**
 * 需要预先获取access_token的发送数据到api，如果access_token失效则重试一次
 * @param type get/post类型
 * @param remote_method 远程api接口方法
 * @param data 参数
 * @param options axios相关配置
 * @return {Promise.<Result>}
 */
API.prototype._do_request = function(type, remote_method, data, options) {
  const me = this;
  return me.preAccessToken(remote_method)
    .then(function(url) {
      return api_request[type](url, data, options);
    })
    .then(function(result) {
      if (result && result.status === 401 && (result.data || {}).err === -1001) {
        // access_token失效,重新获取
        console.log(chalk.cyan('retry to get access_token'));
        return me.getAccessToken()
          .then(function() {
            // 重新再请求api
            return me.preAccessToken(remote_method)
              .then(function(url) {
                return api_request[type](url, data, options);
              });
          });

      }
      return result;

    });
};

/**
 * 合并对象属性到当前api的实例
 * @return {AppAPI}
 */
API.prototype.mixin = function(...source) {
  return lib_utils.mixin.apply(null, [].concat(this, source));
};

/**
 * 合并对象属性到当前API.prototype
 * @return {AppAPI|Object}
 */
API.mixin = function(...source) {
  return lib_utils.mixin.apply(null, [].concat(API.prototype, source));
};

/**
 * 扩展目标类的prototype到API.prototype
 * @return {AppAPI|Object}
 */
API.extend = function() {
  const me = API.prototype;
  Array.prototype.slice.call(arguments, 0).forEach(function(src) {
    src.prototype && API.mixin(src.prototype);
  });

  return me;
};

/**
 * 根据api封装方法
 * @param targetApi 目标api
 * @param fn
 * @param wrap_method
 * @param remote_method
 * @param override
 * @return {Function}
 */
API.wrap = function(targetApi, fn, wrap_method, remote_method, override) {
  if (targetApi.prototype[wrap_method]) {
    console.warn(chalk.yellow(`${wrap_method} is exists in API`));
    if (!override) {
      console.warn(chalk.magenta('it\'s ignored'));
      return targetApi.prototype[wrap_method];
    }
  }

  targetApi.prototype[wrap_method] = function(data, options) {
    return Promise.resolve(this[fn] && this[fn](remote_method, data, options));
  };

  // 返回封装后的方法
  return targetApi.prototype[wrap_method];
};

module.exports = API;
