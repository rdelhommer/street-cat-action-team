(function () {
  'use strict';

  var policy = require('../policies/cat.server.policy');
  var controller = require('../controllers/cat.server.controller');

  module.exports = function (app) {
    // Cats collection routes
    app.route('/api/cats').all(policy.isAllowed)
      .get(controller.list)
      .post(controller.create);

    // Single cat routes
    app.route('/api/cats/:catId').all(policy.isAllowed)
      .get(controller.read)
      .put(controller.update)
      .delete(controller.delete);

    // Finish by binding the cat middleware
    app.param('catId', controller.catById);
  };
}());
