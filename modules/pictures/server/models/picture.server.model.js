(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var PictureSchema = new Schema({
    imageUrl: {
      type: String,
      required: 'Image URL is required'
    },
    submittingUser: {
      type: Schema.ObjectId,
      ref: 'User',
      required: 'Picture must have a submitting user'
    },
    cat: {
      type: Schema.ObjectId,
      ref: 'Cat',
      required: 'Picture must be linked to a cat'
    },
    submissionDate: {
      type: Date,
      default: Date.now
    },
  });

  mongoose.model('Picture', PictureSchema);
}());
