(function () {
  'use strict';

  var acl = require('acl');
  var basePolicy = require('../../../core/server/policies/base.server.policy');

  acl = new acl(new acl.memoryBackend());

  exports.invokeRolesPolicies = function () {
    acl.allow([{
      roles: ['admin'],
      allows: [{
        resources: '/api/sightings',
        permissions: '*'
      }, {
        resources: '/api/sightings/:sightingId',
        permissions: '*'
      }]
    }, {
      roles: ['user'],
      allows: [{
        resources: '/api/sightings',
        permissions: ['get', 'post']
      }, {
        resources: '/api/sightings/:sightingId',
        permissions: ['*']
      }]
    }, {
      roles: ['guest'],
      allows: [{
        resources: '/api/sightings',
        permissions: ['get']
      }, {
        resources: '/api/sightings/:sightingId',
        permissions: ['get']
      }]
    }]);
  };

  exports.isAllowed = function (req, res, next) {
    // Allow the current user to manipulate their own sightings
    if (req.sighting && req.user && req.sighting.submittingUser && req.sighting.submittingUser.id === req.user.id) {
      return next();
    }

    basePolicy.isAllowed(req, res, next, acl);
  };
}());
