import { Controller } from 'egg';

export default class WxappController extends Controller {
  public async check() {
    const { ctx } = this;
    const check = await ctx.helper.kml_check(ctx.app_token);
    ctx.helper.success(ctx, check);
  }

  public async login() {
    const { ctx } = this;
    const app_token = ctx.app_token;
    const body = ctx.request.body;
    // tslint:disable-next-line: no-multi-spaces
    const { ret, msg, data } = await ctx.helper.kml_login(app_token, body);
    if (ret && ret === 'ERROR') {
    ctx.helper.error(ctx, msg);
    }
    ctx.helper.success(ctx, { token: data.token });
  }
}
