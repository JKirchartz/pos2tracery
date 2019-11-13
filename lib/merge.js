/*
 * merge.js
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

const utils = require('./utils');

exports.command = 'merge <inputA> <inputB> [output]';
exports.alias = 'm';

exports.describe = 'merge 2 tracery grammars together';

exports.builder = function (yargs) {
  return yargs.positional("inputA", {
    describe: "input/source file",
    type: "string",
    nargs: 1,
    demand: "input/source file is required"
  }).positional("inputB", {
    describe: "input/source file",
    type: "string",
    nargs: 1,
    demand: "input/source file is required"
  }).positional("output", {
    describe: "optional output/destination file, if not set file prints to stdout",
    type: "string",
    nargs: 1,
  }).options({
    "v": {
      alias: "verbose",
      describe: "print details while processing",
      type: "boolean",
      default: false
    },
    "d": {
      alias: "dupes",
      descripte: "allow duplicates",
      type: "boolean",
      default: true
    }
  }).help('h').alias('h', 'help');
};

exports.handler = function merge(args) {
  let input_A = args.inputA;
  let input_B = args.inputB;
  let dupes = args.dupes;
  let output = args.output;

  let log = utils.logger(args.verbose);

  function makeArray(i) {
    return typeof i === 'string' ? Array(i) : i;
  }

  if (input_A, input_B) {
    let output_json = utils.parse(utils.read(input_A));
    let file_B = utils.parse(utils.read(input_B));
    log(0)("merging %s with %s", input_A, input_B);

    for (let key in file_B) {
      if (typeof output_json[key] !== 'undefined') {
        log(1)('concatenating array(s): %s', key);
        output_json[key] = makeArray(output_json[key]).concat(makeArray(file_B[key]));
      } else {
        log(1)('adding new key: %s', key, file_B[key]);
        output_json[key] = makeArray(file_B[key]);
      }
      if (!dupes) {
        // remove duplicates
        output_json[key] = Array.from(new Set(output_json[key]));
      }
    }

    if (output_json) {
      utils.write(output, output_json);
    } else {
      log("something went wrong merging files");
    }
    return output_json;
  }
};

