/*
 * merge.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

const fs = require('fs');

const merge = function(args) {
  let verbose = args.verbose;
  let input_A = args.inputA;
  let input_B = args.inputB;
  let output = args.output;

  function log(...logs) {
    if (verbose) {
      console.log(...logs);
    }
  }

  if (input_A, input_B) {
    let output_json = JSON.parse(fs.readFileSync(input_A).toString());
    let file_B = JSON.parse(fs.readFileSync(input_B).toString());

    for (let key in file_B) {
      if (typeof output_json[key] !== 'undefined') {
        log('concatenating arrays: %s', key);
        output_json[key] = output_json[key].concat(file_B[key]);
        // remove duplicates
        output_json[key] = Array.from(new Set(output_json[key]));
      } else {
        log('adding new array: %s', key);
        output_json[key] = file_B[key];
      }
    }

    if (output_json) {
      if (output) {
        output_json = JSON.stringify(output_json, null, 2);

        fs.writeFile(output,
          output_json,
          function (err) {
            if (err) {return log('everything sucks because: ', err);}
            log('wrote grammar to %s', output);
            process.exit(0);
          });
      } else {
        log(JSON.stringify(output_json, null, 2));
        process.exit(0);
      }
    } else {
      log("something went wrong merging files");
      process.exit(1);
    }
  }
};


exports.command = 'merge <inputA> <inputB> [options]';
exports.describe = 'merge 2 tracery grammars together';
exports.builder =  (yargs) => {
  yargs.command("merge <inputA> <inputB> [output]", "input/output file(s)", (yargs) => {
    yargs.positional("inputA", {
      describe: "input/source file",
      type: "string",
      nargs: 1,
      demand: "input/source file is required"
    }).positional("inputB", {
      describe: "input/source file",
      type: "string",
      nargs: 1,
      demand: "input/source file is required"
    }).positional("output", {
      describe: "optional output/destination file, if not set file prints to stdout",
      type: "string",
      nargs: 1,
    });
  }).options({
    "v": {
      alias: "verbose",
      describe: "print details while processing",
      type: "boolean",
      default: false
    }
  }).help('h').alias('h', 'help');
};
exports.handler = function (argv) {
  merge(argv.slice(1));
};

module.exports = merge;
