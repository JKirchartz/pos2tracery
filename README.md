pos2tracery
===========

pos2tracery is a tool stemming from my
[NaNoGenMo 2017 Artbook Project](http://jkirchartz.com/NaNoGenMo/2017/) it uses
[Dariusk's pos-js](https://github.com/dariusk/pos-js) implementation of fasttag
to create tracery grammars to take sentence forms from a corpus, but replace
the parts of speech within them with other parts of speech from throughout the
corpus.

install:

			npm install -g pos2tracery

usage:

			pos2tracery corpus.txt grammar.json


the output file is optional if you want the grammar to be printed to the screen
