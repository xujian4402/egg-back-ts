'use strict';
const assert = require('assert');
const WxApi = require('./lib/wxapi');

module.exports = app => {
  app.config.coreMiddleware.push('weappParams');
  app.config.coreMiddleware.push('tokenParser');
  const name = app.config.wxappApi.Redis_Name;
  const redis = name ? app.redis.get(name) : app.redis;
  assert(redis, `redis instance [${name}] not exists`);
  app.wxappRedis = redis;
  app.wxapi = new WxApi(app.config.wxappApi);
};

