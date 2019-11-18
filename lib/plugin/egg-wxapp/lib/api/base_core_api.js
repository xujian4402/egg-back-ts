'use strict';
const _ = require('lodash');
const crypto_utils = require('kml-crypto-utils');
const url_utils = require('url');
const xml2js = require('xml2js');
const apiSdk = require('kml-api-request')();

class API {
  constructor(config) {
    const { api_token, api_host, wx_app, authorizer_appid } = config;
    this.api_token = api_token;
    this.api_host = api_host;
    this.wx_app = wx_app;
    this.authorizer_appid = authorizer_appid;
    this.request = apiSdk.get;
    this.send = apiSdk.post;
  }

  getSignature(params) {
    if (this.api_token) {
      const timestamp = Date.now();
      // eslint-disable-next-line no-bitwise
      const nonce = (~~(Math.random() * 1000000000)).toString(36);
      return _.merge({}, params, crypto_utils.signature(this.api_token, timestamp, nonce));
    }
    return params;
  }

  getApiURI(mod, cmd, route) {
    const api = route || 'api';
    return url_utils.resolve(this.api_host, `${api}/${mod}/${cmd}/${this.wx_app}`) + (this.authorizer_appid ? '/' + this.authorizer_appid : '');
  }

  buildXml(obj) {
    const builder = new xml2js.Builder({
      allowSurrogateChars: true
    });
    return builder.buildObject({ xml: obj });
  }

}

module.exports = API;
