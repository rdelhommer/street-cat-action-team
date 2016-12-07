(function () {
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var SightingSchema = new Schema({
    sightingDate: {
      type: Date,
      default: Date.now
    },
    cat: {
      type: Schema.ObjectId,
      ref: 'Cat'
    },
    location: {
      type: [Number],
      index: '2d'
    }
  });

  mongoose.model('Sighting', SightingSchema);
}());
