'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Cat = mongoose.model('Cat'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create a cat
 */
exports.create = function (req, res) {
  var cat = new Cat(req.body);
  cat.submittingUser = req.user;

  cat.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cat);
    }
  });
};

/**
 * Show the current cat
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var cat = req.cat ? req.cat.toJSON() : {};

  // Add a custom field to the Cat, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Cat model.
  cat.isCurrentUserOwner = !!(req.user && cat.user && cat.user._id.toString() === req.user._id.toString());

  res.json(cat);
};

/**
 * Update an cat
 */
exports.update = function (req, res) {
  var cat = req.cat;

  cat.title = req.body.title;
  cat.content = req.body.content;

  cat.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cat);
    }
  });
};

/**
 * Delete an cat
 */
exports.delete = function (req, res) {
  var cat = req.cat;

  cat.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cat);
    }
  });
};

/**
 * List of Cats
 */
exports.list = function (req, res) {
  Cat.find().sort('-created').populate('user', 'displayName').exec(function (err, cats) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(cats);
    }
  });
};

/**
 * Cat middleware
 */
exports.catByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Cat is invalid'
    });
  }

  Cat.findById(id).populate('user', 'displayName').exec(function (err, cat) {
    if (err) {
      return next(err);
    } else if (!cat) {
      return res.status(404).send({
        message: 'No cat with that identifier has been found'
      });
    }
    req.cat = cat;
    next();
  });
};
