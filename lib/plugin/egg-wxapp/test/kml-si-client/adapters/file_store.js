/**
 * Created by lintry on 2017/3/8.
 */

"use strict";

const fs = require('fs-extra'),
  Promise = require('bluebird'),
  chalk = require('chalk');

/**
 * 文件存储token
 * @param filename
 * @constructor
 */
const FileStore = function (filename) {
  if (!(this instanceof FileStore)) {
    return new FileStore(filename);
  }
  const token_rc = process.cwd() + '/.token/' + (filename||'access_token') + '.json';
  console.log(chalk.cyan('file store is in ' + token_rc));

  //预处理配置
  fs.ensureFileSync(token_rc);

  /**
   * 读取token
   * @return {Promise.<AccessToken>}
   */
  this.getToken = function getTokenFromFile() {
    let token = fs.readJsonSync(token_rc, {throws: false});
    return Promise.resolve(token);
  };

  /**
   * 写入token
   * @param token
   */
  this.saveToken = function saveTokenToFile(token) {
    fs.writeJsonSync(token_rc, token);
    return Promise.resolve(token);
  };
};

module.exports = FileStore;