import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';

export default (appInfo: EggAppInfo) => {
  // tslint:disable-next-line: no-object-literal-type-assertion
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1571638371520_4959';

  // add your egg config in here
  config.middleware = [
    'nginxproxyHandler',
    'notfoundHandler',
    'errorHandler',
  ];

  config.wxappHandler = {
    token_id: 'wx-token'
  };
  config.notfound = {
    enable: false
  };

  config.cluster = {
    listen: {
      port: 7002,
      hostname: '127.0.0.1'
    }
  };

  // redis配置
  config.redis = {
    clients: {
      session: {
        host: '116.62.229.74',
        port: 6379,
        password: '123456',
        db: 0
      },
      wxToken: {
        host: '116.62.229.74',
        port: 6379,
        password: '123456',
        db: 1
      }
    }
  };

  config.session = {
    key: 'EGG_SESSION_X',
    maxAge: 24 * 3600 * 1000, // 1 天
    httpOnly: true,
    encrypt: false
  };

  // redisSession配置
  config.sessionRedis = {
    name: 'session'
  };

  // config.proxy = true;
  // config.ipHeaders = 'x-proxy-host,X-Real-Ip, X-Forwarded-For';
  // config.protocolHeaders = 'X-Real-Proto, X-Forwarded-Proto';
  // config.hostHeaders = 'X-Forwarded-Host';

  // add your special config in here
  const bizConfig = {
    errorHandler: {
      test: 12345
    }
  };

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig
  };
};
