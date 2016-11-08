'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PictureSchema = mongoose.model('Picture').schema;

/**
 * Cat Schema
 */
var CatSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  likes: {
    type: Array,
    default: []
  },
  dislikes: {
    type: Array,
    default: []
  },
  pictures: {
    type: [PictureSchema],
    default: []
  },
  submittingUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cat', CatSchema);
