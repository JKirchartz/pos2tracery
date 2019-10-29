/*
 * pos2tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

var yargs = require('yargs');

yargs.version()
  .command(["$0", "pos", "p"], "convert corpus to tracery grammar based on parts-of-speech", require('../lib/pos2tracery.js'))
  .command(["merge", "m"], "merge 2 tracery grammars", require('../lib/merge.js'))
  .command(["generate", "gen", "g"], "generate text from tracery grammar", require('../lib/tracery.js'))
  .help('h').alias('h', 'help').argv;

// TODO: use handlers to send correct arguments to module.exports functions


