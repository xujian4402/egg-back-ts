'use strict';
/**
 * 微信接口定义，提供api和sdk调用
 * @type {*}
 */
const Interface = {};


/**
 * 微信公众号授权
 * @param page_url
 * @param wx_state
 * @param scope
 * @return {*}
 */
Interface.getAuthorizeURL = function(page_url, wx_state, scope) {
  return this.request(this.getApiURI('oauth', 'getAuthorizeURL'), this.getSignature({
    page_url,
    wx_state,
    scope,
  }));
};

/**
 * 获取网页授权的URL地址
 * @param page_url
 * @param wx_state
 * @param scope
 * @return {*}
 */
Interface.getAuthorizeURLForWebsite = function(page_url, wx_state, scope) {
  return this.request(this.getApiURI('oauth', 'getAuthorizeURLForWebsite'), this.getSignature({
    page_url,
    wx_state,
    scope,
  }));
};

/**
 * 微信公众号授权返回获取用户信息
 * @param code
 * @return {*}
 */
Interface.getUserByCode = function(code) {
  return this.request(this.getApiURI('oauth', 'getUserByCode'), this.getSignature({ code }));
};

/**
 * jsapi接口请求
 * @param options
 * @return {*}
 */
Interface.getJsConfig = function(options) {
  return this.request(this.getApiURI('mp', 'getJsConfig'), this.getSignature(options));
};

/**
 * 发送模板消息
 * @param openid
 * @param template_data
 * @return {*}
 */
Interface.sendTemplate = function(openid, template_data) {
  return this.send(this.getApiURI('mp', 'sendTemplate'), this.getSignature({
    openid,
    template_data,
  }));
};

/**
 * 发送文本客户消息
 * @param openid
 * @param text
 * @param customservice
 * @return {*}
 */
Interface.sendCustomText = function(openid, text, customservice) {
  return this.send(this.getApiURI('mp', 'sendCustomText'), this.getSignature({
    openid, text, customservice,
  }));
};

/**
 * 发送客服图文消息-外链
 * @param openid
 * @param title
 * @param description
 * @param url
 * @param picurl
 * @param customservice
 * @return {*}
 */
Interface.sendCustomNews = function(openid, { title, description, url, picurl }, customservice) {
  return this.send(this.getApiURI('mp', 'sendCustomNews'), this.getSignature({
    openid,
    title, description, url, picurl,
    customservice,
  }));
};

/**
 * 发送客户公众号图文消息
 * @param openid
 * @param media_id
 * @param customservice
 * @return {*}
 */
Interface.sendCustomMpNews = function(openid, media_id, customservice) {
  return this.send(this.getApiURI('mp', 'sendCustomMpNews'), this.getSignature({
    openid, media_id, customservice,
  }));
};

/**
 * 发送客户公众号图片
 * @param openid
 * @param media_id
 * @param customservice
 * @return {*}
 */
Interface.sendCustomImage = function(openid, media_id, customservice) {
  return this.send(this.getApiURI('mp', 'sendCustomImage'), this.getSignature({
    openid, media_id, customservice,
  }));
};

/**
 * 发送客户公众号语音
 * @param openid
 * @param media_id
 * @param customservice
 * @return {*}
 */
Interface.sendCustomVoice = function(openid, media_id, customservice) {
  return this.send(this.getApiURI('mp', 'sendCustomVoice'), this.getSignature({
    openid, media_id, customservice,
  }));
};

/**
 * 获取菜单
 * @return {*}
 */
Interface.getMenu = function() {
  return this.request(this.getApiURI('mp', 'getMenu'), this.getSignature());
};
/**
 * 获取菜单配置
 * @return {*}
 */
Interface.getMenuConfig = function() {
  return this.request(this.getApiURI('mp', 'getMenuConfig'), this.getSignature());
};
/**
 * 创建菜单
 * @param menu
 * @return {*}
 */
Interface.createMenu = function(menu) {
  return this.send(this.getApiURI('mp', 'createMenu'), this.getSignature({ menu }));
};

/**
 * 支付反馈回调验证
 * @param xmlBody
 * @return {Function|*}
 */
Interface.wxpayValidate = function(xmlBody) {
  return this.send(this.getApiURI('pay', 'wxpayValidate'), this.getSignature({ xmlBody }));
};

/**
 * 支付签名
 * @param xmlBody
 * @return {*}
 */
