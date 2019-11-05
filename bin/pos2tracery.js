#!/usr/bin/env node
'use strict';

/*
 * pos2tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

var yargs = require('yargs');

yargs.version()
  .usage('Usage: $0 [pos|merge|generate|completion]')
  .commandDir('../lib/', { exclude: /utils\.js/ })
  .completion('completion')
  .epilog('For more information visit https://jkirchartz.com/pos2tracery')
  .demandCommand()
  .wrap(yargs.terminalWidth())
  .help('h')
  .alias('h', 'help')
  .alias('$0', 'help')
  .strict()
  .argv;
