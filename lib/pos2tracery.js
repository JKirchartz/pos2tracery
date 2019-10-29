/*
 * pos2tracery.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

// const utils = require('./lib/utils');
const fs = require('fs');
const util = require('wink-nlp-utils');
const pos = require('wink-pos-tagger');
const contractions = require('expand-contractions');
const tagger = pos();

const pos2tracery = function (args) {
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
    if (obj.tag === "punctuation" || obj.pos === "POS") {
      obj.value = "\\" + obj.value; // escape value, just in case
      return obj;
    }
    if ( ! tracery[key] ) {
      tracery[key] = [];
    }
    if (obj.lemma && args.modify) {
      if ((obj.normal.slice(-2) === 'ed' && obj.lemma.slice(-2) !== 'ed') ||
        (obj.normal.slice(-3) === 'ing' && obj.lemma.slice(-3) !== 'ing')) {
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

    // try to fix quotes missing the endquote
    corpus = corpus.split(/\n\n+/);
    corpus.forEach((para) => {
      let match = para.match(/"/g);
      if(match && match.length % 2 == 1 && (para.slice(1) === "\"" && para.slice(-1) !== "\"")){
        para = para + "\"";
      }
    });

    // get sentences
    let sentences = util.string.sentences(corpus.join("\n\n"));
    sentences = sentences.map(parseSentence);
    tracery['sentences'] = sentences;

    outputFile(tracery);
  };

  if (args.input) {
    var file = fs.readFileSync(args.input).toString();
    if (file.length) {
      parseCorpus(file);
    } else {
      logger(0)(file.error);
      process.exit(2);
    }

  } else {
    logger(0)('please specify an input file');
    process.exit(1);
  }
};

exports.command = 'pos <input> [output] [options]';
exports.describe = 'convert corpus to tracery with POS tags';
exports.builder =  (yargs) => {
  yargs.positional("input", {
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
      type: "boolean"
    },
    "origin": {
      describe: "Include \"origin\" key in tracery file, specify --no-origin to not add this key",
      type: "boolean",
      default: true
    },
    "ignore" : {
      describe: "TODO: list of parts of speech to not tagify",
      type: "array"
    }
  }).coerce(['input', 'output'], require('path').resolve).help('h').alias('h', 'help');
};
exports.handler = function (argv) {
  pos2tracery(argv.slice(1));
};

module.exports = pos2tracery;
