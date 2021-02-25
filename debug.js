"use strict";

const humanize = require('ms');
const util = require('util');


var prevTime;

const names = [];
const skips = [];
const formatters = {};

exports = module.exports = debug;

exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.output  = function () {};

const format   = process.env.DEBUG_FORMAT || ":time :namespace :body"; // :diff


if("DEBUG_INSPECT_BREAKLENGTH" in process.env) {
  //set as global, it is fine
  util.inspect.defaultOptions.breakLength = parseInt(process.env.DEBUG_INSPECT_BREAKLENGTH) || Infinity;
}




function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }

  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    log.apply(self, arguments);
  }

  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}



function enable(namespaces) {
  save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for(var i = 0; i < len; i++) {
    if(!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/[\\^$+?.()|[\]{}]/g, '\\$&').replace(/\*/g, '.*?');
    if(namespaces[0] === '-')
      skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    else
      names.push(new RegExp('^' + namespaces + '$'));

  }
}


function disable() {
  exports.enable('');
}



function enabled(name) {
  var i, len;
  for(i = 0, len = skips.length; i < len; i++) {
    if(skips[i].test(name))
      return false;

  }
  for(i = 0, len = names.length; i < len; i++) {
    if(names[i].test(name))
      return true;

  }
  return false;
}



function coerce(val) {
  if(val instanceof Error) return val.stack || val.message;
  return val;
}



var log = function() {

  var args = [].slice.apply(arguments);

  args[0] = coerce(args[0]);

  if(typeof args[0] !== 'string') {
    // anything else let's inspect with %o
    args = ['%o'].concat(args);
  }

  var index = 0;
  args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
    // if we encounter an escaped % then don't increase the array index
    if(match === '%%')
      return match;
    index++;
    var formatter = formatters[format];
    if(typeof formatter === 'function') {
      var val = args[index];
      match = formatter.call(null, val);

      // now we need to remove `args[index]` since it's inlined in the `format`
      args.splice(index, 1);
      index--;
    }
    return match;
  });

  var body = util.format.apply(this, args);
  var now = new Date();


  function pad(number) {
    return number < 10 ? '0' + number : number;
  }

  var time =  now.getFullYear() +
        '-' + pad(now.getMonth() + 1) +
        '-' + pad(now.getDate()) +
        ' ' + pad(now.getHours()) +
        ':' + pad(now.getMinutes()) +
        ':' + pad(now.getSeconds()) +
        '.' + (now.getMilliseconds() / 1000).toFixed(3).slice(2, 5);


  var namespace = this.namespace || 'console';

  var str = format
    .replace(':namespace', namespace)
    .replace(':time', time)
    .replace(':body', body)
    .replace(':diff', this.diff ? humanize(this.diff) : "");

  exports.output(str);
};




function save(namespaces) {
  if(namespaces == null) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}



enable(process.env.DEBUG);

