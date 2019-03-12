
var debug = require('../../');

var mock = debug('mock');
var nope = debug('nope');
mock("test");
nope("test");
