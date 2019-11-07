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

const fs = require('fs');
const util = require('wink-nlp-utils');
const pos = require('wink-pos-tagger');
const contractions = require('expand-contractions');
const tagger = pos();


exports.command = 'pos <input> [output]';
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
      "v": {
        alias: "verbose",
        describe: "print details while processing",
        type: "count"
      },
      "p": {
        alias: "percent",
        describe: "limit the percentage of words replaced with their POS tags number between 1 and 100",
        default: 100,
        type: "number",
        nargs: 1,
      },
      "m" : {
        alias: "modifiers",
        describe: "replace english modifiers with their equivalent tracery.modifier function",
        default: false,
        type: "boolean"
      },
      "origin": {
        describe: "Include \"origin\" key in tracery file, specify --no-origin to not add this key",
        type: "boolean",
        default: true
      },
      "ignore" : {
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

exports.handler = function pos2tracery(args) {
  var tracery = { 'sentences' : []};
  if (args.origin) {
    tracery["origin"] = ["#sentences#"];
  }

  const logger = function (level) {
    if (level <= args.verbose) {
      return console.log;
    } else {
      return () => {};
    }
  };

  logger(3)("commandline options:", args);

  const percent = function() {
    if (args.percent === 0) {
      return true;
    }
    if(args.percent === 100) {
      return false;
    }
    return (Math.floor(Math.random() * 101) <= args.percent);
  };

  const outputFile = (output) => {
    if (output && args.output) {
      fs.writeFile(args.output,
        JSON.stringify(output, null, 2),
        function (err) {
          if (err) {return logger(1)('everything sucks because: ', err);}
          logger(1)('wrote grammar to %s', args.output);
          process.exit(0);
        });
    } else {
      logger(0)(output);
      process.exit(0);
    }
  };

  // generate tracery from POS
  const parseSentence = (str) => {
    // clean up sentence
    str = str.replace(/[\r\n\s]+/g, ' ');
    str = str.replace(/--/g, '-');
    str = contractions.expand(str);
    // tag sentence
    let taggedSentence = tagger.tagSentence(str);
    logger(3)("tagged sentence:", taggedSentence);
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
    return tidySentences(taggedSentence);
  };

  const tidySentences = (arr) => {
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
    if (obj.lemma && args.modify) {
      if ((obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed')) {
        word = obj.lemma;
      }
    }
    if ( tracery[key].indexOf(word) === -1  && (word !== "a" || word !=="an")) {
      tracery[key].push(word);
    }
    if (tracery[key].indexOf(word) > -1 ) {
      obj.value = percent() ? obj.value : '#' + key + '#';
      if(args.modify && obj.value.indexOf('#') >= -1) {
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

    switch (args.split) {
    case "line":
      corpus = corpus.split(/\n+/);
      break;
    case "para":
      corpus = corpus.split(/\n\n+/);
      break;
    default:
      corpus = util.string.sentences(corpus);
    }
    // parse sentences, remove one-character sentences
    corpus = corpus.map(parseSentence).filter((s) => s.length > 1);
    tracery['sentences'] = corpus;

    outputFile(tracery);
  };

  if (args.input) {
    var file = fs.readFileSync(args.input).toString();
    if (file.length) {
      parseCorpus(file);
    } else {
      logger(0)(file.error);
      process.exit(1);
    }
  }
};

