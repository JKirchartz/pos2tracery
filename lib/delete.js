/*
 * delete.js
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

exports.command = 'delete <input> [output]';
exports.alias = 'del';

exports.describe = 'delete key from tracery file';

exports.builder = function (yargs) {
  return yargs.positional("input", {
    describe: "input/source file",
    type: "string",
    nargs: 1,
    demand: "input/source file is required"
  }).positional("output", {
    describe: "optional output/destination file, if not set file prints to stdout",
    type: "string",
    nargs: 1,
  }).options({
    "keep": {
      alias: "k",
      describe: "a list of keys to keep from the input json file",
      type: "array",
      default: []
    },
    "toss": {
      alias: "t",
      describe: "a list of keys to delete from the input json file",
      type: "array",
      default: []
    }
  }).help('h').alias('h', 'help');
};

exports.handler = function merge(args) {
  let output = args.output;
  let output_json = utils.parse(utils.read(args.input));

  if (args.keep.length) {
    Object.keys(output_json).forEach((key) => {
      if (!args.keep.includes(key)) {
        delete output_json[key];
      }
    });
  }
  if (args.toss.length) {
    args.toss.forEach((key) => {
      if (output_json[key]) {
        delete output_json[key];
      }
    });
  }

  utils.write(output, output_json);
  return output_json;
};

