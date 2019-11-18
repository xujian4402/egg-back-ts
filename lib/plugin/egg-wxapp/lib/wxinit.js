'use strict';

/**
 * 创建wx接口的api或者sdk
 * @param {*} arg 单个对象时作为api初始化，多个对象时作为sdk初始化
 * @return {WxApi|WXSdk} 返回实例
 */
module.exports = function(arg) {
  console.log('arg', arg);
  if (typeof arg !== 'object') {
    throw '初始化api时传入的参数必须是对象';
  }
  if (arg.type === 'wechat') {
    return new require('./sdk/wxsdk')(arg);
  } else if (arg.type === 'weapp') {
    return new require('./api/wxapi')(arg);
  }
  throw new Error('参数错误');

};
