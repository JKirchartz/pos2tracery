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
  .commandDir('../lib', { exclude: /util\.js/ })
  .completion('completion')
  .epilog('For more information visit https://jkirchartz.com/pos2tracery')
  .demandCommand()
  .wrap(100)
  .help('h')
  .alias('h', 'help')
  .argv;
