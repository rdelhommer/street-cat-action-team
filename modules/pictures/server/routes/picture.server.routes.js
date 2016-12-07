(function () {
  'use strict';

  var policy = require('../policies/picture.server.policy');
  var controller = require('../controllers/picture.server.controller');

  module.exports = function (app) {
    app.route('/api/pictures').all(policy.isAllowed)
      .get(controller.list)
      .post(controller.create);

    app.route('/api/pictures/:pictureId').all(policy.isAllowed)
      .get(controller.read)
      .delete(controller.delete);

    app.param('pictureId', controller.pictureById);
  };
}());
