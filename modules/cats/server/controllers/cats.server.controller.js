(function () {
  'use strict';

  var path = require('path');
  var mongoose = require('mongoose');
  var Cat = mongoose.model('Cat');
  var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

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

  exports.read = function (req, res) {
    // convert mongoose document to JSON
    var cat = req.cat ? req.cat.toJSON() : {};

    // Add a custom field to the Cat, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Cat model.
    cat.isCurrentUserOwner = !!(req.user && cat.user && cat.user._id.toString() === req.user._id.toString());

    res.json(cat);
  };

  exports.update = function (req, res) {
    var cat = req.cat;

    cat.name = req.body.name;
    cat.pictures.concat(req.body.pictures);

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
}());
