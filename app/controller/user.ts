import { Controller } from 'egg';

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    // ctx.logger.info(ctx.original_uri);
    ctx.logger.info(ctx.request.tests);
    // this.app.sessionStore.set('session', 'jgjgjh');
    ctx.session.user = 'xujian';
    // throw { user: '4567' };
    ctx.helper.getToken('ertyu');
    ctx.helper.success(ctx, this.ctx.original_uri);
    // ctx.body = await ctx.service.test.sayHi('egg');
  }
}
