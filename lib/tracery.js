/*
 * tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const tracery = require('tracery-grammar');
const fs = require('fs');

exports.handler = function generate(args) {
  var grammar = tracery.createGrammar(JSON.parse(fs.readFileSync(args.input).toString()));

  if (args.modifiers) {
    grammar.addModifiers(tracery.baseEngModifiers);
  }

  for (var r=args.r; r>0; r--) {
    console.log(grammar.flatten('#'+ args.origin + '#') + "\n");
  }
};

exports.command = ['generate <grammar> [options]', 'gen', 'g'];
exports.describe = 'generate sentences from tracery';
exports.builder =  (yargs) => {
  yargs.positional("grammar", {
    describe: "input/source file",
    type: "string",
    nargs: 1,
    demand: "input/source file is required"
  }).options({
    "m": {
      alias: "modifiers",
      describe: "use modifiers",
      type: "boolean",
      default: true
    },
    "o": {
      alias: "origin",
      describe: "use specified origin to create sentences",
      type: "string",
      nargs: 1,
      default: "origin"
    },
    "r": {
      alias: "repeat",
      describe: "define number of sentence to generate",
      default: 1,
      nargs: 1,
      type: "number"
    }
  }).help().argv;
};

