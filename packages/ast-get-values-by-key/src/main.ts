/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { traverse } from "ast-monkey-traverse";
import matcher from "matcher";
import clone from "lodash.clonedeep";
import { version } from "../package.json";

function getByKey(
  originalInput: any,
  whatToFind: string | string[],
  originalReplacement?: any
): any {
  let replacement: any;

  if (originalReplacement !== undefined) {
    replacement = Array.isArray(originalReplacement)
      ? clone(originalReplacement)
      : [clone(originalReplacement)];
  }

  const findings: any[] = [];
  const amended = traverse(originalInput, (key, val, innerObj) => {
    const current = val !== undefined ? val : key;
    if (
      val !== undefined &&
      matcher.isMatch(key, whatToFind, { caseSensitive: true })
    ) {
      if (replacement === undefined) {
        findings.push({
          val,
          path: innerObj.path,
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
