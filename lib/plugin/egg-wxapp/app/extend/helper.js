'use strict';
const utils = require('../../lib/utils');

module.exports = {
  async getToken(token) {
    return await this.app.WxappRedis.hgetall(token);
  },
  async saveToken(key_id, token_data) {
    const ttl = this.app.config.wxapp.TTL;
    token_data.expires_time =
      token_data.expires_time || Date.now() + ttl * 1000;
    const token = utils.flatten(token_data);
    const result = await this.app.WxappRedis.hmset(
      key_id,
      JSON.parse(JSON.stringify(token))
    );
    if (result !== 'OK') {
      throw new Error('save token error');
    } else {
      await this.app.WxappRedis.expire(
        key_id,
        Math.floor((token_data.expires_time - Date.now()) / 1000)
      );
      return token;
    }
  },
  async check(ctx, app_token) {
    const { token, openid, session_key } = app_token || {};

    if (!token || !openid || !session_key) {
      ctx.body = {
        ret: 'ERROR',
        data: '',
        msg: 'token is not found'
      };
      ctx.status = 200;
    }
    this.app.logger.info({ token, openid, session_key });
    ctx.body = {
      ret: 'OK',
      data: 'token',
      msg: '成功！'
    };
    ctx.status = 200;
  }
};
