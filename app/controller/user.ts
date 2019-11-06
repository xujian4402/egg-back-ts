import { Controller } from 'egg';

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    // ctx.logger.info(ctx.original_uri);
    ctx.logger.info(ctx.request.tests);
    ctx.session.active_user = { user_id: '1234567', test01: '099' };
    ctx.helper.getToken('ertyu');
    ctx.helper.success(ctx, ctx.session);
    // ctx.body = await ctx.service.test.sayHi('egg');
  }
}
