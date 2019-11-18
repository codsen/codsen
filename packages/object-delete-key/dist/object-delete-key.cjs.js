/**
 * object-delete-key
 * Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.
 * Version: 1.9.7
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/object-delete-key
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var astMonkey = require('ast-monkey');
var isEmpty = _interopDefault(require('ast-is-empty'));
var clone = _interopDefault(require('lodash.clonedeep'));
var validateTheOnly = _interopDefault(require('util-array-object-or-both'));

function deleteKey(originalInput, originalOpts) {
  function existy(x) {
    return x != null;
  }
  if (!existy(originalInput)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.");
  }
  if (arguments.length > 2) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_02] Third argument detected! Computer does not like this...");
  }
  var defaults = {
    key: null,
    val: undefined,
    cleanup: true,
    only: "any"
  };
  var opts = Object.assign({}, defaults, originalOpts);
  opts.only = validateTheOnly(opts.only, {
    msg: "object-delete-key/deleteKey(): [THROW_ID_03]",
    optsVarName: "opts.only"
  });
  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.");
  }
  var input = clone(originalInput);
  if (opts.cleanup) {
    var findings = astMonkey.find(input, {
      key: opts.key,
      val: opts.val,
      only: opts.only
    });
    var currentIndex;
    var nodeToDelete;
    while (findings) {
      nodeToDelete = findings[0].index;
      for (var i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];
        if (isEmpty(astMonkey.del(astMonkey.get(input, {
          index: currentIndex
        }), {
          key: opts.key,
          val: opts.val,
          only: opts.only
        }))) {
          nodeToDelete = currentIndex;
        }
      }
      input = astMonkey.drop(input, {
        index: nodeToDelete
      });
      findings = astMonkey.find(input, {
        key: opts.key,
        val: opts.val,
        only: opts.only
      });
    }
    return input;
  }
  return astMonkey.del(input, {
    key: opts.key,
    val: opts.val,
    only: opts.only
  });
}

module.exports = deleteKey;
