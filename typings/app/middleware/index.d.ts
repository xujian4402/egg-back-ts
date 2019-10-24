// This file is created by egg-ts-helper@1.25.6
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler from '../../../app/middleware/error_handler';
import ExportNginxproxyHandler from '../../../app/middleware/nginxproxy_handler';
import ExportNotfoundHandler from '../../../app/middleware/notfound_handler';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
    nginxproxyHandler: typeof ExportNginxproxyHandler;
    notfoundHandler: typeof ExportNotfoundHandler;
  }
}
