'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Cat = mongoose.model('Cat'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  cat;

/**
 * Cat routes tests
 */
describe('Cat Admin CRUD tests', function () {
  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      usernameOrEmail: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      roles: ['user', 'admin'],
      username: credentials.usernameOrEmail,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new cat
    user.save(function () {
      cat = {
        title: 'Cat Title',
        content: 'Cat Content'
      };

      done();
    });
  });

  it('should be able to save an cat if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new cat
        agent.post('/api/cats')
          .send(cat)
          .expect(200)
          .end(function (catSaveErr, catSaveRes) {
            // Handle cat save error
            if (catSaveErr) {
              return done(catSaveErr);
            }

            // Get a list of cats
            agent.get('/api/cats')
              .end(function (catsGetErr, catsGetRes) {
                // Handle cat save error
                if (catsGetErr) {
                  return done(catsGetErr);
                }

                // Get cats list
                var cats = catsGetRes.body;

                // Set assertions
                (cats[0].user._id).should.equal(userId);
                (cats[0].title).should.match('Cat Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to update an cat if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new cat
        agent.post('/api/cats')
          .send(cat)
          .expect(200)
          .end(function (catSaveErr, catSaveRes) {
            // Handle cat save error
            if (catSaveErr) {
              return done(catSaveErr);
            }

            // Update cat title
            cat.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing cat
            agent.put('/api/cats/' + catSaveRes.body._id)
              .send(cat)
              .expect(200)
              .end(function (catUpdateErr, catUpdateRes) {
                // Handle cat update error
                if (catUpdateErr) {
                  return done(catUpdateErr);
                }

                // Set assertions
                (catUpdateRes.body._id).should.equal(catSaveRes.body._id);
                (catUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an cat if no title is provided', function (done) {
    // Invalidate title field
    cat.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new cat
        agent.post('/api/cats')
          .send(cat)
          .expect(422)
          .end(function (catSaveErr, catSaveRes) {
            // Set message assertion
            (catSaveRes.body.message).should.match('Title cannot be blank');

            // Handle cat save error
            done(catSaveErr);
          });
      });
  });

  it('should be able to delete an cat if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new cat
        agent.post('/api/cats')
          .send(cat)
          .expect(200)
          .end(function (catSaveErr, catSaveRes) {
            // Handle cat save error
            if (catSaveErr) {
              return done(catSaveErr);
            }

            // Delete an existing cat
            agent.delete('/api/cats/' + catSaveRes.body._id)
              .send(cat)
              .expect(200)
              .end(function (catDeleteErr, catDeleteRes) {
                // Handle cat error error
                if (catDeleteErr) {
                  return done(catDeleteErr);
                }

                // Set assertions
                (catDeleteRes.body._id).should.equal(catSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a single cat if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new cat model instance
    cat.user = user;
    var catObj = new Cat(cat);

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new cat
        agent.post('/api/cats')
          .send(cat)
          .expect(200)
          .end(function (catSaveErr, catSaveRes) {
            // Handle cat save error
            if (catSaveErr) {
              return done(catSaveErr);
            }

            // Get the cat
            agent.get('/api/cats/' + catSaveRes.body._id)
              .expect(200)
              .end(function (catInfoErr, catInfoRes) {
                // Handle cat error
                if (catInfoErr) {
                  return done(catInfoErr);
                }

                // Set assertions
                (catInfoRes.body._id).should.equal(catSaveRes.body._id);
                (catInfoRes.body.title).should.equal(cat.title);

                // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                (catInfoRes.body.isCurrentUserOwner).should.equal(true);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Cat.remove().exec(done);
    });
  });
});
