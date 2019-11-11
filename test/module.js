/*
 * module.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

var p2t = require('../index');
var gen = p2t.generate('../test/fixtures/corpus.json', null, null, null, 3);
console.log(gen);
