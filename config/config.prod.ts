import { EggAppConfig, PowerPartial } from 'egg';

export default () => {
  const config: PowerPartial<EggAppConfig> = {};

  config.sequelize = {
    dialect: 'postgres',
    database: 'egg-prod',
    host: '116.62.229.74',
    port: 5432,
    username: 'postgres',
    password: 'xujian4402'
  };

  config.logger = {
    consoleLevel: 'ERROR'
  };
  return config;
};
