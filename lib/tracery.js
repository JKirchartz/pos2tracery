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
const utils = require('../lib/utils');

exports.command = 'generate <input>';

exports.alias = ['gen', 'g'];

exports.describe = 'generate sentences from tracery';

exports.builder = function (yargs) {
  return yargs.positional("input", {
    describe: "input/source grammar file",
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
    },
    "verbose": {
      alias: "v",
      describe: "output information about internal processes",
      type: "count"
    }
  }).help().alias('h', 'help');
};

exports.handler = function generate(args) {
  var returning;
  var log = utils.logger(args.verbose);
  log(1)("generating grammar");
  var grammar = tracery.createGrammar(utils.parse(utils.read(args.input)));

  if (args.modifiers) {
    log(1)("adding modifiers");
    grammar.addModifiers(tracery.baseEngModifiers);
  }

  for (var r=args.r, tmp; r>0; r--) {
    log(1)("generated sentence%s:\n", (args.r > 1 ? " #" + r : "") );
    tmp = grammar.flatten('#'+ args.origin + '#') + "\n";
    returning += tmp;
    log(0)(tmp);
  }

  return returning;
};

