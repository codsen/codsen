/**
 * @name ast-get-values-by-key
 * @fileoverview Extract values and paths from AST by keys OR set them by keys
 * @version 3.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ast-get-values-by-key/}
 */

import { traverse } from 'ast-monkey-traverse';
import matcher from 'matcher';
import clone from 'lodash.clonedeep';

var version$1 = "3.0.16";

const version = version$1;
function getByKey(originalInput, whatToFind, originalReplacement) {
  let replacement;
  if (originalReplacement !== undefined) {
    replacement = Array.isArray(originalReplacement) ? clone(originalReplacement) : [clone(originalReplacement)];
  }
  const findings = [];
  const amended = traverse(originalInput, (key, val, innerObj) => {
    const current = val !== undefined ? val : key;
    if (val !== undefined && matcher.isMatch(key, whatToFind, {
      caseSensitive: true
    })) {
      if (replacement === undefined) {
        findings.push({
          val,
          path: innerObj.path
        });
      } else if (replacement.length) {
        return replacement.shift();
      }
    }
    return current;
  });
  return replacement === undefined ? findings : amended;
}

export { getByKey, version };
