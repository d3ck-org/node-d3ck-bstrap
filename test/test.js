'use strict'

// YOUR SCRIPT ===> remove this require calls
var assert = require('assert')
var bstrap = require('..')
var cfg = bstrap.cfg
var log = bstrap.log

// YOUR SCRIPT ===> uncomment this require calls
// var bstrap = require('node-d3ck-bstrap')
// var cfg = require('node-d3ck-bstrap/cfg')
// var log = require('node-d3ck-bstrap/log')

// YOUR SCRIPT ===> remove this function
var should = function should (value, expected, msg) {
  assert(value === expected, msg)
  log.info({test: 'passed'}, msg)
  cfg.set('_count', cfg.get('_count') + 1)
}

/*
* COMMAND LINE part
*   used modules and documentations:
*     https://github.com/75lb/command-line-args
*     https://github.com/75lb/command-line-usage
*
*   --verbose (v), --quiet (-Q), --stage (-S), --cfgdir (-C) and --help (-h) arguments
*   will automatically be added by init() if they are listed in "addArgs" (which is default)
*   and clargs doesn't contain this flags
*
*   run this script with --help to show all arguments
*
* YOUR SCRIPT ===> adjust this object as needed
*/
var clargs = {
  args: [
    {name: 'action', alias: 'a', type: String, description: 'Action: start, stop, error'}
  ],
  addArgs: ['help', 'verbose', 'quiet', 'stage', 'cfgdir'],
  usage: {
    title: 'Tests for node-d3ck-bstrap',
    description: 'Tests the node-d3ck-bstrap module.',
    synopsis: [
      '$ node [bold]{test.js} --action X [--verbose] [--stage X] [--cfgdir /foo /bar]',
      '$ node [bold]{test.js} --action X [--quiet] [--stage X] [--cfgdir /foo /bar]'
    ],
    examples: [
      '$ node [bold]{test.js} --action start --verbose --cfgdir /tmp/foo /tmp/bar',
      '$ node [bold]{test.js} -a stop --cfgdir /tmp/foo -C /tmp/bar'
    ],
    footer: 'Project home: [underline]{https://github.com/d3ck-org/node-d3ck-bstrap}'
  }
}

/*
* SETUP part
*   check configuration (and command line) settings after bootstrapping and adjust/extend
*   the settings if necessary
*
* YOUR SCRIPT ===> adjust this function as needed
*/
var setup = function setup () {
  cfg.set('action', cfg.get('_clargs').action)
  if (!cfg.get('action')) bstrap.usageErr('Missing action')
  if (!(['start', 'stop', 'error'].indexOf(cfg.get('action')) > -1)) {
    bstrap.usageErr('Invalid action')
  }

  should(cfg.get('start'), null, 'Cfg value "start" should be null')
  should(cfg.get('stop'), null, 'Cfg value "stop" should be null')
  should(cfg.get('raiseError'), null, 'Cfg value "raiseError" should be null')
  should(cfg.get('_errors'), 0, 'Cfg value "_errors" should be 0')

  should(cfg.get('action'), cfg.get('_clargs').action,
    'Cfg value and related command line argument "action" are equal')

  if (cfg.get('action') === 'start') {
    cfg.set('start', true)
    should(cfg.get('start'), true, 'Cfg value "start" should now be true')
  } else if (cfg.get('action') === 'stop') {
    cfg.set('stop', true)
    should(cfg.get('stop'), true, 'Cfg value "stop" should now be true')
  } else {
    cfg.set('raiseError', true)
    cfg.set('_errors', cfg.get('_errors') + 1)
    should(cfg.get('raiseError'), true, 'Cfg value "raiseError" should now be true')
    should(cfg.get('_errors'), 1, 'Cfg value "_errors" should now be 1')
  }

  if (cfg.get('_verbose')) should(log.level(), 10, 'Log level should be "trace"')
  if (cfg.get('_quiet')) should(log.level(), 50, 'Log level should be "error"')
  should(cfg.get('foo'), 'from cfg file', 'Cfg value "foo" should be "from cfg file"')
  should(cfg.get('bar'), 'from init()', 'Cfg value "bar" should be "from init()"')
  should(cfg.get('dflt', 'default'), 'default',
    'Not existing cfg value "dflt" should fallback to "default"')

  if (cfg.jget('raise', 'error')) { // cfg.jget('raise','error') is same as cfg.get('raiseError')
    var err = new Error(cfg.get('_errors') + ' setup errors occured: Action set to "error"')
    bstrap.bstrapErr(err)
  }
}

/*
* BOOTSTRAPPING part
*   used configuration module and documentation: https://github.com/d3ck-org/node-d3ck-cfg
*
*   init() accepts the parameters listed on https://github.com/d3ck-org/node-d3ck-bstrap and
*   also all parameters from https://github.com/d3ck-org/node-d3ck-cfg (e.g "cfgDirs" and "uuid")
*
* YOUR SCRIPT ===> adjust the "opts" and "data" parameter as needed
*/
var opts = {stage: 'dev', cfgDirs: [], uuid: false}
var data = {bar: 'from init()'}
bstrap.init(clargs, opts, data)

/*
* BUSINESS LOGIC part
*   run more tests
*
* YOUR SCRIPT ===> adjust this part as needed
*/
if (!cfg.get('_quiet') && ['warn', 'error', 'fatal'].indexOf(cfg.get('_logLevel')) > -1) {
  cfg.set('_logLevel', 'info')     // force INFO log level, we want to see something :)
  log.level(cfg.get('_logLevel'))  // bunyan function (https://github.com/trentm/node-bunyan#levels)
}
log.info('Checking configuration + command line arguments and running tests')
setup()
log.info({cfg: cfg.get()}, 'Dumping configuration')

/*
* FINISH part
*   print a summary
*
* YOUR SCRIPT ===> adjust this part as needed
*/
log.info('%s of %s tests successfully passed in %s sec',
  cfg.get('_count'), cfg.get('_count'),
  (new Date().getTime() - cfg.get('_startTime')) / 1000)
