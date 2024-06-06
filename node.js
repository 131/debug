"use strict";

const fs    = require('fs');
const debug = require('./debug');


debug.output = (buf) => process.stderr.write(buf + "\n");


module.exports = debug;