Interface.wxpayResultSign = function(xmlBody) {
  return this.send(this.getApiURI('pay', 'wxpayResultSign'), this.getSignature({ xmlBody }));
};

/**
 * 微信支付统一下单
 * @param order
 * @return {*}
 */
Interface.getBrandWCPayRequestParams = function(order) {
  return this.send(this.getApiURI('pay', 'getBrandWCPayRequestParams'), this.getSignature({ order }));
};

/**
 * 获取模板列表
 * @return {Promise.<Result>|*}
 */
Interface.getAllPrivateTemplate = function() {
  return this.request(this.getApiURI('mp', 'getAllPrivateTemplate'), this.getSignature());
};

/**
 * 获取微信卡券JS接口的签名
 * @param card_id
 * @param openid
 * @return {Promise.<Result>|*}
 */
Interface.getCard = function(card_id, openid) {
  return this.send(this.getApiURI('card', 'getCard'), this.getSignature({ card_id, openid }));
};

/**
 * 创建用于投放的卡卷二维码，支持投放单张卡卷和多张卡卷
 * @param info
 * @param expire_seconds
 */
Interface.createCardQRCode = function(info, expire_seconds) {
  return this.send(this.getApiURI('card', 'createCardQRCode'), this.getSignature({
    info,
    expire_seconds,
  }));
};

/**
 * 上传Logo
 * @param filepath
 * @return {Promise.<Result>|*}
 */
Interface.uploadLogo = function(filepath) {
  return this.send(this.getApiURI('card', 'uploadLogo'), this.getSignature({ filepath }));
};

/**
 * 公众号授权第三方平台登录页
 * @param redirect_uri
 * @return {Promise<Result>|*}
 */
Interface.getLoginPage = function(redirect_uri) {
  return this.request(this.getApiURI('auth', 'add', 'mod'), this.getSignature({
    redirect_uri,
    type: 'json',
  }));
};

/**
 * 公众号授权第三方平台返回
 * @param auth_code
 * @return {Promise<Result>|*}
 */
Interface.getQueryAuth = function(auth_code) {
  return this.request(this.getApiURI('auth', 'add', 'mod'), this.getSignature({ auth_code, type: 'json' }));
};

/**
 * 小程序登录凭证换取session key
 * @param code
 * @return {*}
 */
Interface.jscode2session = function(code) {
  return this.send(this.getApiURI('mini', 'jscode2session'), this.getSignature({ code }));
};

/**
 * 返回小程序缓存中的session key
 * @param openid
 * @return {Promise<Result>|*}
 */
Interface.sessionKey = function(openid) {
  return this.request(this.getApiURI('mini', 'sessionKey'), this.getSignature({ openid }));
};

/**
 * 生成微信小程序二维码图片
 * @param scene
 * @param page
 * @param width
 * @param auto_color
 * @param line_color
 * @return {Promise<Result>|*}
 */
Interface.getwxacodeunlimit = function(scene, page, width, auto_color, line_color) {
  return this.send(this.getApiURI('mini', 'getwxacodeunlimit'), this.getSignature({
    scene,
    page,
    width,
    auto_color,
    line_color,
  }), { responseType: 'arraybuffer' });
};

/**
 * 小程序图片内容安全监测
 * @param resource
 * @return {*}
 */
Interface.imgSecCheck = function(resource) {
  return this.send(this.getApiURI('mini', 'imgSecCheck'), this.getSignature({ resource }));
};

/**
 * 小程序消息内容安全监测
 * @param content
 * @return {*}
 */
Interface.msgSecCheck = function(content) {
  return this.send(this.getApiURI('mini', 'msgSecCheck'), this.getSignature({ content }));
};

/**
 * 获取小程序帐号下已存在的模板列表
 * @param offset
 * @param count
 * @return {*}
 */
Interface.wxOpenTemplateList = function(offset, count) {
  return this.send(this.getApiURI('mini', 'wxOpenTemplateList'), this.getSignature({ offset, count }));
};

/**
 * 发送小程序模板消息
 * @param touser
 * @param template_id
 * @param page
 * @param form_id
 * @param data
 * @param emphasis_keyword
 * @return {*}
 */
Interface.wxOpenTemplateSend = function(touser, template_id, page, form_id, data, emphasis_keyword) {
  return this.send(this.getApiURI('mini', 'wxOpenTemplateSend'), this.getSignature({
    touser,
    template_id,
    page,
    form_id,
    data,
    emphasis_keyword,
  }));
};
module.exports = Interface;
