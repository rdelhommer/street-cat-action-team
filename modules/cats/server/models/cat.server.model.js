(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var PictureSchema = mongoose.model('Picture').schema;

  var CatSchema = new Schema({
    created: {
      type: Date,
      default: Date.now
    },
    catName: {
      type: String,
      trim: true,
      required: 'Name cannot be blank'
    },
    submittingUser: {
      type: Schema.ObjectId,
      ref: 'User'
    }
  });

  mongoose.model('Cat', CatSchema);
}());
