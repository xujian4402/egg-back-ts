'use strict';
const _ = require('lodash');

module.exports = (options, app) => {
  return async function token_parser(ctx, next) {
    // 网络请求的 referer header 不可设置。其格式固定为 https://servicewechat.com/{appid}/{version}/page-frame.html，
    // 其中 {appid} 为小程序的 appid，
    // {version} 为小程序的版本号，版本号为 0 表示为开发版、体验版以及审核版本，版本号为 devtools 表示为开发者工具，其余为正式版本
    const WEAPP_REFERER = /^https:\/\/servicewechat\.com\/([\w-.]+)\/([\w-.]+)\/page-frame\.html$/;

    const token_id = app.config.wxapp.token_id;

    const api_regexp = app.config.wxapp.api_regexp || WEAPP_REFERER; // 中间件需要识别的正则（字符串、表达式、数组）

    const app_token = {};
    const token = ctx.header[token_id];
    const referer = ctx.header['referer'];
    const matched = api_regexp.exec(referer);
    if (matched) {
      app_token.appid = matched[1];
      app_token.version = matched[2];
    } else {
      if (options.strict_mode) {
        ctx.body = {
          ret: 'ERROR',
          data: 'INVALID-REQUEST',
          msg: '请求来源不明'
        };
        ctx.status = 200;
      }
    }

    if (!token) {
      const cookies = ctx.cookies || {};
      app_token.token =
        cookies[token_id] || ctx.request.body.token || ctx.query.token;
    } else {
      app_token.token = token;
    }
    if (!app_token.token) {
      // 没有指定token直接跳过
      ctx.app_token = app_token;
      await next();
    }
    const key_id = `${app.config.wxapp.prefix}${app_token.token}`;
    const tokenData = await ctx.helper.getToken(key_id);
    if (tokenData) {
      ctx.app_token = _.merge({}, app_token, tokenData);
      await next();
    } else {
      ctx.body = {
        ret: 'ERROR',
        data: 'INVALID-TOKEN',
        msg: 'token无效'
      };
      ctx.status = 200;
    }
  };
};
