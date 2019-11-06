'use strict';
const assert = require('assert');
const WXBizDataCrypt = require('kml-wxapi/lib/WXBizDataCrypt');

module.exports = app => {
  app.config.coreMiddleware.push('weappParams');
  app.config.coreMiddleware.push('tokenParser');
  const name = app.config.wxapp.Redis_Name;
  const redis = name ? app.redis.get(name) : app.redis;
  assert(redis, `redis instance [${name}] not exists`);

  app.WxappRedis = redis;
  app.Wxapi = require('kml-wxapi')(app.config.wxapp);
  app.WXBizDataCrypt = WXBizDataCrypt;
};
