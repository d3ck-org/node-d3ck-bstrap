# node-d3ck-bstrap

Lightweight bootstrapping for node.js applications

## Introduction

[node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap) _bootstraps_ an application: It sets configuration values, parses command line arguments and initializes a [node-bunyan](https://github.com/trentm/node-bunyan) logger. To achieve this, it uses the following modules:

* [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) delivers configuration values from parsed JSON files
* [command-line-args](https://github.com/75lb/command-line-args) delivers command lines arguments set by the user
* [node-d3ck-log](https://github.com/d3ck-org/node-d3ck-log) delivers a [node-bunyan](https://github.com/trentm/node-bunyan) logger whose settings are derived from the configuration and command line argument values

All configuration and command line argument values are stored in the central `cfg` object that can be loaded in every application module:

    // sub module
    var cfg = require('node-d3ck-bstrap').cfg

    console.log('My PID: %s', cfg.get('_pid'))
    console.log('Command line arguments set by user: %j', cfg.get('_clargs'))

The logger instance (configured by the configuration and command line arguments) and a simple utility to change the logger settings easily can also be loaded in every application module:

    // sub module
    var cfg = require('node-d3ck-bstrap').cfg
    var log = require('node-d3ck-bstrap').log
    var logUtil = require('node-d3ck-bstrap').logUtil

    // STDOUT
    log.info('My PID: %s', cfg.get('_pid'))
    log.info({args: cfg.get('_clargs')}, 'Command line arguments set by user')
    // change to STDERR
    logUtil.setStreams([logUtil.getStderrStream('trace')])
    // STDERR
    log.info('My PID: %s', cfg.get('_pid'))

## Installation

    npm install node-d3ck-bstrap

## Usage

Please see the [README](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/README.md).

## Configuration values

[node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap) uses [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) to manage the central `cfg` object that is sharable across the whole application.

There are the following possibilities to define `cfg` values:

- Add the values to JSON configuration files (supports staging)
- Pass the values to `init()`
- Add/Change the values inside the application with `cfg.set()`
- Specify the values as command line arguments (flags)

### JSON configuration files

[node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap) reads all related JSON configuration files found in the _search path_ (please see the documentation of [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) for details). The search path can be adjusted in different ways:

##### Add additional configuration directories

Set the environment variable `NODED3CK_CFG_DIRS` or `D3CK_CFG_DIRS` that will be automatically read by [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg):

    # example for the bash shell (Linux, Mac):
    #   add /tmp/etc1/cfg.json, /tmp/etc2/cfg.json
    #   and /tmp/etc3/cfg.json to search path
    $ export D3CK_CFG_DIRS="/tmp/etc2/cfg.json:/tmp/etc3/cfg.json"
    $ export NODED3CK_CFG_DIRS="/tmp/etc1/cfg.json"     // extends D3CK_CFG_DIRS

And/Or pass the directories to `init()`:

    var bstrap = require('node-d3ck-bstrap')
    var clargs = { ... }
    // add /tmp/etc4/cfg.json and /tmp/etc5/cfg.json to the search path
    //   extends values from environment variables
    var opts = { cfgDirs: ['/tmp/etc4', '/tmp/etc5'] }
    bstrap.init(clargs, opts)

And/Or use the `--cfgdir` command line argument (only possible when `addArgs`
contains _cfgdir_, see the ___Command line arguments___ section):

    # add /tmp/etc6/cfg.json and /tmp/etc7/cfg.json to the search path
    #   extends init() parameter
    $ app.js --cfgdir /tmp/etc6 --cfgdir /tmp/etc7

##### Set the stage

Set the environment variable `NODED3CK_STAGE` or `D3CK_STAGE` or `STAGE `that will be automatically read by [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg):

    # example for the bash shell (Linux, Mac)
    #   search for cfg.json and cfg.dev.json in the search path
    $ export STAGE="test"
    # or:
    $ export D3CK_STAGE="prod"      # overwrites STAGE
    # or:
    $ export NODED3CK_STAGE="dev"   # overwrites STAGE and D3CK_STAGE


And/Or pass the stage to `init()`:

    var bstrap = require('node-d3ck-bstrap')
    var clargs = { ... }
    // search for cfg.json and cfg.test.json in the search path
    var opts = { stage: 'test' }   // overwrites value from env variables
    bstrap.init(clargs, opts)

And/Or use the `--stage` command line argument (only possible when `addArgs` contains _stage_,
see the ___Command line arguments___ section):

    # search for cfg.json and cfg.prod.json in the search path
    $ app.js --stage prod          // overwrites init() parameter

#### The final search path

Please see the [node-d3ck-cfg manual](https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/manual.md) for a detailed search path example. It shows the read order of the JSON configuration files (latter overwrite former configuration values). To print and debug the search path, pass the _verbose_ option to `init()`:

    var bstrap = require('node-d3ck-bstrap')
    var clargs = { ... }
    var opts = { verbose: true }
    bstrap.init(clargs, opts)

### init() parameters

It is easy to pass additional configuration values during the initialization:

    var bstrap = require('node-d3ck-bstrap')
    var clargs = { ... }
    var opts = { ... }
    var data = {'foo': 1, 'bar': 2}
    bstrap.init(clargs, opts, data)  // cfg contains "foo" and "bar"

Please see [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) for details.

### cfg.set() function

To change or add configuration values inside the application, use `cfg.set()`:

    var bstrap = require('node-d3ck-bstrap')
    var cfg = bstrap.cfg

    bstrap.init()
    var host = cfg.set('host', '127.4.4.4')  // sets and returns 127.4.4.4

Please see [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg) for details.

## Command line arguments (flags)

### Define supported flags

[command-line-args](https://github.com/75lb/command-line-args) is used to parse command line arguments (_flags_). Please see the related documentation for most details of the following lines:

    // define supported command line arguments and usage messages
    var clargs = {
      args: [
        {name: 'action', alias: 'a', type: String, description: 'Action: start, stop'}
      ],
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
      },
      addArgs: ['help', 'verbose', 'quiet', 'stage', 'cfgdir']
    }

#### Popular flags

[node-d3ck-bstrap](https://github.com/d3ck-org/node-d3ck-bstrap) supplements the `addArgs` property. It is used to add popular flags to the amount of accepted command line arguments. By default (if `addArgs` isn't set explicitly) the following flags are accepted:

* `--help` (`-h`)
* `--verbose` (`-v`)
* `--quiet` (`-Q`)
* `--stage` (`-S`)
* `--cfgdir` (`-C`)

To remove one, multiple or all popular flags, `addArgs` must be set. Please note: When `addArgs` is set, all not listed flags are disabled. Some examples:

This setting...

    var clargs = {
      ...
      addArgs: []
    }

has the following impact...

* All popular flags are disabled.
* But usually it is useful to enable the `--help` flag at least: `addArgs: ['help']`

This setting...

    var clargs = {
      ...
      addArgs: ['help', 'verbose', 'quiet']
    }

has the following impact...

* The `--help`, `--verbose` and `--quiet` popular flags are accepted (but `--stage` and `--cfgdir` are not accepted now).
* When the user sets `--help`: The app prints a usage message and exits.
* When the user sets `--verbose`: `cfg.get('_verbose')` returns _true_ and the [bunyan](https://github.com/trentm/node-bunyan) log level  `cfg.get('_logLevel')` is set to _trace_.
* When the user sets `--quiet`: `cfg.get('_quiet')` returns _true_ and the [bunyan](https://github.com/trentm/node-bunyan) log level `cfg.get('_logLevel')` is set to _error_.

And this setting...

    var clargs = {
      ...
      addArgs: ['help', 'stage', 'cfgdir']
    }

has the following impact...

* The `--help`, `--stage` and `--cfgdir` popular flags are accepted (but `--verbose` and `--quiet` are not accepted now).
* The user can define the (`cfg`) stage with `--stage`: `app.js --stage dev`
* With `--cfgdir` the user can define one or more directories which contain JSON configuration files that will be parsed by [node-d3ck-cfg](https://github.com/d3ck-org/node-d3ck-cfg):
    * `app.js --cfgdir /tmp/etc1 /tmp/etc2`
    * `app.js --cfgdir "/tmp/etc1" --cfgdir "/tmp/etc2"`

### Get flags specified by user

    var bstrap = require('node-d3ck-bstrap')
    var cfg = bstrap.cfg

    var clargs = { action: 'start', ... }

    // pass the arguments to the bootstrapping process
    bstrap.init(clargs)

    // get the command line arguments specified by user
    var userClargs = cfg.get('_clargs')
    var action = cfg.get('_clargs').action
    // same as cfg.get('_clargs').action when "noClargsMerge" is false (default):
    action = cfg.get('action')

By default all flag values are added to the `cfg` root level. Enabling the `noClargsMergs` option disables this behavior:

    bstrap.init(clargs, {noClargsMerge: true})

Now, all flags are only accessible with `cfg.get('clargs').<flag>`.

## See also

* [README](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/README.md)
* [API Reference](https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/api.md)
