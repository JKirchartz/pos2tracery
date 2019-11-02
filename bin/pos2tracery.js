#! /usr/bin/env node
/*
 * pos2tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

var yargs = require('yargs');

yargs.version()
  .version()
  .completion('completion')
  .commandDir('../lib/', { exclude: /util\.js/ })
  .demandCommand()
  .epilog('For more information visit https://jkirchartz.com/pos2tracery')
  .help('h').alias('h', 'help').argv;

