import { Context } from 'egg';

export default {
  success(ctx: Context, res: any = null, msg: string = '请求成功') {
    ctx.body = {
      ret: 'OK',
      data: res,
      msg
    };
    ctx.status = 200;
  },
  error(ctx: Context, res: any = null, msg: string = '请求失败') {
    ctx.body = {
      ret: 'ERROR',
      data: res,
      msg
    };
    ctx.status = 200;
  }
};
