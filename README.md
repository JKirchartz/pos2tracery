pos2tracery
===========

> pos2tracery is a tool stemming from my
> [NaNoGenMo 2017 Artbook Project](http://jkirchartz.com/NaNoGenMo/2017/) and
> modified with behaviors from the [NaNoGenMo 2018 Wink
> Project](http://jkirchartz.com/NaNoGenMo/2018/) it uses the [Wink POS
> Tagger](https://winkjs.org/wink-pos-tagger/) which uses the transformation
> based learning (TBL) approach to create tracery grammars to take sentence forms
> from a corpus, but replace the parts of speech within them with other parts of
> speech from throughout the corpus. It is aware of contractions and punction;
> and creates tracery's default english modifiers.

## INSTALL

    npm install -g pos2tracery

or

    npm install --save pos2tracery

## SYNOPSIS

> pos2tracery consists of 3 tools, pos2tracery, mergetracery, and tracerygen
> each can be run as a standalone app, or imported into your projects.

## USAGE

Generate tracery grammars with

    pos2tracery pos corpus.txt grammar.json

Merge 2 tracery grammars with

    pos2tracery merge grammar.json grammar2.json combined_output.json

Generate text from a tracery grammar

    pos2tracery gen grammar.json




