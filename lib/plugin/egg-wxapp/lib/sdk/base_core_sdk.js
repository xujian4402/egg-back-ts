'use strict';
const _ = require('lodash');
const crypto_utils = require('kml-crypto-utils');
const url_utils = require('url');
const xml2js = require('xml2js');
const querystring = require('querystring');
const AccessToken = require('../access_token');

class API {
  constructor(config) {
    const { identity, endpoint } = config;
    this.api_request = require('kml-api-request')();
    this.setEndpoint(endpoint);
    this.setIdentity(identity);
  }

  setIdentity(identity) {
    if (!identity) {
      throw new Error('wrong identity config');
    }
    this.identity = identity;
  }

  setEndpoint(endpoint) {
    if (!endpoint || !endpoint.host || !endpoint.accessToken) {
      throw new Error('wrong endpoint config!');
    }
    this.endpoint = endpoint;
  }
  /**
   * 添加身份识别参数
   *
   * @param {*} key 参数键或K/V对象
   * @param {*} value 参数值，key为object时无效
   * @memberof API
   */
  addIdentity(key, value) {
    if (typeof key === 'object') {
      for (const k in key) {
        if (key.hasOwnProperty(k)) {
          this.identity[k] = key[k];
        }
      }
    } else {
      this.identity[key] = value;
    }
  }

  getUrl(remote_method) {
    return url_utils.resolve(this.endpoint.host, remote_method);
  }

  getAccessToken() {
    const url = this.getUrl(this.endpoint.accessToken + '?grant_type=all&' + querystring.stringify(this.identity));
    return this.api_request.get(url).then(result => {
      if (result && result.ret === 'OK') {
        const content = result.content;
        const access_token = new AccessToken(content.access_token, content.expires_time, content.expires_in);
        return access_token;
        // return this.saveToken(access_token)
        //   .then(function(access_token) {
        //     this.store = access_token;
        //     return access_token;
        //   });
      }
      throw result;
    });
  }
}

module.exports = API;
