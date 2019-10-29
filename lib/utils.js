/*
 * utils.js
 * Copyleft (ↄ) 2019 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

exports.module = {

  // regex helper to escape strings
  quote : (str) => (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'),

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

  filename : (str) => {
    return str.replace(/[^a-z0-9]/gi, '');
  }

};
