/**
 * ast-get-values-by-key
 * Read or edit parsed HTML (or AST in general)
 * Version: 2.8.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-get-values-by-key/
 */

import { traverse } from 'ast-monkey-traverse';
import matcher from 'matcher';
import clone from 'lodash.clonedeep';

var version = "2.8.1";

/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

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
      } else if (replacement.length > 0) {
        return replacement.shift();
      }
    }

    return current;
  });
  return replacement === undefined ? findings : amended;
}

export { getByKey, version };
