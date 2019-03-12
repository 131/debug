[debug](http://github.com/131/debug) is tiny, no dependecy alternative to [debug](http://github.com/visionmedia/debug).

[debug](http://github.com/131/debug) also allows you to customize debug output format using the `DEBUG_FORMAT`.

[![Build Status](https://travis-ci.org/131/debug.svg?branch=master)](https://travis-ci.org/131/debug)
[![Version](https://img.shields.io/npm/v/debug.svg)](https://www.npmjs.com/package/debug)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)



# DEBUG_FILE 
Declare env DEBUG_FILE as the debug  target


# Available format for DEBUG_FORMAT
* use :time for ISO timestamp
* use :namespace for debug namespace
* use :body for main payload
* use :diff for last msg diff


Defaut DEBUG_FORMAT is ":time :namespace :body"

# Support for console.log/console.error
debug will duplex everything to the console into the trace file

# Support for debug
debug will overrite debug.log (per specifications) to a dedicated file

# Browserify recommandation
Exclude debug from browserify is a good way to make sure only one debug reference is loaded.

# Credits
* [131](https://github.com/131) author
* [debug](https://github.com/visionmedia/debug)

