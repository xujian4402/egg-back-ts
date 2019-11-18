/**
 * Created by lintry on 2017/3/8.
 */

"use strict";

/**
 * redis存储token
 * @param promisify_redis_client
 * @param redis_key
 * @constructor
 */
const RedisStore = function (promisify_redis_client, redis_key) {
  if (!(this instanceof RedisStore)) {
    return new RedisStore(promisify_redis_client);
  }

  if (!promisify_redis_client || !redis_key) {
    throw new Error('promisify_redis_client and redis_key can not be null');
  }

  const redis_client = promisify_redis_client;
  const key_id = redis_key;

  /**
   * 提取纯数据
   * @param obj
   */
  function pick(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * 读取token
   * @return {Promise.<AccessToken>}
   */
  this.getToken = function getTokenFromRedis() {
    return redis_client.hgetallAsync(key_id);
  };

  /**
   * 写入token
   * @param token
   */
  this.saveToken = function saveTokenToRedis(token) {
    return redis_client.hmsetAsync(key_id, pick(token))
      .then(function (result) {
        if ('OK' !== result) {
          throw new Error('save token error');
        } else {
          redis_client.expire(key_id, Math.floor((token.expires_time - Date.now())/1000));
          return token;
        }
      });
  };
};

module.exports = RedisStore;