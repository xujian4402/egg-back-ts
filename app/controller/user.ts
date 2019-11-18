import { Controller } from 'egg';

export default class UserController extends Controller {
  public async index() {
    const { ctx } = this;
    try {
      // tslint:disable-next-line: no-multi-spaces
      const { ret, msg } = await ctx.helper.kml_check(ctx);
      if (ret && ret === 'OK') {
        ctx.logger.info('check', msg);
      } else {
        ctx.logger.info('正常', msg);
      }
      ctx.helper.success(ctx);
    } catch (error) {
      ctx.logger.info('error', error.message);
      ctx.helper.error(ctx, error.message);
    }
  }
}
