'use strict';

const mock = require('egg-mock');

describe('test/wxapp-api.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/wxapp-api-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, wxappApi')
      .expect(200);
  });
});
