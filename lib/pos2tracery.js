/*
 * pos2tracery.js
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
const util = require('wink-nlp-utils');
const pos = require('wink-pos-tagger');
const contractions = require('expand-contractions');
const tagger = pos();


exports.command = 'pos <input> [output]';
exports.alias = 'p';
exports.describe = 'convert corpus to tracery with POS tags';
exports.builder = function (yargs) {
  yargs.usage('Usage: $0 [pos|p] <input> [output] [options]')
    .positional("input", {
      describe: "input/source file",
      type: "string",
      nargs: 1,
      demand: "input/source file is required"
    }).positional("output", {
      describe: "optional output/destination file, if not set file prints to stdout",
      type: "string",
      nargs: 1,
    }).options({
      "verbose": {
        alias: "v",
        describe: "print details while processing",
        type: "count"
      },
      "percent": {
        alias: "p",
        describe: "limit the percentage of words replaced with their POS tags, as number between 1 and 100",
        default: 100,
        type: "number",
        nargs: 1,
      },
      "modifiers" : {
        alias: "m",
        describe: "replace english modifiers with their equivalent tracery.modifier function",
        default: false,
        type: "boolean"
      },
      "origin": {
        alias: "o",
        describe: "Include \"origin\" key in tracery file, specify --no-origin to not add this key",
        type: "boolean",
        default: true
      },
      "ignore" : {
        "alias": "i",
        describe: "list of parts of speech to not tagify",
        default: [],
        type: "array"
      },
      "split" : {
        alias: "s",
        describe: "determine string splitting strategy: line, paragraph, or sentence",
        choices: ["l", "p", "s"],
        nargs: 1,
        default: "s"
      }
    }).coerce(['input', 'output'], require('path').resolve).help('h').alias('h', 'help');
};

exports.handler = function pos2tracery(args, type) {
  var tracery = { 'sentences' : []};
  if (args.origin) {
    tracery["origin"] = ["#sentences#"];
  }

  const log = utils.logger(args.verbose);

  // generate tracery from POS
  const parseSentence = (str) => {
    // clean up sentence
    str = str.replace(/[\r\n\s]+/g, ' ');
    str = str.replace(/--/g, '-');
    str = contractions.expand(str);
    // tag sentence
    let taggedSentence = tagger.tagSentence(str);
    // fix peculiarity of wink-pos-tagger tagging sentences as NNP
    let scragglers = [];
    taggedSentence = taggedSentence.filter((obj) => {
      if (obj.pos.slice(0,3) === "NPP" &&
        (obj.value.indexOf(" ") > -1 || obj.value.indexOf("\"") > -1)) {
        scragglers.push(tagger.tagSentence(obj.value));
        return false;
      }
      return true;
    });
    taggedSentence = taggedSentence.concat(scragglers);
    // munge sentences to create tracery
    taggedSentence = taggedSentence.filter(tagifySentence);
    log(2)("tagged sentence:", taggedSentence);
    return tidySentences(taggedSentence);
  };

  const tidySentences = (arr) => {
    if (!arr || arr.length == 0) {
      return "";
    }
    // reduce array of objects to one object and return it's value
    return arr.reduce((a, b) => {
      // apply proper spacing, being mindful of punctuation
      if ( b.tag === "punctuation" || b.pos === "POS" ) {
        return { value : a.value + "" + b.value };
      } else {
        return { value : a.value + " " + b.value };
      }
    }).value;
  };

  let was_a_or_an = false;
  const tagifySentence = (obj, i, arr) => {
    let key = obj.pos === "." ? "ending" : obj.pos;
    let word = obj.normal;
    log(3)("found: %s (%s):", obj.value, word);
    if (args.ignore.indexOf(obj.pos) !== -1) {
      return obj; // return ignored values unscathed
    } else if(obj.tag === "punctuation" || obj.pos === "POS") {
      // escape problematic punctuation, just in case
      obj.value = ["'", '"', '[', ']', '#'].indexOf(obj.value) > -1 ? "\\" + obj.value : obj.value;
      return obj;
    }
    if ( ! tracery[key] ) {
      tracery[key] = [];
    }
    if (obj.lemma && args.modifiers) {
      if ((obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed')) {
        word = obj.lemma;
      }
    }
    if ( tracery[key].indexOf(word) === -1  && (word !== "a" || word !=="an")) {
      tracery[key].push(word);
    }
    obj.value = utils.chance(args.percent) ? obj.value : '#' + key + '#';
    if (tracery[key].indexOf(word) > -1 ) {
      if(args.modifiers && obj.value.indexOf('#') >= -1) {
        if((i === 0 && obj.pos !== "\"") ||
          (i >= 1 && arr[i-1].pos === "\"")) {
          //capitalize first letter in a sentence
          obj.value = '#' + key + '.capitalize#';
        } else if (obj.pos.slice(0,3) === "NNP") {
          // capitalize all proper nouns
          obj.value = '#' + key + '.capitalizeAll#';
        }
        if (obj.lemma && obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed') {
          // preserve "-ed" words
          obj.value = '#' + key + '.ed#';
        }
        if (was_a_or_an) {
          // ensure correct "A" or "An" is used
          obj.value = '#' + key + '.a#';
        }
      }
      log(3)("adding %s to %s (%s)", obj.value, key, obj.pos);
    }
    // don't save one-letter non-words
    if (obj.value.length === 1 &&
      (word !== "a" || word !=="o" || word !== "i")) {
      return false;
    }
    if (word === "a" || word === "an") {
      was_a_or_an = true;
      return false;
    } else {
      was_a_or_an = false;
    }
    return obj;
  };

  const parseCorpus = (file) => {
    let corpus = file.toString();
    // tidy newlines
    corpus = corpus.replace(/\r\n/g, '\n');

    var splitting = "";
    switch (args.split || "s") {
    case "l": // line
      corpus = corpus.split(/\n+/);
      splitting = "line";
      break;
    case "p": // paragraph
      corpus = corpus.split(/\n\n+/);
      splitting = "paragraph";
      break;
    default: // sentence
      corpus = util.string.sentences(corpus.replace(/\n+/, ' ').replace(/\s+/, ' '));
      splitting = "sentence";
    }
    log(1)("splitting on %s", splitting);
    // parse sentences, remove one-character sentences
    corpus = corpus.map(parseSentence).filter((s) => s.length > 1);
    tracery['sentences'] = corpus;

    utils.write(args.output, tracery);
    return tracery;
  };

  if (args.input) {
    var file = utils.read(args.input);
    if (file.length) {
      if(type === "module") {
        return parseCorpus(file);
      } else {
        parseCorpus(file);
      }
    } else {
      log(0)(file.error);
    }
  }
};

