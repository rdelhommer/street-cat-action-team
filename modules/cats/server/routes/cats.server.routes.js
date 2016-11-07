'use strict';

/**
 * Module dependencies
 */
var catsPolicy = require('../policies/cats.server.policy'),
  cats = require('../controllers/cats.server.controller');

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

  // Finish by binding the cat middleware
  app.param('catId', cats.catByID);
};
