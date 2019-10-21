#!/usr/bin/env node
'use strict';

const fs = require('fs');

function procArg(arg) {
  return process.argv.indexOf(arg) > -1 ? process.argv.splice(process.argv.indexOf(arg), 1).join() === arg : false;
};

let verbose = procArg('-v');
let help = procArg('-h') || procArg('--help');
let input_A = process.argv[2] || null;
let input_B = process.argv[3] || null;
let output = process.argv[4] || null;

function log(...args) {
  if (verbose) {
    console.log(...args);
  }
}
function printHelp() {
  console.log("usage:");
  console.log("mergetracery input.json input2.json [output.json]");
  console.log("-h	print this message");
  console.log("-v	print out details of processing");
}

if(help) {
  printHelp();
  process.exit(0);
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
      log(output_json);
      process.exit(0);
    }
  } else {
    console.log("something went wrong merging files");
    process.exit(1);
  }

} else {
  console.error('please specify 2 input files, and an optional output file');
  printHelp();
  process.exit(1);
}

