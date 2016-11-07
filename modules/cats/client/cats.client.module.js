(function (app) {
  'use strict';

  app.registerModule('cats', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('cats.admin', ['core.admin']);
  app.registerModule('cats.admin.routes', ['core.admin.routes']);
  app.registerModule('cats.services');
  app.registerModule('cats.routes', ['ui.router', 'core.routes', 'cats.services']);
}(ApplicationConfiguration));
