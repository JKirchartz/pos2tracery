#!/usr/bin/env node
'use strict';

const fs = require('fs');

let input_A = process.argv[2] || null;
let input_B = process.argv[3] || null;
let output = process.argv[4] || null;

if (input_A, input_B) {
	let output_json = JSON.parse(fs.readFileSync(input_A).toString());
	let file_B = JSON.parse(fs.readFileSync(input_B).toString());

	for (let key in file_B) {
		console.log('has %s? %s', key, typeof output_json[key] !== 'undefined');
		if (typeof output_json[key] !== 'undefined') {
			console.log('concatenating arrays');
			output_json[key] = output_json[key].concat(file_B[key]);
			output_json[key] = Array.from(new Set(output_json[key]));
		} else {
			console.log('setting solitary array');
			output_json[key] = file_B[key];
		}
	}

	if (output_json) {
		if (output) {
			output_json = JSON.stringify(output_json).replace(new RegExp('","', 'g'), '",\n    "').replace(new RegExp('],"', 'g'),'],\n"');

			fs.writeFile(output,
				output_json,
				function (err) {
					if (err) {return console.log('everything sucks because: ', err);}
					console.log('wrote grammar to %s', output);
					process.exit(0);
				});
		} else {
			console.log(output_json);
			process.exit(0);
		}
	} else {
		console.log("something went wrong merging files");
		process.exit(1);
	}

} else {
	console.error('please specify 2 input files');
	process.exit(1);
}

