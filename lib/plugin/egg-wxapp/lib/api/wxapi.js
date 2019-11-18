'use strict';

const API = require('./base_core_api');
const WXApiInterface = require('../interface/wx_api_interface');

class WxApi extends API {
  // eslint-disable-next-line no-useless-constructor
  constructor(config) {
    super(config);
  }
}

Object.assign(WxApi.prototype, WXApiInterface);

module.exports = WxApi;
