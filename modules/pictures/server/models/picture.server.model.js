'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PictureSchema = new Schema({
  imageURL: {
    type: String,
    default: '',
    required: 'Picture URL is required'
  },
  submittingUser: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  cat: {
    type: Schema.ObjectId,
    ref: 'Cat'
  }
});

mongoose.model('Picture', PictureSchema);
