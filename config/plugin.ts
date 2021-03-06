import { EggPlugin } from 'egg';
import * as path from 'path';

const plugin: EggPlugin = {
  sequelize: {
    enable: true,
    package: 'egg-sequelize'
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  },
  wxappApi: {
    enable: true,
    path: path.join(__dirname, '../lib/plugin/egg-wxapp-api')
  }
};

export default plugin;
