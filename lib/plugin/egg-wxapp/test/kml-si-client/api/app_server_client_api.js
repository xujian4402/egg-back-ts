/**
 * Created by lintry on 2017/3/8.
 */

const _ = require('lodash'),
  API = require('../lib/core');

const TAG = 'app_server_client_token';

/**
 * client访问app-server接口定义
 */
class AppServerClientAPI extends API {
  constructor(client_id, client_secret, host, getToken, saveToken, ghost) {
    let config = {
      identity: { client_id, client_secret },
      endpoint: { host: '', accessToken: 'api/auth/token' }
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

AppServerClientAPI.TAG = TAG;

/**
 * ping app-server
 * @type {Function}
 */
AppServerClientAPI.prototype.ping = AppServerClientAPI.wrap(AppServerClientAPI, 'request', 'ping', 'api/info/ping');

/**
 * 返回app-server的版本
 * @type {Function}
 */
AppServerClientAPI.prototype.version = AppServerClientAPI.wrap(AppServerClientAPI, 'request', 'version', 'api/info/version');

module.exports = AppServerClientAPI;
