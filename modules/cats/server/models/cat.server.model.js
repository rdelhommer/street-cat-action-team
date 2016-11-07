'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

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
  submittingUser: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Cat', CatSchema);
