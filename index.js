'use strict'

var util = require('util')
var path = require('path')

var cmdLineArgs = require('command-line-args')
var cfg = require('node-d3ck-cfg')
module.exports.cfg = cfg
var log = require('node-d3ck-log')
module.exports.log = log
var logUtil = require('node-d3ck-log/util')
module.exports.logUtil = logUtil

var cmdLineParser, cmdLineUsage

/**
* Bootstrapping: Exposes the JSON, command line and logger configuration.
* @description node-d3ck-bstrap uses the following modules et al.:
*  {@link https://github.com/d3ck-org/node-d3ck-cfg|node-d3ck-cfg},
*  {@link https://github.com/d3ck-org/node-d3ck-log|node-d3ck-log},
*  {@link https://github.com/75lb/command-line-args|command-line-args},
* and optional {@link https://github.com/broofa/node-uuid|node-uuid}. See the linked documentations for related parameter details and examples.
* @arg {object} [clargs={}] - Options for command line arguments, see the {@link https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/manual.md|manual}
* @arg {object} [opts] - Options (see below)
* @arg {boolean} [opts.uuid=false] - Add a UUID to cfg (needs the {@link https://github.com/broofa/node-uuid|node-uuid} module)
* @arg {string} [opts.stage] - Set the stage (e.g. 'dev'), see the {@link https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data|node-d3ck-cfg} API reference and the {@link https://github.com/d3ck-org/node-d3ck-bstrap/blob/master/doc/manual.md|manual} for stage setting details
* @arg {string[]} [opts.cfgDirs=[]] - Additional cfg directories that contain JSON files, see the {@link https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data|node-d3ck-cfg} API reference
* @arg {boolean} [opts.verbose=false] - Enable verbose mode (prints the cfg search path), see the {@link https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data|node-d3ck-cfg} API reference
* @arg {boolean} [opts.noClargsMerge=false] - Disable adding of command line arguments to the cfg root level, so access the arguments only with cfg.get('_clargs').xxx
* @arg {string} [opts.enc=utf-8] - Encoding of JSON cfg files, see the {@link https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data|node-d3ck-cfg} API reference
* @arg {object} [data={}] - Additional cfg settings, see the {@link https://github.com/d3ck-org/node-d3ck-cfg/blob/master/doc/api.md#node-d3ck-cfginitopts-data|node-d3ck-cfg} API reference
* @example
* // set stage to 'prod' (reads cfg.json and cfg.prod.json files) and add two directories to cfg search path but no command line arguments and no additional cfg values.
* init({}, {stage: 'prod', cfgDirs: ['/home/foo/etc1', '/home/foo/etc2']})
* // set stage to 'dev', set 'foo' and 'bar' as additional cfg values but no command line arguments
* init({}, {stage: 'dev'}, {'foo': 1, 'bar': 2})
*/
module.exports.init = function init (clargs, opts, data) {
  clargs = clargs || {}
  cmdLineUsage = clargs.usage || {}
  opts = opts || {}
  opts.myFilePath = process.argv[1] || 'dont_know_my_path' // cmdLineArgs changes process.argv
  clargs = getCmdLineArgs(clargs.args, clargs.addArgs)
  setCfg(clargs, opts, data)
  setLogger()
  log.trace('Bootstrap successfully finished. Parsed cfg files: %s',
            cfg.get('_cfgFiles').length > 0
              ? cfg.get('_cfgFiles').join(', ')
              : 'None found')
}

/**
* Print a usage message and exit the node process.
* @arg {string} [msg] - Print this error message above the usage lines (error mode), skip the message to print only the usage lines (help mode)
* @example
* // error mode
* usageErr('Missing action')
* // help mode
* usageErr()
*/
function usageErr (msg) {
  var usage = cmdLineParser.getUsage(cmdLineUsage)
  if (msg) {
    msg = util.format('\nUSAGE ERROR: %s\n%s\n\n', msg, usage)
  } else {
    msg = util.format('\nUSAGE HELP:\n%s\n', usage)
  }
  process.stderr.write(msg)
  process.exit(2)
}
module.exports.usageErr = usageErr

/**
* Log an error and exit the node process.
* @arg {string|Error} msg - Log this error
* @example
* bstrapErr('An error occured while boostrapping')
*/
function bstrapErr (err) {
  log.error(err)
  process.exit(1)
}
module.exports.bstrapErr = bstrapErr

