#!/usr/bin/env node
'use strict';

var pos = require('pos');
var fs = require('fs');


// regex helper to escape strings
RegExp.quote = function(str) {
  return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};


var input = process.argv[2] || null;
var output = process.argv[3] || null;
var corpus = "";
var tracery = { 'sentences' : []};

if (input) {
  var file = fs.readFileSync(input).toString();
} else {
  console.error('please specify an input file');
  process.exit(1);
}
if (file.length) {
  if (file.indexOf(/[!?.]+/) > -1) {
    corpus = file.split(/[!?.]+/);
  } else {
    corpus = file.split(/\n+/);
  }
  for (var i in corpus) {
    if (corpus.hasOwnProperty(i)) {
      tracery.sentences[i] = corpus[i];
      var words = new pos.Lexer().lex(corpus[i]);
      var tagger = new pos.Tagger();
      var taggedWords = tagger.tag(words);
      // replace words in paragraph with tagged words
      for (var j in taggedWords) {
        if (taggedWords.hasOwnProperty(j)) {
          var taggedWord = taggedWords[j];
          var word = taggedWord[0];
          var tag = taggedWord[1];
          if (tag && /\w+/.test(word)) {
            // put tagged words into arrays of what part of speech they're tagged with
            if (! tracery[tag] ) {
              // if the tag doesn't have it's own array - make it
              tracery[tag] = [];
            }
            if (tracery[tag].indexOf(word) === -1 ) {
              // if the word isn't in the tag array, put it there.
              tracery[tag].push(word);
            }
            if (tracery[tag].indexOf(word) > -1 ) {
              // if the word is found in a tag replace every instance in the sentence.
              var rex = new RegExp('\\b(?!#)' + RegExp.quote(word) + '(?!#)\\b', 'g');
              tracery.sentences[i] = tracery.sentences[i].replace(rex, '#' + tag + '#');
            }
          }
        }
      }
    }
  }

  // remove blanks & duplicates
  tracery.sentences = tracery.sentences.filter(function(e, i, self) {
    return e !== "" && i === self.indexOf(e);
  });

  // create an "origin"
  tracery.origin = ['#sentences#'];

  // prettify output
  var grammar = JSON.stringify(tracery).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"');

  if (output) {
    fs.writeFile(output,
      grammar,
      function (err) {
        if (err) {return console.log('everything sucks because: ', err);}
        console.log('wrote grammar to %s', output);
        process.exit(0);
      });
  } else {
    console.log(grammar);
    process.exit(0);
  }
}
