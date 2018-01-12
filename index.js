#!/usr/bin/env node
'use strict';

var pos = require('pos');
var fs = require('fs');

var dir = 'manifestos/';
var tracery = { 'sentences' : []};

// get/parse texts

function freakOut (err) {
	console.error('Something went wrong: ', err);
	process.exit(1);
}

RegExp.quote = function(str) {
	return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
};

String.fixPunct = function(str) {
	if (/[.?!]/.test(str.trim().slice(-1)) === false) {
		str += '.';
	}
	return str;
};

var input = process.argv[2] || null; // TODO: get filename from CLI parameter
var output = process.argv[3] || null; // TODO: get filename from CLI parameter
var corpus = "";
var addpunct = false;

if (input) {
	var file = fs.readFileSync(input).toString();
} else {
	console.log('please specify an input file');
}
if (file.length) {
	if (file.indexOf(/[!?.]+/) > -1) {
	  corpus = file.split(/[!?.]+/);
		addpunct = true;
	} else {
		corpus = file.split(/\n+/);
	}
	for (var i in corpus) {
		if (corpus.hasOwnProperty(i)) {
			if ( addpunct ) {
				tracery.sentences[i] = corpus[i] + '#randpunct#';
			} else {
				tracery.sentences[i] = corpus[i];
			}
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
		tracery.origin = ['#sentences#', '#sentences# #origin#', '#sentences# #sentences# #origin#'];
		tracery.randpunct = ['.', '?', '!'];
	}

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
