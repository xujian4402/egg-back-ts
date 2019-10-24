import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.sequelize = {
    dialect: 'postgres',
    database: 'egg-test',
    host: '116.62.229.74',
    port: 5432,
    username: 'postgres',
    password: 'xujian4402'
  };

  config.logger = {
    consoleLevel: 'DEBUG'
  };
  return config;
};
