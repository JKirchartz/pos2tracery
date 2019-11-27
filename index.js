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
  "pos2tracery": function pos2tracery(input, output, percent, modifiers, origin, ignore, split, verbose) {
    return require('./lib/pos2tracery.js').handler({
      input: input,
      output: output,
      percent: percent || 100,
      modifiers: modifiers || false,
      origin: origin || true,
      ignore: ignore || [],
      split: split || 's',
      verbose: verbose || -1
    }, "module");
  },
  "soundex": function soundex(input, output, percent, origin, split, verbose) {
    return require('./lib/soundex.js').handler({
      input: input,
      output: output,
      percent: percent || 100,
      origin: origin || true,
      split: split || 's',
      verbose: verbose || -1
    }, "module");
  },
  "merge": function merge(inputA, inputB, output, dupes, verbose) {
    return require('./lib/merge.js').handler({
      inputA: inputA,
      inputB: inputB,
      output: output,
      dupes: dupes || true,
      verbose: verbose || -1
    }, "module");
  },
  "del": function del(input, output, keep, toss) {
    return require('./lib/delete.js').handler({
      input: input,
      output: output,
      toss: toss || [],
      keep: keep || []
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
