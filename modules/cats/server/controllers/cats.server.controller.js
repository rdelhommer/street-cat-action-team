(function () {
  'use strict';

  var path = require('path');
  var mongoose = require('mongoose');
  var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  var mongooseAdapter = require('../../../core/server/adapters/mongoose.server.adapter.js');

  exports.create = function (req, res) {
    var cat = mongooseAdapter.create('Cat', req.body);
    cat.submittingUser = req.user;

    mongooseAdapter.save(cat, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(cat);
      }
    });
  };

  exports.read = function (req, res) {
    return res.json(req.cat ? req.cat : {});
  };

  exports.update = function (req, res) {
    req.cat.catName = req.body.catName;

    mongooseAdapter.save(req.cat, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(req.cat);
      }
    });
  };

  exports.delete = function (req, res) {
    mongooseAdapter.remove(req.cat, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(req.cat);
      }
    });
  };

  exports.list = function (req, res) {
    mongooseAdapter.find('Cat').sort('-created').exec(function (err, cats) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(cats);
      }
    });
  };

  exports.catByID = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Cat ID is invalid'
      });
    }

    mongooseAdapter.findById('Cat', id).exec(function (err, cat) {
      if (err) {
        return next(err);
      } else if (!cat) {
        return res.status(404).send({
          message: 'No cat with that ID has been found'
        });
      }
      req.cat = cat;
      next();
    });
  };
}());
