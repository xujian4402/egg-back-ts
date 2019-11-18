'use strict';
/**
 * 微信小程序接口传递业务身份
 * Created by lintry on 2018/4/25.
 */

module.exports = (options, app) => {
  return async function weapp_params(ctx, next) {
    const plat_id = ctx.header[app.config.wxappApi.we_plat_id_key] || app.config.wxappApi.plat_info.plat_id; // 当前小程序的商户
    ctx.app_identity = { plat_id };
    await next();
  };
};
