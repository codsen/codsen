/**
 * object-delete-key
 * Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-delete-key/
 */

import { find, del, get, drop } from 'ast-monkey';
import { isEmpty } from 'ast-is-empty';
import clone from 'lodash.clonedeep';
import { arrObjOrBoth } from 'util-array-object-or-both';

var version$1 = "2.0.5";

const version = version$1;

function deleteKey(originalInput, originalOpts) {
  function existy(x) {
    return x != null;
  }

  if (!existy(originalInput)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.");
  }

  const defaults = {
    key: null,
    val: undefined,
    cleanup: true,
    only: "any"
  };
  const opts = { ...defaults,
    ...originalOpts
  };
  opts.only = arrObjOrBoth(opts.only, {
    msg: "object-delete-key/deleteKey(): [THROW_ID_03]",
    optsVarName: "opts.only"
  }); // after this, opts.only is equal to either: 1) object, 2) array OR 3) any

  if (!existy(opts.key) && !existy(opts.val)) {
    throw new Error("object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.");
  }

  let input = clone(originalInput);

  if (opts.cleanup) {
    let findings = find(input, {
      key: opts.key,
      val: opts.val,
      only: opts.only
    });
    let currentIndex;
    let nodeToDelete;

    while (Array.isArray(findings) && findings.length) {
      nodeToDelete = findings[0].index;

      for (let i = 1, len = findings[0].path.length; i < len; i++) {
        currentIndex = findings[0].path[len - 1 - i];

        if (isEmpty(del(get(input, {
          index: currentIndex
        }), {
          key: opts.key,
          val: opts.val,
          only: opts.only
        }))) {
          nodeToDelete = currentIndex;
        }
      }

      input = drop(input, {
        index: nodeToDelete
      });
      findings = find(input, {
        key: opts.key,
        val: opts.val,
        only: opts.only
      });
    }
    return input;
  }

  return del(input, {
    key: opts.key,
    val: opts.val,
    only: opts.only
  });
}

export { deleteKey, version };
