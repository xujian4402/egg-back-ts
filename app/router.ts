import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller['user']['index']);
  router.get('/w/app/check', controller.wxapp.check);
  router.post('/w/app/login', controller.wxapp.login);
};
