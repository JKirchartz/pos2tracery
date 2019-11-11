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

test('module', () => {
  expect(p2t).toBeDefined();

  expect(p2t.pos2tracery).toBeDefined();
  expect(typeof p2t.pos2tracery).toBe('function');
  expect(p2t.merge).toBeDefined();
  expect(typeof p2t.merge).toBe('function');
  expect(p2t.generate).toBeDefined();
  expect(typeof p2t.generate).toBe('function');

  expect(p2t.generate('./test/fixtures/corpus.json')).toBeDefined();


});
