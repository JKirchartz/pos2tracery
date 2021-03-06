/*
 * tests.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

/* eslint no-undef: 0 */

var p2t = require('../index');
var fs = require('fs');

test('do modules load?', () => {
  expect(p2t).toBeDefined();
  expect(p2t.pos2tracery).toBeDefined();
  expect(typeof p2t.pos2tracery).toBe('function');
  expect(p2t.merge).toBeDefined();
  expect(typeof p2t.merge).toBe('function');
  expect(p2t.del).toBeDefined();
  expect(typeof p2t.del).toBe('function');
  expect(p2t.generate).toBeDefined();
  expect(typeof p2t.generate).toBe('function');
});

test('pos2tracery pos', () => {
  expect(JSON.stringify(p2t.pos2tracery({ input: './test/fixtures/corpus.txt' }), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/corpus.json').toString());

  expect(JSON.stringify(p2t.pos2tracery({ input: './test/fixtures/corpus1.txt'}), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/corpus1.json').toString());

});

test('pos2tracery soundex', () => {
  expect(JSON.stringify(p2t.soundex({ input: './test/fixtures/corpus.txt'}), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/soundex.corpus.json').toString());

  expect(JSON.stringify(p2t.soundex({ input: './test/fixtures/corpus1.txt'}), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/soundex.corpus1.json').toString());
});

test('pos2tracery merge', () => {
  expect(JSON.stringify(p2t.merge({ inputA: './test/fixtures/corpus1.json', inputB: './test/fixtures/corpus2.json'}), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/merged.json').toString());

});

test('pos2tracery delete', () => {
  expect(JSON.stringify(p2t.del({ input: './test/fixtures/merged.json', toss: ['NN', 'VB', 'VBZ'] }), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/deleted.json').toString());

  expect(JSON.stringify(p2t.del({ input: './test/fixtures/merged.json', keep: ['sentences','origin','DT','JJ','NNS','IN','PRP','VBG','TO'] }), null, 2))
    .toBe(fs.readFileSync('./test/fixtures/deleted.json').toString());
});

test('pos2tracery generate', () => {
  expect(p2t.generate({input: './test/fixtures/corpus.json'})).toBeDefined();
});
