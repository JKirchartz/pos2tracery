/*
 * utils.js
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

let fs = require('fs');

let utils = {

  // regex helper to escape strings
  "quote" : (str) => (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'),

  // regex helper to correct filenames
  "filename" : (str) => str.replace(/[^a-z0-9]/gi, ''),

  "shuffle" : (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  },

  "parse": (obj) => {
    if (typeof obj == "string") {
      return (JSON.parse(obj));
    }
    return obj;
  },

  "read" : (str) => {
    let realpath = fs.realpathSync(str);
    if (fs.existsSync(realpath)) {
      str = fs.readFileSync(realpath).toString();
    }
    return str;
  },

  "write" : (filename, data) => {
    if (!data) {
      utils.logger(0)("No output data");
      return;
    }
    if (filename) {
      fs.writeFile(filename,
        data,
        function (err) {
          if (err) {
            utils.logger(0)('Error: ', err);
          }
          utils.logger(0)('wrote file to %s', filename);
        });
    } else {
      utils.logger(0)(JSON.stringify(data, null, 2));
    }
  },

  "logger" : (verbose) => {
    return function (level) {
      if (level >= verbose) {
        return console.log;
      } else {
        return () => {};
      }
    };
  }
};

module.exports = utils;
