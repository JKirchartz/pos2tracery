/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
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

var path = require("path");

module.exports = exports = {
  "pos2tracery": function pos2tracery(args) {
    return require('./lib/pos2tracery.js').handler({
      input: path.resolve(args.input) || null,
      output: path.resolve(args.output) || null,
      percent: args.percent || 100,
      modifiers: args.modifiers || false,
      origin: args.origin || true,
      ignore: args.ignore || [],
      split: args.split || 's',
      verbose: args.verbose || -1
    }, "module");
  },
  "soundex": function soundex(args) {
    return require('./lib/soundex.js').handler({
      input: path.resolve(args.input) || null,
      output: path.resolve(args.output) || null,
      percent: args.percent || 100,
      origin: args.origin || true,
      split: args.split || 's',
      verbose: args.verbose || -1
    }, "module");
  },
  "merge": function merge(args) {
    return require('./lib/merge.js').handler({
      inputA: path.resolve(args.inputA) || null,
      inputB: path.resolve(args.inputB) || null,
      output: path.resolve(args.output) || null,
      dupes: args.dupes || true,
      verbose: args.verbose || -1
    }, "module");
  },
  "del": function del(args) {
    return require('./lib/delete.js').handler({
      input: path.resolve(args.input) || null,
      output: path.resolve(args.output) || null,
      toss: args.toss || [],
      keep: args.keep || []
    }, "module");
  },
  "generate": function generate(args) {
    return require('./lib/tracery.js').handler({
      input: path.resolve(args.input),
      modifiers: args.modifiers || true,
      origin:args.origin || true,
      repeat: args.repeat || 1,
      evaluate: args.evaluate || false,
      custom_modifiers: path.resolve(args.custom_modifiers) || null,
      verbose: args.verbose || -1
    }, "module");
  }
};
