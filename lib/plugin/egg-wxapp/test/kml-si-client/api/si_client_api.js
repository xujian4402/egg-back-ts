/**
 * Created by lintry on 2017/3/8.
 */

const _ = require('lodash'),
  API = require('../lib/core');

const TAG = 'client_token';

/**
 * client访问si接口定义
 */
class ClientAPI extends API {
  constructor(client_id, client_secret, host, getToken, saveToken, ghost) {
    let config = {
      identity: { client_id, client_secret },
      endpoint: { host: '', accessToken: 'cli/auth/token' }
    };

    if (typeof host === 'string') {
      config.endpoint.host = host;
    } else if (typeof host === 'object') {
      config = host;
    } else {
      throw new Error('wrong constructor params, CONFIRM: client_id, client_secret, host[, getToken, saveToken]');
    }
    super(config, getToken, saveToken, ghost);
  }
}

ClientAPI.TAG = TAG;

/**
 * ping si-server client, 不自动获取token
 * @type {Function}
 */
ClientAPI.prototype.ping = ClientAPI.wrap(ClientAPI, 'requestDirect', 'ping', 'cli/client/ping');

/**
 * 获取si-server版本
 * @type {Function}
 */
ClientAPI.prototype.version = ClientAPI.wrap(ClientAPI, 'request', 'version', 'cli/client/version');

/**
 * 注册一个新的client，不需要token
 * @type {Function}
 */
ClientAPI.prototype.register = ClientAPI.wrap(ClientAPI, 'sendDirect', 'register', 'cli/client/register');

/**
 * 修改当前client信息
 * @type {Function}
 */
ClientAPI.prototype.update = ClientAPI.wrap(ClientAPI, 'send', 'update', 'cli/client/update');

/**
 * 重置当前client配置
 * @type {Function}
 */
ClientAPI.prototype.reset = ClientAPI.wrap(ClientAPI, 'send', 'reset', 'cli/client/reset');

/**
 * 验证当前client的签名
 * @type {Function}
 */
ClientAPI.prototype.verify = ClientAPI.wrap(ClientAPI, 'send', 'verify', 'cli/auth/verify');

/**
 * 验证其他client的签名
 * @type {Function}
 */
ClientAPI.prototype.identify = ClientAPI.wrap(ClientAPI, 'send', 'identify', 'cli/auth/identify');

module.exports = ClientAPI;