/**
* @private
*/
function getCmdLineArgs (clargs, addArgs) {
  clargs = clargs || []
  addArgs = addArgs == null ? ['h', 'v', 'Q', 'S', 'C'] : addArgs
  var usedAddArgs = {}

  if (addArgs.length > 0) {
    var addArg = function addArg (argFlag, argName) {
      if ((addArgs.indexOf(argName) > -1 ||
           addArgs.indexOf(argFlag) > -1) &&
          !args[argName] && !args['_' + argFlag]) {
        return true
      }
      return false
    }

    var args = {}
    clargs.forEach(function (arg) {
      if (arg.name) args[arg.name] = true
      if (arg.alias) args['_' + arg.alias] = true
    })

    if (addArg('h', 'help')) {
      clargs.push({name: 'help', alias: 'h', type: Boolean,
      description: 'Display this usage guide'})
      usedAddArgs.help = true
    }
    if (addArg('v', 'verbose')) {
      clargs.push({name: 'verbose', alias: 'v', type: Boolean,
      description: 'Enable verbose mode'})
      usedAddArgs.verbose = true
    }
    if (addArg('Q', 'quiet')) {
      clargs.push({name: 'quiet', alias: 'Q', type: Boolean,
      description: 'Enable silent mode'})
      usedAddArgs.quiet = true
    }
    if (addArg('S', 'stage')) {
      clargs.push({name: 'stage', alias: 'S', type: String,
      description: 'Set stage (e.g. to dev, test or prod)'})
      usedAddArgs.stage = true
    }
    if (addArg('C', 'cfgDir')) {
      clargs.push({name: 'cfgdir', alias: 'C', type: String, multiple: true,
      description: 'Read JSON cfg files also from this directories'})
      usedAddArgs.cfgDir = true
    }
  }

  cmdLineParser = cmdLineArgs(clargs)
  try {
    clargs = cmdLineParser.parse()
  } catch (err) {
    usageErr(err.message)
  }
  if (clargs.help) usageErr()
  clargs.__usedAddArgs__ = usedAddArgs
  return clargs
}

/**
* @private
*/
function setCfg (clargs, opts, cfgData) {
  cfgData = cfgData || {}
  opts.cfgDirs = (opts.cfgDirs || []).concat(clargs.cfgdir || [])
  opts.stage = clargs.stage || opts.stage
  var usedAddArgs = clargs.__usedAddArgs__
  delete clargs.__usedAddArgs__

  // set defaults
  var data = {
    _startTime: new Date().getTime(),
    _myFilePath: opts.myFilePath,
    _clargs: clargs,
    _pid: process.pid,
    _errors: 0,
    _warnings: 0,
    _count: 0,
    _logLevel: 'info',
    _logStream: 'stdout',
    _verbose: false,
    _quiet: false,
    _uuid: null
  }
  data._uid = data._myFilePath.replace(/[\/\\\. ]/g, '_')
  data._uid = data._uid.replace(/^_/, '').replace(/_$/, '')
  data._myFileName = path.basename(data._myFilePath)
  data._myDirPath = path.dirname(data._myFilePath)

  if (opts.uuid) {
    try {
      var uuid = require('node-uuid')
    } catch (err) {
      console.error('ERROR: Missing peer dependency. Please install ' +
                    '"node-uuid": npm install node-uuid')
      process.exit(1)
    }
    data._uuid = uuid.v4()
  }

  var attr
  for (attr in cfgData) {  // add data from init()
    data[attr] = cfgData[attr]
  }
  for (attr in clargs) {   // add non-addArgs command line arguments
    if (!opts.noClargsMerge && !usedAddArgs[attr]) data[attr] = clargs[attr]
  }
  // set configuration
  cfg.init(opts, data)

  // command line arguments have precedence
  if (cfg.get('_clargs').quiet) {
    cfg.set('_verbose', false)
    cfg.set('_quiet', true)
    cfg.set('_logLevel', 'error')
  } else {
    if (cfg.get('_clargs').verbose) {
      cfg.set('_verbose', true)
      cfg.set('_quiet', false)
      cfg.set('_logLevel', 'trace')
    }
  }

  cfg.set('_tmpFileName',
          (cfg.get('_stage') === 'dev' || cfg.get('_stage') === 'development')
            ? data._myFileName + '.tmp'
            : util.format('%s.%s.tmp', data._myFileName, data._pid))
}

/**
* @private
*/
function setLogger () {
  if (cfg.get('_logStream') === 'stderr') {
    logUtil.setStreams([logUtil.getStderrStream(cfg.get('_logLevel'))])
  } else if (cfg.get('_logStream') === 'stdout') {
    log.level(cfg.get('_logLevel'))
  } else {
    bstrapErr(new Error('Cfg value "_logStream" is invalid: Supported are ' +
              '"stdout" and "stderr". Please see ' +
              'https://github.com/d3ck-org/node-d3ck-log for how to change ' +
              'logger streams later in the main script or other modules'))
  }
}
