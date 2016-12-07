(function () {
  'use strict';

  var policy = require('../policies/picture.server.policy');
  var controller = require('../controllers/picture.server.controller');

  module.exports = function (app) {
    // Cats collection routes
    app.route('/api/pictures').all(policy.isAllowed)
      .get(controller.list)
      .post(controller.create);

    // Single cat routes
    app.route('/api/pictures/:pictureId').all(policy.isAllowed)
      .get(controller.read)
      .put(controller.update)
      .delete(controller.delete);

    // Finish by binding the cat middleware
    app.param('pictureId', controller.pictureById);
  };
}());
