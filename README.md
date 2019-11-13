pos2tracery
===========

[![npm version](https://badge.fury.io/js/pos2tracery.svg)](https://badge.fury.io/js/pos2tracery)

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

> pos2tracery currently consists of 3 tools, pos2tracery, merge, and generate
> each can be run as a standalone app, or imported into your projects.

## USAGE

### POS
Generate tracery grammars from POS tags.

    pos2tracery [pos|p] <input> [output] [options]
    example: pos2tracery pos corpus.txt grammar.json

    Positionals:
      input   input/source file  [string] [required]
      output  optional output/destination file, if not set file prints to stdout  [string]

    Options:
      --version        Show version number  [boolean]
      --verbose, -v    print details while processing  [count]
      --percent, -p    limit the percentage of words replaced with their POS tags number between 1 and 100  [number] [default: 100]
      --modifiers, -m  replace english modifiers with their equivalent tracery.modifier function  [boolean] [default: false]
      --origin, -o     Include "origin" key in tracery file, specify --no-origin to not add this key  [boolean] [default: true]
      --ignore, -i     list of parts of speech to not tagify  [array] [default: []]
      --split, -s      determine string splitting strategy: line, paragraph, or sentence  [choices: "l", "p", "s"] [default: "s"]
      -h, --help       Show help  [boolean]

### Soundex
Generate tracery grammars with Soundex.


    pos2tracery soundex <input> [output]
    example: pos2tracery soundex corpus.txt grammar.json

    Positionals:
      input   input/source file  [string] [required]
      output  optional output/destination file, if not set file prints to stdout  [string]

    Options:
      --version      Show version number  [boolean]
      --verbose, -v  print details while processing  [count]
      --percent, -p  limit the percentage of words replaced with their POS tags number between 1 and 100  [number] [default: 100]
      --origin       Include "origin" key in tracery file, specify --no-origin to not add this key  [boolean] [default: true]
      --split, -s    determine string splitting strategy: line, paragraph, or sentence  [choices: "l", "p", "s"] [default: "s"]
      -h, --help     Show help  [boolean]

### Merge
Merge 2 tracery grammars with

    pos2tracery merge <inputA> <inputB> [output]
    example: pos2tracery merge grammar.json grammar2.json combined_output.json

    Positionals:
      inputA  input/source file  [string] [required]
      inputB  input/source file  [string] [required]
      output  optional output/destination file, if not set file prints to stdout  [string]

    Options:
      --version      Show version number  [boolean]
      -v, --verbose  print details while processing  [boolean] [default: false]
      -d, --dupes  [boolean] [default: true]
      -h, --help     Show help  [boolean]

### Generate
Generate text from a tracery grammar


    pos2tracery generate <input>
    pos2tracery generate grammar.json

    Positionals:
      input  input/source grammar file  [string] [required]

    Options:
      --version        Show version number  [boolean]
      -m, --modifiers  use modifiers  [boolean] [default: true]
      -o, --origin     use specified origin to create sentences  [string] [default: "origin"]
      --repeat, -r     define number of sentence to generate  [number] [default: 1]
      --verbose, -v    output information about internal processes  [count]
      --$0, --help     Show help  [boolean]
      -h, --help       Show help  [boolean]



