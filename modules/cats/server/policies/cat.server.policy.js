(function () {
  'use strict';

  var acl = require('acl');
  var basePolicy = require('../../../core/server/policies/base.server.policy');

  acl = new acl(new acl.memoryBackend());

  exports.invokeRolesPolicies = function () {
    acl.allow([{
      roles: ['admin'],
      allows: [{
        resources: '/api/cats',
        permissions: '*'
      }, {
        resources: '/api/cats/:catId',
        permissions: '*'
      }]
    }, {
      roles: ['user'],
      allows: [{
        resources: '/api/cats',
        permissions: ['get', 'post']
      }, {
        resources: '/api/cats/:catId',
        permissions: ['get']
      }]
    }, {
      roles: ['guest'],
      allows: [{
        resources: '/api/cats',
        permissions: ['get']
      }, {
        resources: '/api/cats/:catId',
        permissions: ['get']
      }]
    }]);
  };

  exports.isAllowed = function (req, res, next) {
    basePolicy.isAllowed(req, res, next, acl);
  };
}());
