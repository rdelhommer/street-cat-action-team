(function () {
  'use strict';

  var path = require('path');
  var mongoose = require('mongoose');
  var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  var mongooseAdapter = require('../../../core/server/adapters/mongoose.server.adapter.js');

  exports.create = function (req, res) {
    var sighting = mongooseAdapter.create('Sighting', req.body);

    // Save the sighting and then add to the user
    mongooseAdapter.save(sighting, function (sightingErr) {
      if (sightingErr) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(sightingErr)
        });
      }

      mongooseAdapter.update(
        'User',
        { '_id': req.user },
        { '$push': { 'sightings': sighting } },
        function (err, numAffected) {
          if (err) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(err)
            });
          }

          return res.json(sighting);
        });
    });
  };

  exports.read = function (req, res) {
    return res.json(req.sighting ? req.sighting : {});
  };

  exports.delete = function (req, res) {
    mongooseAdapter.remove(req.sighting, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(req.sighting);
      }
    });
  };

  exports.list = function (req, res) {
    mongooseAdapter.find('Sighting').sort('-submissionDate').exec(function (err, sightings) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(sightings);
      }
    });
  };

  exports.sightingById = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Sighting ID is invalid'
      });
    }

    mongooseAdapter.findById('Sighting', id).exec(function (err, sighting) {
      if (err) {
        return next(err);
      } else if (!sighting) {
        return res.status(404).send({
          message: 'No sighting with that ID has been found'
        });
      }

      req.sighting = sighting;

      return next();
    });
  };
}());
