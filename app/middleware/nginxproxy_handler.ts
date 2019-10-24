import { Context, Application, EggAppConfig } from 'egg';
import { resolve, parse } from 'url';

export default function errorMiddleware(
  _options: EggAppConfig,
  _app: Application
) {
  return async (ctx: Context, next: () => Promise<any>) => {
    const headers = ctx.headers;
    const [host, port, scheme, request_uri] = [
      headers['x-proxy-host'] || headers['host'], // 获取完整的server:port
      headers['x-proxy-server-port'] || headers['server-port'] || '80', // 暂时不用
      headers['x-proxy-scheme'] || headers['scheme'] || 'http',
      headers['x-proxy-request-uri'] ||
        headers['request-uri'] ||
        ctx.originalUrl // 获取除域名外的完整url
    ];

    let host_url = scheme + '://' + host;
    if (
      (scheme === 'http' && port !== '80') ||
      (scheme === 'https' && port !== '443')
    ) {
      host_url += ':' + port;
    }

    // 原始的请求url，包含querystring和hash
    const original_url = resolve(host_url, request_uri);
    // 原始的请求路径，不带querystring和hash
    const pathname: any = parse(request_uri).pathname;
    const original_path = resolve(host_url, pathname);
    // 原始的请求根目录
    const original_base = resolve(
      host_url,
      request_uri.replace(ctx.originalUrl, '') + '/'
    );

    ctx.original_uri = {
      url: original_url,
      path: original_path,
      base: original_base
    };

    await next();
  };
}
