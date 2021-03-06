import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.sequelize = {
    dialect: 'postgres',
    database: 'egg-test',
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'xujian4402693'
  };

  config.logger = {
    consoleLevel: 'DEBUG'
  };
  return config;
};
