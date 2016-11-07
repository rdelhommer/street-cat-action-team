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
describe('Cat CRUD tests', function () {

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

  it('should not be able to save an cat if logged in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/cats')
          .send(cat)
          .expect(403)
          .end(function (catSaveErr, catSaveRes) {
            // Call the assertion callback
            done(catSaveErr);
          });

      });
  });

  it('should not be able to save an cat if not logged in', function (done) {
    agent.post('/api/cats')
      .send(cat)
      .expect(403)
      .end(function (catSaveErr, catSaveRes) {
        // Call the assertion callback
        done(catSaveErr);
      });
  });

  it('should not be able to update an cat if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/cats')
          .send(cat)
          .expect(403)
          .end(function (catSaveErr, catSaveRes) {
            // Call the assertion callback
            done(catSaveErr);
          });
      });
  });

  it('should be able to get a list of cats if not signed in', function (done) {
    // Create new cat model instance
    var catObj = new Cat(cat);

    // Save the cat
    catObj.save(function () {
      // Request cats
      request(app).get('/api/cats')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single cat if not signed in', function (done) {
    // Create new cat model instance
    var catObj = new Cat(cat);

    // Save the cat
    catObj.save(function () {
      request(app).get('/api/cats/' + catObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cat.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single cat with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/cats/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Cat is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single cat which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent cat
    request(app).get('/api/cats/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No cat with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should not be able to delete an cat if signed in without the "admin" role', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        agent.post('/api/cats')
          .send(cat)
          .expect(403)
          .end(function (catSaveErr, catSaveRes) {
            // Call the assertion callback
            done(catSaveErr);
          });
      });
  });

  it('should not be able to delete an cat if not signed in', function (done) {
    // Set cat user
    cat.user = user;

    // Create new cat model instance
    var catObj = new Cat(cat);

    // Save the cat
    catObj.save(function () {
      // Try deleting cat
      request(app).delete('/api/cats/' + catObj._id)
        .expect(403)
        .end(function (catDeleteErr, catDeleteRes) {
          // Set message assertion
          (catDeleteRes.body.message).should.match('User is not authorized');

          // Handle cat error error
          done(catDeleteErr);
        });

    });
  });

  it('should be able to get a single cat that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      usernameOrEmail: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin']
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new cat
          agent.post('/api/cats')
            .send(cat)
            .expect(200)
            .end(function (catSaveErr, catSaveRes) {
              // Handle cat save error
              if (catSaveErr) {
                return done(catSaveErr);
              }

              // Set assertions on new cat
              (catSaveRes.body.title).should.equal(cat.title);
              should.exist(catSaveRes.body.user);
              should.equal(catSaveRes.body.user._id, orphanId);

              // force the cat to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
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
                        should.equal(catInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single cat if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new cat model instance
    var catObj = new Cat(cat);

    // Save the cat
    catObj.save(function () {
      request(app).get('/api/cats/' + catObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', cat.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single cat, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      usernameOrEmail: 'catowner',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create user that will create the Cat
    var _catOwner = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.usernameOrEmail,
      password: _creds.password,
      provider: 'local',
      roles: ['admin', 'user']
    });

    _catOwner.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Cat
      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = _user._id;

          // Save a new cat
          agent.post('/api/cats')
            .send(cat)
            .expect(200)
            .end(function (catSaveErr, catSaveRes) {
              // Handle cat save error
              if (catSaveErr) {
                return done(catSaveErr);
              }

              // Set assertions on new cat
              (catSaveRes.body.title).should.equal(cat.title);
              should.exist(catSaveRes.body.user);
              should.equal(catSaveRes.body.user._id, userId);

              // now signin with the test suite user
              agent.post('/api/auth/signin')
                .send(credentials)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
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
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (catInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
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
