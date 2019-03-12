"use strict";

const fs       = require('fs');
const debug = require('./debug');

debug.output = (buf) => process.stderr.write(buf + "\n");

if(process.env.DEBUG_FILE) {
  let stream =  fs.createWriteStream(process.env.DEBUG_FILE);
  debug.output = (buf) => stream.write(buf + "\n");
}


module.exports = debug;
