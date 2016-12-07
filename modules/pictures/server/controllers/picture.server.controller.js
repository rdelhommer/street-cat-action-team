(function () {
  'use strict';

  var path = require('path');
  var mongoose = require('mongoose');
  var errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  var mongooseAdapter = require('../../../core/server/adapters/mongoose.server.adapter.js');

  exports.create = function (req, res) {
    var upload = multer(config.uploads.profileUpload).single('newPicture');
    var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;
    upload.fileFilter = profileUploadFileFilter;

    // Upload the image
    upload(req, res, function (uploadErr) {
      if (uploadErr) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(uploadErr)
        });
      }

      // Add the url of the saved image to the req body and create the picture
      req.body.imageUrl = config.uploads.catUpload.dest + req.file.filename;
      var picture = mongooseAdapter.create('Picture', req.body);

      // Save the picture
      mongooseAdapter.save(picture, function (pictureErr) {
        if (pictureErr) {
          return res.status(422).send({
            message: errorHandler.getErrorMessage(pictureErr)
          });
        }

        // Add the saved picture reference to the user
        mongooseAdapter.update(
          'User',
          { '_id': req.user },
          { '$push': { 'pictures': picture } },
          function (err, numAffected) {
            if (err) {
              return res.status(422).send({
                message: errorHandler.getErrorMessage(err)
              });
            }

            return res.json(picture);
          });
      });
    });
  };

  exports.read = function (req, res) {
    return res.json(req.picture ? req.picture : {});
  };

  exports.delete = function (req, res) {
    // Remove the picture and then remove from the user
    mongooseAdapter.remove(req.picture, function (removeErr) {
      if (removeErr) {
        return res.status(422).send({
          message: errorHandler.getErrorMessage(removeErr)
        });
      }

      mongooseAdapter.update(
        'User',
        { '_id': req.user },
        { '$pull': { 'pictures': { '_id': req.picture.id } } },
        function (updateErr, numAffected) {
          if (updateErr) {
            return res.status(422).send({
              message: errorHandler.getErrorMessage(updateErr)
            });
          }

          return res.json(picture);
        });
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
