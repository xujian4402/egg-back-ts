'use strict';
const crypto = require('crypto');

/**
 * 微信数据加解密模块
 */
class WXBizDataCrypt {
  constructor(appId, sessionKey) {
    if (!appId || !sessionKey) {
      throw new Error('appId/sessionKey can not be empty');
    }
    this.appId = appId;
    this.sessionKey = sessionKey;
  }

  /**
     * 解密数据
     * @param encryptedData base64编码密文
     * @param iv base64编码iv
     * @return {json} json对象
     */
  decryptData(encryptedData, iv) {

    let decoded;
    try {
      // base64 decode
      const sessionKey = Buffer.from(this.sessionKey, 'base64');
      iv = Buffer.from(iv, 'base64');

      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);

      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true);
      decoded = Buffer.concat([ decipher.update(encryptedData, 'base64'), decipher.final() ]);

      decoded = JSON.parse(decoded);

    } catch (err) {
      throw err;
    }

    if (decoded.watermark.appid !== this.appId) {
      throw new Error('Illegal watermark');
    }

    return decoded;
  }

  /**
     * 加密数据
     * @param json json数据对象
     * @param iv base64编码iv
     * @return {String} base64编码字符串
     */
  encryptData(json, iv) {
    const data = JSON.stringify(json);
    let encoded;
    try {
      // base64 decode
      const sessionKey = Buffer.from(this.sessionKey, 'base64');
      iv = Buffer.from(iv, 'base64');

      // 解密
      const cipher = crypto.createCipheriv('aes-128-cbc', sessionKey, iv);

      // 设置自动 padding 为 true，删除填充补位
      cipher.setAutoPadding(true);
      encoded = Buffer.concat([ cipher.update(data), cipher.final() ]).toString('base64');

    } catch (err) {
      throw err;
    }

    return encoded;
  }
}

module.exports = WXBizDataCrypt;
