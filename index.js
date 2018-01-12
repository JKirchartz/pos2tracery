#!/usr/bin/env node
'use strict';

const pos = require('pos');
const cheerio = require('cheerio');
const fs = require('fs');

console.log('Generate Corpus');
var corpus = '';
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

fs.readdir(dir, function (err, files) {
	if ( err ) {
		freakOut(err);
	}
	console.log('read files');
	files.forEach( function (file, index) {
		if (file.indexOf('.jpg') === -1 &&
			file.indexOf('.png') === -1 &&
			file.indexOf('.gif') === -1 &&
			file.indexOf('.swf') === -1 &&
			file.indexOf('.txt') === -1 &&
			file.indexOf('.js') === -1 &&
			file.indexOf('.pdf') === -1 &&
			file.indexOf('.') > -1
		) {
			var data = fs.readFileSync(dir + file);
			if (file.indexOf('.txt') === file.length - 4) {
				corpus += data + '\n\n';
			} else {
				var $ = cheerio.load(data);
				var text = $('p').text().replace(/\s+/g, ' ');
				corpus += String.fixPunct(text) + ' ';
			}
		}
	});
	if (corpus.length) {
		corpus = corpus.split(/[!?.]+/);
		for (var i in corpus) {
			if (corpus.hasOwnProperty(i)) {
				tracery.sentences[i] = corpus[i] + '#randpunct#';
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
		fs.writeFile('corpus.txt', corpus, function (err) {
			if (err) {return console.log('everything sucks because: ', err);}
			console.log('wrote corpus to corpus.txt');
		});
		fs.writeFile('grammar.json',
				JSON.stringify(tracery).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"'),
				function (err) {
					if (err) {return console.log('everything sucks because: ', err);}
					console.log('wrote grammar to grammar.json');
		});
	}
});
