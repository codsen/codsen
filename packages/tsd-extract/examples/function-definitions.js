// Extracting function type definitions

import { strict as assert } from "assert";
import { extract } from "../dist/tsd-extract.esm.js";

// Real type definitions from ast-monkey-util:
const source = `
declare function pathNext(str: string): string;
declare function pathPrev(str: string): null | string;
declare function pathUp(str: string): string;
declare function parent(str: string): null | string;
declare const version: string;
export { parent, pathNext, pathPrev, pathUp, version };
`;

// If you try to extract a function,
const { value, content: content1 } = extract(source, "parent");
//                    ^
//                 that's ES6 destructuring assignment + renaming

// The "value" will be the whole statement:
assert.equal(value, "declare function parent(str: string): null | string;");

// But what do we do if we don't want the "declare" part?
// extract "content", then manually prepend:
assert.equal(content1, "(str: string): null | string;");

// Imagine, if this was JSX, you'd create a functional component
// which accepts the "prepend" prop. A primitive substitute example:

function extractWithPrepend(prepend, ...etc) {
  return `${prepend}${extract(...etc).content}`;
}

assert.equal(
  extractWithPrepend(
    "function parent", // prepend this
    // all the same args as before:
    source,
    "parent",
  ),
  "function parent(str: string): null | string;",
);

// On codsen.com, we manually prepend "content" the same way
// because if we used "value", resulting "declare" would confuse people.
