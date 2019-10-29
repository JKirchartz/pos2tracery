/*
 * index.js
 * Copyleft (ↄ) 2018 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */


module.exports = {
  "pos2tracery": function pos2tracery(input, output, percent, modifiers, origin, ignore, verbose) {
    require('lib/pos2tracery').handler({
      input: input,
      output: output,
      percent: percent || 100,
      modifiers: modifiers || false,
      origin: origin || true,
      ignore: ignore,
      verbose: verbose
    });
  },
  "merge": function merge(inputA, inputB, output, verbose) {
    require('lib/merge').handler({
      inputA: inputA,
      inputB: inputB,
      output: output,
      verbose: verbose
    });
  },
  "generate": function generate(grammar, modifiers, origin, repeat) {
    require('lib/tracery').handler({
      grammar: grammar,
      modifiers: modifiers || true,
      origin: origin || "origin",
      repeat: repeat || 1
    });
  }
};
