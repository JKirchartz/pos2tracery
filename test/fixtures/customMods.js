/*
 * customMods.js
 * Copyleft (ↄ) 2020 jkirchartz <me@jkirchartz.com>
 *
 * Distributed under terms of the NPL (Necessary Public License) license.
 */

exports.modules = {
  'test' : function(s) {
    return s.split('').sort().join('');
  }
};
