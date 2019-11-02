/*
 * soundex.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

// const utils = require('./lib/utils');
const fs = require('fs');
const util = require('wink-nlp-utils');
const contractions = require('expand-contractions');

exports.hander = function soundex2tracery(args) {
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
    // tokenize sentence
    let tokenizeSentence = util.tokenize(str);
    logger(3)("tokenized sentence:", tokenizeSentence);
    // munge sentences to create tracery
    tokenizeSentence = tokenizeSentence.map((obj) => {
      let word = obj.value;
      let key = util.soundex([word])[0];
      if ( ! tracery[key] ) {
        tracery[key] = [];
      }
      if ( tracery[key].indexOf(word) === -1) {
        tracery[key].push(word);
      }
      obj.value = percent() ? obj.value : "#" + key + "#";
      return obj;
    });
    return tidySentences(tokenizeSentence);
  };

  const tidySentences = (arr) => {
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
      process.exit(1);
    }
  }
};

exports.command = ['soundex <input> [output] [options]', "p"];
exports.describe = 'convert corpus to tracery with soundex';
exports.builder =  (yargs) => {
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
      "origin": {
        describe: "Include \"origin\" key in tracery file, specify --no-origin to not add this key",
        type: "boolean",
        default: true
      },
    }).coerce(['input', 'output'], require('path').resolve).help('h').alias('h', 'help');
};
