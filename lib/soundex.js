/*
 * soundex.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const utils = require('./utils');
const util = require('wink-nlp-utils');
const contractions = require('expand-contractions');


exports.command = 'soundex <input> [output]';
exports.alias = 's';
exports.describe = 'convert corpus to tracery with soundex';
exports.builder = (yargs) => {
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
    "origin": {
      describe: "Include \"origin\" key in tracery file, specify --no-origin to not add this key",
      type: "boolean",
      default: true
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
exports.handler = function soundex2tracery(args, type) {
  var tracery = { 'sentences' : []};
  if (args.origin) {
    tracery["origin"] = ["#sentences#"];
  }

  var log = utils.logger(args.verbose);

  // generate tracery from POS
  const parseSentence = (str) => {
    // clean up sentence
    str = str.replace(/[\r\n\s]+/g, ' ');
    str = str.replace(/--/g, '-');
    str = contractions.expand(str);
    // tokenize sentence
    let tokenizeSentence = util.string.tokenize(str, true);
    log(2)("tokenized sentence:", tokenizeSentence);
    // munge sentences to create tracery
    tokenizeSentence = tokenizeSentence.map((obj) => {
      if (obj.tag === "punctuation") {
        return obj;
      }
      let word = obj.value;
      let key = util.tokens.soundex([obj.value])[0];
      log(3)("word: %s - soundex: %s", obj.value, key);
      if ( ! tracery[key] ) {
        tracery[key] = [];
      }
      if ( tracery[key].indexOf(word) === -1) {
        tracery[key].push(word);
      }
      obj.value = utils.chance(args.percent) ? obj.value : '#' + key + '#';
      return obj;
    });
    return tidySentences(tokenizeSentence);
  };

  const tidySentences = (arr) => {
    if (!arr || arr.length == 0) {
      return "";
    }
    // reduce array of objects to one object and return it's value
    return arr.reduce((a, b) => {
      // apply proper spacing, being mindful of punctuation
      if ( b.tag === "punctuation" ) {
        return { value : a.value + "" + b.value };
      } else {
        return { value : a.value + " " + b.value };
      }
    }).value;
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
