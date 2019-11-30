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

  // shuffle an array
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

  "chance" : (pct) => {
    if (pct === 0) {
      return true;
    }
    if(pct === 100) {
      return false;
    }
    return (Math.floor(Math.random() * 101) <= pct);
  },

  // parse a string, or pass-through an object
  "parse": (obj) => {
    if (typeof obj == "string" && obj[0] === "{") {
      return JSON.parse(obj);
    }
    return obj;
  },

  // read a file
  "read" : (str) => {
    if (typeof str == 'object') {
      return str;
    }
    let realpath = fs.realpathSync(str);
    if (fs.existsSync(realpath)) {
      str = fs.readFileSync(realpath).toString();
    }
    return str;
  },

  // write a file
  "write" : (filename, data) => {
    if (!data) {
      utils.logger(0)(0)("No output data");
      return;
    }
    if (typeof data === "object") {
      data = JSON.stringify(data, null, 2);

      // riskier method, with nicer output - this behavior may change at any time due to the nature of util.inspect
      // data = require('util').inspect(data, {
      //   depth: null, // show all items in objects
      //   maxArrayLength: null, // show all items in arrays
      //   breakLength: 100, // 100 chars per line
      // });
    }
    if (filename) {
      fs.writeFile(filename,
        data,
        function (err) {
          if (err) {
            utils.logger(0)(0)('Error: ', err);
          }
          utils.logger(0)(0)('wrote file to %s', filename);
        });
    } else {
      console.log(data);
    }
  },

  // log at a certain level
  // var log = utils.logger(args.verbose); log(0)('always display'); log(3)('only display on -vvv or greater');
  "logger" : function (verbose) {
    return function (level) {
      if (verbose >= level) {
        if (level === 0) {
          return console.log;
        } else {
          return console.error;
        }
      } else {
        return () => {};
      }
    };
  }
};

module.exports = utils;
