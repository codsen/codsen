// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

import { version as v } from "../package.json";

const version: string = v;

function isAttrNameChar(char: any | string): boolean {
  if (typeof char !== "string" || !char.length) {
    return false;
  }
  const first = char.charCodeAt(0);
  // Keep the common ASCII name path independent of Unicode exclusions.
  if (
    (first >= 97 && first <= 122) ||
    (first >= 65 && first <= 90) ||
    (first >= 48 && first <= 57)
  ) {
    return true;
  }
  const code = char.codePointAt(0) as number;
  return (
    code > 32 &&
    code !== 34 &&
    code !== 39 &&
    code !== 47 &&
    // Reject the tag-opening delimiter as well as the authoring exclusions.
    code !== 60 &&
    code !== 61 &&
    code !== 62 &&
    !(code >= 127 && code <= 159) &&
    !(code >= 0xd800 && code <= 0xdfff) &&
    !(code >= 0xfdd0 && code <= 0xfdef) &&
    (code & 0xffff) < 0xfffe
  );
}

export { isAttrNameChar, version };
