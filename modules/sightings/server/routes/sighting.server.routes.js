(function () {
  'use strict';

  var policy = require('../policies/sighting.server.policy');
  var controller = require('../controllers/sighting.server.controller');

  module.exports = function (app) {
    app.route('/api/sightings').all(policy.isAllowed)
      .get(controller.list)
      .post(controller.create);

    app.route('/api/sightings/:pictureId').all(policy.isAllowed)
      .get(controller.read)
      .delete(controller.delete);

    app.param('pictureId', controller.pictureById);
  };
}());
