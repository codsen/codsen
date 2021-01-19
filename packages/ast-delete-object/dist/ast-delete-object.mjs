/**
 * ast-delete-object
 * Delete all plain objects in AST if they contain a certain key/value pair
 * Version: 1.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-delete-object/
 */

import e from"lodash.clonedeep";import{compare as t}from"ast-compare";import{traverse as r}from"ast-monkey-traverse";import o from"lodash.isplainobject";const i="1.10.1",c={matchKeysStrictly:!1,hungryForWhitespace:!1};function n(i,n,s){if(!i)throw new Error("ast-delete-object/deleteObj(): [THROW_ID_01] Missing input!");if(!n)throw new Error("ast-delete-object/deleteObj(): [THROW_ID_02] Missing second argument, object to search for and delete!");if(s&&!o(s))throw new Error("ast-delete-object/deleteObj(): [THROW_ID_03] Third argument, options object, must be an object!");const a={...c,...s};let h,l=e(i);return t(l,n,{hungryForWhitespace:a.hungryForWhitespace,matchStrictly:a.matchKeysStrictly})?{}:(l=r(l,((e,r)=>{if(h=void 0!==r?r:e,o(h)){if(o(n)&&o(h)&&!Object.keys(n).length&&!Object.keys(h).length)return NaN;if(t(h,n,{hungryForWhitespace:a.hungryForWhitespace,matchStrictly:a.matchKeysStrictly}))return NaN}return h})),l)}export{c as defaults,n as deleteObj,i as version};
