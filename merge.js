#!/usr/bin/env node
'use strict';

const fs = require('fs');

let input_A = process.argv[2] || null;
let input_B = process.argv[3] || null;
let output = process.argv[4] || null;

if (input_A, input_B) {
	let file_A = JSON.parse(fs.readFileSync(input_A).toString());
	let file_B = JSON.parse(fs.readFileSync(input_B).toString());
	let output_json = {};
	for (let A_key in file_A) {
		if (file_B.hasOwnProperty[A_key]) {
			output_json[A_key] = file_A[A_key].concat(file_B[A_key]);
			output_json[A_key] = Array.from(new Set(output_json[A_key]));
		} else {
			output_json[A_key] = file_A[A_key];
		}
	}
	for (let B_key in file_B) {
		if (output_json.hasOwnProperty[B_key]) {
			output_json[B_key] = output_json[B_key].concat(file_B[B_key]);
			output_json[B_key] = Array.from(new Set(output_json[B_key]));
		} else {
			output_json[B_key] = file_B[B_key];
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

