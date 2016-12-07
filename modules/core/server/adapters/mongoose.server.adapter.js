(function () {
  'use strict';

  var mongoose = require('mongoose');

  exports.save = function (doc, callback) {
    doc.save(function (err) {
      return callback(err);
    });
  };

  exports.remove = function (doc, callback) {
    doc.remove(function (err) {
      return callback(err);
    });
  };

  exports.create = function (modelName, obj) {
    var Model = mongoose.model(modelName);

    return new Model(obj);
  };

  exports.update = function (modelName, param1, param2, callback) {
    var Model = mongoose.model(modelName);

    Model.update(param1, param2, function (err, num) {
      return callback(err, num);
    });
  };

  exports.find = function (modelName, param) {
    var Model = mongoose.model(modelName);

    if (param) {
      return Model.find(param);
    } else {
      return Model.find();
    }
  };

  exports.findById = function (modelName, id) {
    var Model = mongoose.model(modelName);

    return Model.findById(id);
  };

  exports.findOne = function (modelName, param1, param2) {
    var Model = mongoose.model(modelName);

    return Model.findOne(param1, param2);
  };
}());
