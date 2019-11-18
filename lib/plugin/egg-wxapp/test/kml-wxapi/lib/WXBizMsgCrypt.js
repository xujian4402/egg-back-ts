const crypto = require('crypto')

const BLOCK_SIZE = 32

const AESException = {
    ValidateSignatureError: "签名验证错误",
    ParseXmlError: "xml解析失败",
    ComputeSignatureError: "sha加密生成签名失败",
    IllegalAesKey: "SymmetricKey非法",
    ValidateAppidError: "appid校验失败",
    EncryptAESError: "aes加密失败",
    DecryptAESError: "aes解密失败",
    IllegalBuffer: "解密后得到的buffer非法",
    EncodeBase64Error: "base64加密错误",
    DecodeBase64Error: "base64解密错误",
    GenReturnXmlError: "xml生成失败"
}

const PKCS7Encoder = {
    /**
     * 获得对明文进行补位填充的字节.
     * @param text
     * @return {Buffer}
     */
    encode (text) {
        let textLength = text.length;
        //计算需要填充的位数
        let amountToPad = BLOCK_SIZE - (textLength % BLOCK_SIZE);

        let result = Buffer.alloc(amountToPad).fill(amountToPad);

        return Buffer.concat([text, result]);
    },

    /**
     * 删除解密后明文的补位字符
     * @param text
     * @return {*}
     */
    decode (text) {
        let pad = text[text.length - 1];

        if (pad < 1 || pad > 32) {
            pad = 0;
        }

        return text.slice(0, text.length - pad);
    }
}

/**
 * 微信消息加解密模块
 */
class WXBizMsgCrypt {
    /**
     * 初始化
     * @param token 从微信公众平台的开发者设置获取
     * @param encodingAESKey 从微信公众平台的开发者设置获取
     * @param id 公众号appid或企业号corpid
     */
    constructor (token, encodingAESKey, id) {
        if (!token || !encodingAESKey || !id) {
            throw new Error('token/encodingAESKey/id can not be empty');
        }
        this.token = token;
        this.id = id;
        let AESKey = Buffer.from(encodingAESKey, 'base64');
        if (AESKey.length !== 32) {
            throw new Error(AESException.IllegalAesKey);
        }
        this.key = AESKey;
        this.iv = AESKey.slice(0, 16);
    }

    /**
     * 计算签名
     * @param timestamp
     * @param nonce
     * @param encrypt
     * @return {*|PromiseLike<ArrayBuffer>}
     */
    getSignature (timestamp, nonce, encrypt) {
        let shasum = crypto.createHash('sha1');
        let arr = [this.token, timestamp, nonce, encrypt].sort();
        shasum.update(arr.join(''));

        return shasum.digest('hex');
    }

    /**
     * 加密消息
     * @param text
     * @return {String}
     */
    encrypt (text) {
        // 16位随机字符串添加到明文开头
        let randomString = crypto.pseudoRandomBytes(16);

        let msg = new Buffer(text);

        // 获取4B的内容长度的网络字节序
        let networkBytesOrder = Buffer.alloc(4);
        networkBytesOrder.writeUInt32BE(msg.length, 0)

        // 拼接明文：16位随机字符+4位网络字节序+文本+appId
        let msgBuffer = Buffer.concat([randomString, networkBytesOrder, msg, Buffer.from(this.id)])

        // 使用自定义的填充方式对明文进行补位填充
        let encoded = PKCS7Encoder.encode(msgBuffer)

        // AES加密,CBC模式,数据采用PKCS#7填充；IV初始向量大小为16字节，取AESKey前16字节
        const cipher = crypto.createCipheriv('aes-256-cbc', this.key, this.iv)
        cipher.setAutoPadding(false)

        return Buffer.concat([cipher.update(encoded), cipher.final()]).toString('base64')
    }

    /**
     * 解密消息
     * @param text
     * @return {{message: *, id: *}}
     */
    decrypt (text) {
        // 解密
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.key, this.iv)
        decipher.setAutoPadding(false)

        let decoded = Buffer.concat([decipher.update(text, 'base64'), decipher.final()])

        // 去除补位填充
        decoded = PKCS7Encoder.decode(decoded)

        // 去除16位随机数
        let content = decoded.slice(16);
        let length = content.slice(0, 4).readUInt32BE(0);

        let message = content.slice(4, length + 4).toString();
        let id = content.slice(length + 4).toString()

        if (id !== this.id) {
            throw new Error(AESException.ValidateAppidError)
        }

        return message;
    }
}

module.exports = WXBizMsgCrypt
