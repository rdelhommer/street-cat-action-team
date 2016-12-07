(function () {
  'use strict';

  var catsPolicy = require('../policies/cats.server.policy');
  var cats = require('../controllers/cats.server.controller');

  module.exports = function (app) {
    // Cats collection routes
    app.route('/api/cats').all(catsPolicy.isAllowed)
      .get(cats.list)
      .post(cats.create);

    // Single cat routes
    app.route('/api/cats/:catId').all(catsPolicy.isAllowed)
      .get(cats.read)
      .put(cats.update)
      .delete(cats.delete);

    app.route('/api/cats/picture').all(catsPolicy.isAllowed)
      .put(cats.addPicture)
      .delete(cats.removePicture);

    // Finish by binding the cat middleware
    app.param('catId', cats.catByID);
  };
}());
