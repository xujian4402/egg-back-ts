'use strict';

module.exports = app => {
  app.addSingleton('wxapi', createClient);
};

function createClient(config, app) {
  app.coreLogger.error('[egg-wxapp] config:', config);
  const client = require('./lib/wxinit')(config);
  return client;
}
