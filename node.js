"use strict";

const fs    = require('fs');
const debug = require('./debug');

if(!process.env.DEBUG_FD) {

  if(process.env.DEBUG_FILE)
    process.env.DEBUG_FD = fs.openSync(process.env.DEBUG_FILE, "a+");
}

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

debug.output = (buf) => fs.writeSync(fd, buf + "\n");


module.exports = debug;

