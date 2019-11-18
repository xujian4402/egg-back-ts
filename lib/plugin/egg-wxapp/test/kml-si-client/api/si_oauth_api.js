/**
 * Created by lintry on 2017/3/8.
 */

const _ = require('lodash'),
  API = require('../lib/core');

const TAG = 'oauth_token';

/**
 * oauth通过si授权接口定义
 */
class OAuthAPI extends API {
  constructor(client_id, client_secret, host, getToken, saveToken, ghost) {
    let config = {
      identity: { client_id, client_secret, code: 'CODE' },
      endpoint: { host: '', accessToken: 'oa/oauth/token' }
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

OAuthAPI.TAG = TAG;

/**
 * 提交授权，不需要token
 * @return {Promise.<Result>}
 */
OAuthAPI.prototype.authorize = function(oauth) {
  return this.sendDirect('oa/oauth/authorize', oauth);
};

/**
 * 根据access_token获取用户信息
 * @param access_token
 * @return {Promise.<Result>}
 */
OAuthAPI.prototype.user = function(access_token) {
  if (access_token) {
    return this.requestDirect('oa/oauth/user', {access_token: access_token});
  } 
    return this.request('oa/oauth/user');
  
};

module.exports = OAuthAPI;
