'use strict';
const _ = require('lodash');
const utils = require('../../lib/utils');
const crypto_utils = require('kml-crypto-utils');
const WXBizDataCrypt = require('kml-wxapi/lib/WXBizDataCrypt');

module.exports = {
  async kml_getToken(token) {
    return await this.app.wxappRedis.hgetall(token);
  },
  async kml_saveToken(key_id, token_data) {
    const ttl = this.app.config.wxapp.Redis_TTL;
    token_data.expires_time =
      token_data.expires_time || Date.now() + ttl * 1000;
    const token = utils.flatten(token_data);
    const result = await this.app.wxappRedis.hmset(
      key_id,
      JSON.parse(JSON.stringify(token))
    );
    if (result !== 'OK') {
      return {
        ret: 'ERROR',
        msg: 'save token error',
        data: ''
      };
    }
    await this.app.wxappRedis.expire(
      key_id,
      Math.floor((token_data.expires_time - Date.now()) / 1000)
    );
    return {
      ret: 'OK',
      msg: '成功！',
      data: token
    };
  },
  async kml_decrypt(appid, session_key, encryptedData, iv) {
    let content;
    try {
      const decoder = new WXBizDataCrypt(appid, session_key);
      content = decoder.decryptData(encryptedData, iv);
    } catch (error) {
      this.app.coreLogger.error('解码错误', error, encryptedData, iv);
      throw new Error('数据验证失败');
    }

    // 检查水印中敏感数据获取时间戳
    if (
      Date.now() / 1000 - content.watermark.timestamp >
      this.app.config.wxapp.watermark_ttl
    ) {
      throw new Error('数据过时');
    }

    return content;
  },
  async kml_check(app_token) {
    const { token, openid, session_key } = app_token || {};

    if (!token || !openid || !session_key) {
      return;
    }
    this.app.logger.info({ token, openid, session_key });
    return true;
  },
  async kml_login(app_token, body) {
    const { appid, version } = app_token;
    const { code, encryptedData, iv, signature, rawData } = body;
    const result = await this.app.Wxapi.jscode2session(code);
    if (result && result.ret === 'OK') {
      const { openid, session_key, unionid } = result.content;
      const token = crypto_utils.UUID();

      // 验证签名
      const sign = crypto_utils.SHA1(rawData + session_key);
      if (sign !== signature) {
        this.app.coreLogger.error(
          '用户信息签名错误',
          sign,
          signature,
          token,
          rawData + session_key
        );
        throw new Error('用户信息签名错误');
      }

      // 解析用户密文
      let content;
      try {
        content = await this.decrypt(appid, session_key, encryptedData, iv);
      } catch (error) {
        this.app.coreLogger.error('解析用户密文错误', error);
        throw new Error('解析用户密文错误');
      }

      _.merge(content, { token, openid, session_key, unionid, version });

      // 更新app_token，便于外部login方法调用后即时获取用户信息
      _.merge(app_token, content);

      const key_id = `${this.app.config.wxapp.prefix}${app_token.token}`;
      try {
        await this.saveToken(key_id, content);
      } catch (error) {
        this.app.coreLogger.error('token 保存失败', error);
        throw new Error('token 保存失败');
      }
      return { token };
    }
    throw new Error('token is error');
  }
};
