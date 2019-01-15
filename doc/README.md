[![npm Version](https://img.shields.io/npm/v/node-d3ck-bstrap.svg)](https://www.npmjs.com/package/node-d3ck-bstrap)
[![JS-Standard](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://api.travis-ci.org/d3ck-org/node-d3ck-bstrap.svg?branch=master)](https://travis-ci.org/d3ck-org/node-d3ck-bstrap)
[![Dependency Status](https://david-dm.org/d3ck-org/node-d3ck-bstrap.svg)](https://david-dm.org/d3ck-org/node-d3ck-bstrap)

# node-d3ck-bstrap

Lightweight bootstrapping for node.js applications

**Please note** the major version of this module: [Major version zero (0.y.z) is for initial development. Anything may change at any time. The public API should not be considered stable.](http://semver.org/#spec-item-4).

## Features

Uses the modules [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log), [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg), [command-line-args](https://github.com/75lb/command-line-args) and optional
[node-uuid](https://github.com/broofa/node-uuid) to bootstrap (logging, configuration, command line arguments) a node.js application.

Features from [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log):

  * Lightweight and simple wrapper + utilities for [node-bunyan](https://github.com/trentm/node-bunyan) logger
  * Initializes a preconfigured (STDOUT / info) [bunyan](https://github.com/trentm/node-bunyan) logger (sharable across the whole application)
  * Supports [bunyan](https://github.com/trentm/node-bunyan) stream and log level changing with utility functions
  * Very lightweight: No extra module dependencies except [bunyan](https://github.com/trentm/node-bunyan)
  * Well documented (readme, manual and API reference)


Features from [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg):

  * Lightweight and simple configuration management based on JSON files
  * Supports staging
  * Supports environment variables and `init()` arguments to define configuration directories
  * Features a flat configuration structure with camel case keys (nested structures also possible)
  * Very lightweight: No extra module dependencies
  * Well documented (readme, manual and API reference)


Summary of [command-line-args](https://github.com/75lb/command-line-args):
  * _A library to collect command-line args and generate a usage guide_

Summary of [node-uuid](https://github.com/broofa/node-uuid):
  * _Simple, fast generation of RFC4122 UUIDS_

## Installation

    npm install node-d3ck-bstrap

## Usage

Configuration file:

    $ cat /home/foo/etc/cfg.json
    {"foo": "from cfg file"}

node.js application:

    var bstrap = require('node-d3ck-bstrap')
    var cfg = bstrap.cfg
    var log = bstrap.log

    // define supported command line arguments
    var clargs = {
      args: [
        {name: 'action', alias: 'a', type: String, description: 'Action: start, stop'}
      ],
      addArgs: ['help', 'verbose', 'quiet', 'stage', 'cfgdir'],
      usage: {
        title: 'Sample script for node-d3ck-bstrap',
        description: 'An application bootstrapped by node-d3ck-bstrap',
        synopsis: [
          '$ node [bold]{foo.js} --action X [--verbose] [--stage X] ...',
        ],
        examples: [
          '$ node [bold]{test.js} --action start --verbose'
        ],
        footer: 'Project home: [underline]{https://github.com/d3ck-org/node-d3ck-bstrap}'
      }
    }

    // bootstrapping
    var opts = {stage: 'dev', uuid: false}
    var data = {bar: 'from init()'}
    bstrap.init(clargs, opts, data)

    // print the configuration with the STDOUT-info bunyan logger
    log.info({cfg: cfg.get()}, 'Dumping configuration')

Run the application:

    $ node /path/to/script/foo.js -a start | ./node_modules/node-d3ck-log/node_modules/.bin/bunyan
      [2015-11-09T15:34:09.330Z]  INFO: stdout/2901: Dumping configuration
        cfg: {
          "_startTime": 1447083402646,
          "_myFilePath": "/path/to/script/foo.js",
          "_clargs": {                        // all command line arguments
            "action": "start"
          },
          "_pid": 2924,
          "_errors": 0,
          "_warnings": 0,
          "_count": 0,
          "_logLevel": "info",
          "_logStream": "stdout",
          "_verbose": false,
          "_quiet": false,
          "_uuid": null,
          "_uid": "path_to_script_foo_js",
          "_myFileName": "foo.js",
          "_myDirPath": "/path/to/script",
          "_tmpFileName": "foo.js.tmp",
          "_stage": "dev",
          "_cfgFiles": [
            "/path/to/script/cfg.json"
          ],
          "action": "start",                  // command line argument
          "bar": "from init()",               // init() argument
          "foo": "from cfg file"              // JSON cfg file value
        }

So, [node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap) ...

* reads the JSON configuration file
* parses the command line arguments
* exports the configuration, command line arguments and some other useful values as `cfg`
* initializes and preconfigures the [bunyan](https://github.com/trentm/node-bunyan) logger

When the _--help_ command line argument is set, only the usage message is printed:

    $ node /path/to/script/foo.js -h
      USAGE HELP:

      Sample script for node-d3ck-bstrap
        An application bootstrapped by node-d3ck-bstrap

      Synopsis
        $ node foo.js --action X [--verbose] [--stage X] ...

      Options
        -a, --action string   Action: start, stop                   
        -h, --help            Display this usage guide              
        -v, --verbose         Enable verbose mode                   
        -Q, --quiet           Enable silent mode                    
        -S, --stage string    Set stage (e.g. to dev, test or prod)

      Examples
        $ node foo.js --action start --verbose

        Project home: https://github.com/d3ck-org/node-d3ck-bstrap

## Documentation

* [User Manual](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/manual.md)
* [API Reference](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/api.md)

## See also / Credits

* [node-bunyan](https://github.com/trentm/node-bunyan)
* [command-line-args](https://github.com/75lb/command-line-args)
* [node-uuid](https://github.com/broofa/node-uuid)
* [js-standard](https://github.com/feross/standard)
* [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown)
* [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg)
* [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log)
