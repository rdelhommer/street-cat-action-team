(function () {
  'use strict';

  var path = require('path');
  var mongoose = require('mongoose');
  var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  var mongooseAdapter = require('../../../core/server/adapters/mongoose.server.adapter.js');

  exports.create = function (req, res) {
    var picture = mongooseAdapter.create('Picture', req.body);
    picture.submittingUser = req.user;

    mongooseAdapter.save(picture, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(picture);
      }
    });
  };

  exports.read = function (req, res) {
    return res.json(req.picture ? req.picture : {});
  };

  exports.update = function (req, res) {
    // If the image is changed, reset the likes, dislikes, and submission date
    if (req.picture.imageUrl !== req.body.imageUrl) {
      req.picture.imageUrl = req.body.imageUrl;
      req.picture.submissionDate = new Date(Date.now());
    }

    mongooseAdapter.save(req.picture, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(req.picture);
      }
    });
  };

  exports.delete = function (req, res) {
    mongooseAdapter.remove(req.picture, function (err) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(req.picture);
      }
    });
  };

  exports.list = function (req, res) {
    mongooseAdapter.find('Picture').sort('-submissionDate').exec(function (err, pictures) {
      if (err) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        return res.json(pictures);
      }
    });
  };

  exports.pictureById = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({
        message: 'Picture ID is invalid'
      });
    }

    mongooseAdapter.findById('Picture', id).exec(function (err, picture) {
      if (err) {
        return next(err);
      } else if (!picture) {
        return res.status(404).send({
          message: 'No picture with that ID has been found'
        });
      }

      req.picture = picture;

      return next();
    });
  };
}());
