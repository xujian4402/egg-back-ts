'use strict';

const mock = require('egg-mock');

describe('test/wxapp.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/wxapp-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, wxapp')
      .expect(200);
  });
});
