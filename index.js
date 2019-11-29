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


module.exports = exports = {
  "pos2tracery": function pos2tracery(args) {
    return require('./lib/pos2tracery.js').handler({
      input: args.input || null,
      output: args.output || null,
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
      input: args.input || null,
      output: args.output || null,
      percent: args.percent || 100,
      origin: args.origin || true,
      split: args.split || 's',
      verbose: args.verbose || -1
    }, "module");
  },
  "merge": function merge(args) {
    return require('./lib/merge.js').handler({
      inputA: args.inputA || null,
      inputB: args.inputB || null,
      output: args.output || null,
      dupes: args.dupes || true,
      verbose: args.verbose || -1
    }, "module");
  },
  "del": function del(args) {
    return require('./lib/delete.js').handler({
      input: args.input || null,
      output: args.output || null,
      toss: args.toss || [],
      keep: args.keep || []
    }, "module");
  },
  "generate": function generate(grammar, modifiers, origin, repeat, verbose) {
    return require('./lib/tracery.js').handler({
      input: grammar,
      modifiers: modifiers || true,
      origin: origin || "origin",
      repeat: repeat || 1,
      verbose: verbose || -1
    }, "module");
  }
};
