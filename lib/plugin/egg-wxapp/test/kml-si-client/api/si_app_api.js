/**
 * Created by lintry on 2017/3/8.
 */

const _ = require('lodash'),
  API = require('../lib/core');

const TAG = 'app_token';

/**
 * app访问si接口定义
 */
class AppAPI extends API {
  constructor(app_id, app_secret, host, getToken, saveToken, ghost) {
    let config = {
      identity: { app_id, app_secret },
      endpoint: { host: '', accessToken: 'si/auth/token' }
    };

    if (typeof host === 'string') {
      config.endpoint.host = host;
    } else if (typeof host === 'object') {
      config = host;
    } else {
      throw new Error('wrong constructor params, CONFIRM: app_id, app_secret, host[, getToken, saveToken]');
    }
    super(config, getToken, saveToken, ghost);
  }
}

AppAPI.TAG = TAG;

/**
 * ping si-server app, 不自动获取token
 * @type {Function}
 */
AppAPI.prototype.ping = AppAPI.wrap(AppAPI, 'requestDirect', 'ping', 'si/app/ping');

/**
 * 获取si-server的版本
 * @type {Function}
 */
AppAPI.prototype.version = AppAPI.wrap(AppAPI, 'request', 'version', 'si/app/version');

/**
 * 注册一个新app，不需要token
 * @type {Function}
 */
AppAPI.prototype.register = AppAPI.wrap(AppAPI, 'sendDirect', 'register', 'si/app/register');

/**
 * 修改当前app信息
 * @type {Function}
 */
AppAPI.prototype.update = AppAPI.wrap(AppAPI, 'send', 'update', 'si/app/update');

/**
 * 重置当前app的配置
 * @type {Function}
 */
AppAPI.prototype.reset = AppAPI.wrap(AppAPI, 'send', 'reset', 'si/app/reset');

/**
 * 验证当前app的签名
 * @type {Function}
 */
AppAPI.prototype.verify = AppAPI.wrap(AppAPI, 'send', 'verify', 'si/auth/verify');

/**
 * 验证其他app的签名
 * @type {Function}
 */
AppAPI.prototype.identify = AppAPI.wrap(AppAPI, 'send', 'identify', 'si/auth/identify');

module.exports = AppAPI;
