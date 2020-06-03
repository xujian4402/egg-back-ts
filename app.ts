import { Application, IBoot } from 'egg';

export default class AppBootHook implements IBoot {
  private readonly app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  configWillLoad() {
    // 准备调用configDidLoad，
    // 配置，插件文件被引用，
    // 这是修改配置的最后一次机会。
  }

  configDidLoad() {
    // 配置，插件文件已加载
  }

  async didLoad() {
    // All files have loaded, start plugin here.所有文件已加载，开始插件这里。
  }

  async willReady() {
    // All plugins have started, can do some thing before app ready.
    // 所有的插件已经开始，可以做一些事情之前的应用程序准备。
  }

  async didReady() {
    // worker准备好了，可以做一些事情
    // don't need to block the app boot.不需要阻止应用程序启动。
    this.app.logger.info('didReady',this.app);
    const result = await this.app.curl(
      'https://registry.npm.taobao.org/egg/latest',
      {
        dataType: 'json'
      }
    );
    this.app.logger.info('Egg latest version: %s', result.data.version);
    // this.app.logger.info('Egg latest env: %s', this.app.config.env);

    // // if (this.app.config.env === 'local' || this.app.config.env === 'unittest') {
    // //   await this.app.model.sync();
    // // }
  }

  async serverDidReady() {
    // Server is listening.
    this.app.logger.info('serverDidReady程序启动完成!');
  }

  async beforeClose() {
    this.app.logger.info('beforeClose程序关闭!');
  }
}
