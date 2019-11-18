/**
 * Created by lintry on 2017/3/8.
 */
"use strict";

/**
 * 定义access token
 * @param access_token token
 * @param expires_time 截止时间戳
 * @param expires_in 有效时间(s)
 * @return {AccessToken}
 * @constructor
 */
const AccessToken = function (access_token, expires_time, expires_in) {
  if (!(this instanceof AccessToken)) {
    return new AccessToken(access_token, expires_time, expires_in)
  }

  this.access_token = access_token;
  this.expires_time = expires_time;
  this.expires_in = expires_in;

};

/**
 * 检查当前token是否有效
 * @return {boolean}
 */
AccessToken.prototype.isValid = function () {
  return !!this.access_token && (Date.now() < this.expires_time);
};


module.exports = AccessToken;
