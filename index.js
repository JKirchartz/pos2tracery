#!/usr/bin/env node
'use strict';

var pos = require('pos');
var fs = require('fs');

var dir = 'manifestos/';
var tracery = { 'sentences' : []};

// regex helper to escape strings
RegExp.quote = function(str) {
	return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};


var input = process.argv[2] || null;
var output = process.argv[3] || null;
var corpus = "";

if (input) {
	var file = fs.readFileSync(input).toString();
} else {
	console.log('please specify an input file');
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
			for (var j in taggedWords) {
				if (taggedWords.hasOwnProperty(j)) {
					var taggedWord = taggedWords[j];
					var word = taggedWord[0];
					var tag = taggedWord[1];
					if (tag && /\w+/.test(word)) {
						if (! tracery[tag] ) {
							tracery[tag] = [];
						}
						if (tracery[tag].indexOf(word) === -1 ) {
							tracery[tag].push(word);
							var rex = new RegExp('(?!#)' + RegExp.quote(word) + '(?!#)');
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
				console.log('wrote grammar to grammar.json');
			});
	} else {
		console.log(grammar);
	}
}
