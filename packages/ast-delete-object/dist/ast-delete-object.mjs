/**
 * ast-delete-object
 * Delete all plain objects in AST if they contain a certain key/value pair
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-delete-object/
 */

import t from"lodash.clonedeep";import{compare as e}from"ast-compare";import{traverse as r}from"ast-monkey-traverse";import o from"lodash.isplainobject";var c="1.10.1";const i={matchKeysStrictly:!1,hungryForWhitespace:!1};function s(c,s,a){if(!c)throw Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");if(!s)throw Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");if(a&&!o(a))throw Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");const n={...i,...a};let h,l=t(c);return e(l,s,{hungryForWhitespace:n.hungryForWhitespace,matchStrictly:n.matchKeysStrictly})?{}:(l=r(l,((t,r)=>{if(h=void 0!==r?r:t,o(h)){if(o(s)&&o(h)&&!Object.keys(s).length&&!Object.keys(h).length)return NaN;if(e(h,s,{hungryForWhitespace:n.hungryForWhitespace,matchStrictly:n.matchKeysStrictly}))return NaN}return h})),l)}export{i as defaults,s as deleteObj,c as version};
