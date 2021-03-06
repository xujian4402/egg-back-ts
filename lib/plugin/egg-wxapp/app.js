'use strict';
const assert = require('assert');
const wxapp = require('./lib/wxapi');

module.exports = app => {
  app.config.coreMiddleware.push('weappParams');
  app.config.coreMiddleware.push('tokenParser');
  const name = app.config.wxapp.Redis_Name;
  const redis = name ? app.redis.get(name) : app.redis;
  assert(redis, `redis instance [${name}] not exists`);
  app.coreLogger.info('[egg-wxapp] config:');
  app.wxappRedis = redis;
  if (app.config.wxapp.app) wxapp(app);
};

