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

exports.module = {

  // regex helper to escape strings
  quote : (str) => (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'),

  // regex helper to correct filenames
  filename : (str) => str.replace(/[^a-z0-9]/gi, ''),

  shuffle : (a) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  },


  read : (str) => {
    if (fs.existsSync(str)) {
      str = fs.readSync(str).toString();
    }
    return str;
  },

  write : (filename, data, cb) => {
    if (!data) {
      this.logger(0)("No output data");
      cb();
      return;
    }
    if (filename) {
      data = JSON.stringify(data, null, 2);
      fs.writeFile(filename,
        data,
        function (err) {
          if (err) {
            this.logger(0)('Error: ', err);
          }
          this.logger(0)('wrote grammar to %s', filename);
          cb();
        });
    } else {
      this.logger(0)(JSON.stringify(data, null, 2));
      cb();
    }
  },

  logger : (verbose) => {
    return (level) => {
      if (level >= verbose) {
        return console.log;
      } else {
        return () => {};
      }
    };
  }
};
