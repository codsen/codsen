/* eslint @typescript-eslint/explicit-module-boundary-types: 0 */

import { traverse } from "ast-monkey-traverse";
import { deepClone as clone, match } from "codsen-utils";
import { version as v } from "../package.json";

const version: string = v;

export interface Findings {
  val: any;
  path: string;
}

/**
 * Extract values and paths from AST by keys OR set them by keys
 */
function getByKey(
  originalInput: any,
  whatToFind: string | string[],
  originalReplacement?: any,
): any {
  let replacement: any;

  if (originalReplacement !== undefined) {
    replacement = Array.isArray(originalReplacement)
      ? clone(originalReplacement)
      : [clone(originalReplacement)];
  }

  let findings: Findings[] = [];
  let amended = traverse(originalInput, (key, val, innerObj) => {
    let current = val !== undefined ? val : key;
    if (
      val !== undefined &&
      match(key, whatToFind, { caseSensitiveMatch: true })
    ) {
      if (replacement === undefined) {
        findings.push({
          val,
          path: innerObj.path,
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
