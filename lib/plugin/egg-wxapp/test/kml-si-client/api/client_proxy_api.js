/**
 * Created by lintry on 2017/3/8.
 */

const _ = require('lodash'),
  API = require('../lib/core'),
  Promise = require('bluebird');

const TAG = 'client_proxy_token';

/**
 * app server的中间件代理client访问si接口定义
 * 不需要id和secret，access_token由外部传入
 */
class ClientProxyAPI extends API {
  constructor(host, access_token) {
    let config = {
      identity: { client_id: null, client_secret: null },
      endpoint: { host: '', accessToken: 'cli/auth/token' }
    };

    if (typeof host === 'string') {
      config.endpoint.host = host;
    } else if (typeof host === 'object') {
      config = host;
    } else {
      throw new Error('wrong constructor params, CONFIRM: client_id, client_secret, host[, getToken, saveToken]');
    }
    super(config, function() {
      return Promise.resolve({
        access_token,
        expires_in: Infinity,
        expires_time: Infinity
      });
    }, null, true);
  }
}

ClientProxyAPI.TAG = TAG;

/**
 * ping si-server，不自动获取token
 * @type {Function}
 */
ClientProxyAPI.prototype.ping = ClientProxyAPI.wrap(ClientProxyAPI, 'requestDirect', 'ping', 'cli/client/ping');

module.exports = ClientProxyAPI;
