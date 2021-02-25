"use strict";

const expect  = require('expect.js');
const fs      = require('fs');
const path    = require('path');
const spawn   = require('child_process').spawn;

const tmppath = require('nyks/fs/tmppath');

describe("Testing subprocess", function() {

  var mock  = path.join(__dirname, 'mock', 'main.js');

  it("spawn a stuff and check output (pipe output)", function(done) {
    let trace = tmppath();
    let env   = {
      DEBUG        : 'mock',
      DEBUG_FORMAT : ':namespace :body',
      DEBUG_FILE   : trace
    };

    let child = spawn("node", [mock], {env}); //stdio : 'inherit'

    child.on('exit', function() {
      var body = fs.readFileSync(trace, 'utf-8');

      expect(body).to.eql('mock test\n');
      done();
    });
  });

  it("spawn a stuff and check output (tty output)", function(done) {
    let trace = tmppath();

    let env = {
      DEBUG        : '*',
      DEBUG_FORMAT : '(:namespace) :body',
      DEBUG_FILE   : trace
    };

    let child = spawn("node", [mock], {env, stdio : 'inherit'});

    child.on('exit', function() {
      var body = fs.readFileSync(trace, 'utf-8');

      expect(body).to.eql('(mock) test\n(nope) test\n');
      done();
    });
  });

});
