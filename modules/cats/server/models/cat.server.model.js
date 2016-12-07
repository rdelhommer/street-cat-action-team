(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var CatSchema = new Schema({
    catName: {
      type: String,
      trim: true,
      required: 'Name cannot be blank'
    }
  });

  mongoose.model('Cat', CatSchema);
}());
