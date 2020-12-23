/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 1.2.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

import clone from 'lodash.clonedeep';
import isObj from 'lodash.isplainobject';

var version = "1.2.1";

function traverse(tree1, cb1, lookahead = 0) {
  function trimFirstDot(str) {
    if (typeof str === "string" && str[0] === ".") {
      return str.slice(1);
    }

    return str;
  }
  const stop1 = {
    now: false
  }; // that's where we stash the arguments that the callback function tries
  // to ping; we keep them until enough of them is gathered to set them as
  // "future" values:

  const stash = []; // ^ LIFO STACK
  //
  // traverseInner() needs a wrapper to shield the internal arguments and simplify external API.
  //

  function traverseInner(tree, callback, innerObj, stop) {
    innerObj = { ...innerObj
    };
    innerObj.depth += 1;

    if (Array.isArray(tree)) {

      for (let i = 0, len = tree.length; i < len; i++) {

        if (stop.now) {
          break;
        }

        const path = `${innerObj.path}.${i}`;
        innerObj.parent = clone(tree);
        innerObj.parentType = "array"; // innerObj.path = `${innerObj.path}[${i}]`

        callback(tree[i], undefined, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
        traverseInner(tree[i], callback, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
      }
    } else if (isObj(tree)) { // eslint-disable-next-line

      for (const key in tree) {

        if (stop.now && key != null) {
          break;
        }

        const path = `${innerObj.path}.${key}`;

        if (innerObj.depth === 0 && key != null) {
          innerObj.topmostKey = key;
        }

        innerObj.parent = clone(tree);
        innerObj.parentType = "object";
        callback(key, tree[key], { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
        traverseInner(tree[key], callback, { ...innerObj,
          path: trimFirstDot(path)
        }, stop);
      }
    }
    return tree;
  } // for DRY purposes, we extract the function which reports the first element
  // from the stash and removes that element.


  function reportFirstFromStash() { // start to assemble node we're report to the callback cb1()

    const currentElem = stash.shift(); // ^ shift removes it from stash
    // now we need the "future" nodes, as many as "lookahead" of them
    // that's the container where they'll sit:

    currentElem[2].next = [];

    for (let i = 0; i < lookahead; i++) { // we want as many as "lookahead" from stash but there might be not enough

      if (stash[i]) {
        currentElem[2].next.push(clone([stash[i][0], stash[i][1], stash[i][2]]));
      } else {
        break;
      }
    } // finally, ping the callback with assembled element:
    cb1(...currentElem);
  } // used to buffer "lookahead"-amount of results and report them as "future"
  // nodes


  function intermediary(...incoming) { // 1. put the incoming things into stash.
    // We need to delete the "now" element, the last-one in here,
    // because it's for internal use

    stash.push([...incoming]); // 2. if there are enough things gathered in stash, report the first one
    // from the stash:

    if (stash.length > lookahead) { // the following function has "stash" in its scope and it will mutate
      // the stash:

      reportFirstFromStash();
    }
  }

  traverseInner(tree1, intermediary, {
    depth: -1,
    path: ""
  }, stop1); // once the end is reached, clean up the stash - that's the remaining elements
  // that will have less "future" reported in them, compared to what was
  // requested by "lookahead"

  if (stash.length) {

    for (let i = 0, len = stash.length; i < len; i++) {
      reportFirstFromStash();
    }
  }
} // -----------------------------------------------------------------------------

export { traverse, version };
