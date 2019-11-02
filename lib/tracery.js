/*
 * tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

const tracery = require('tracery-grammar');
const fs = require('fs');

const generate = function(args) {
  var grammar = tracery.createGrammar(JSON.parse(fs.readFileSync(args.input).toString()));

  if (args.modifiers) {
    grammar.addModifiers(tracery.baseEngModifiers);
  }

  for (var r=args.r; r>0; r--) {
    console.log(grammar.flatten('#'+ args.origin + '#') + "\n");
  }
};


exports.command = 'generate <grammar> [options]';
exports.describe = 'generate sentences from tracery';
exports.builder =  (yargs) => {
  yargs.command("generate <grammar> [options]", (yargs) => {
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
  });
};

exports.handler = function (argv) {
  generate(argv.slice(1));
};

module.exports = generate;
