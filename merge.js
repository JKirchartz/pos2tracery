#!/usr/bin/env node
'use strict';

var fs = require('fs');
var merge = require('merge');


var input_A = process.argv[2] || null;
var input_B = process.argv[3] || null;
var output = process.argv[4] || null;

if (input_A, input_B) {
	var file_A = JSON.parse(fs.readFileSync(input_A).toString());
	var file_B = JSON.parse(fs.readFileSync(input_B).toString());
	var output_json = merge(file_A, file_B);
	if (output) {
		if (output_json) {
			output_json = JSON.stringify(output_json).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"');

			fs.writeFile(output,
				output_json,
				function (err) {
					if (err) {return console.log('everything sucks because: ', err);}
					console.log('wrote grammar to %s', output);
					process.exit(0);
				});
		} else {
			console.log("something went wrong merging files");
			process.exit(1);
		}
	} else {
		console.log(output_json);
		process.exit(0);
	}

} else {
	console.error('please specify 2 input files');
	process.exit(1);
}

