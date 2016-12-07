(function () {
  'use strict';

  var acl = require('acl');
  var basePolicy = require('../../../core/server/policies/base.server.policy');

  acl = new acl(new acl.memoryBackend());

  exports.invokeRolesPolicies = function () {
    acl.allow([{
      roles: ['admin'],
      allows: [{
        resources: '/api/pictures',
        permissions: '*'
      }, {
        resources: '/api/pictures/:pictureId',
        permissions: '*'
      }]
    }, {
      roles: ['user'],
      allows: [{
        resources: '/api/pictures',
        permissions: ['get', 'post']
      }, {
        resources: '/api/pictures/:pictureId',
        permissions: ['*']
      }]
    }, {
      roles: ['guest'],
      allows: [{
        resources: '/api/pictures',
        permissions: ['get']
      }, {
        resources: '/api/pictures/:pictureId',
        permissions: ['get']
      }]
    }]);
  };

  exports.isAllowed = function (req, res, next) {
    // Allow the current user to manipulate their own pictures
    if (req.picture && req.user && req.picture.submittingUser && req.picture.submittingUser.id === req.user.id) {
      return next();
    }

    basePolicy.isAllowed(req, res, next, acl);
  };
}());
