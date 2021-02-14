/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

import t from"lodash.clonedeep";import e from"lodash.isplainobject";import{parent as o}from"ast-monkey-util";const n="2.0.5";function p(n,p){return function n(p,r,a,i){const s=t(p);let l;const h={depth:-1,path:"",...a};if(h.depth+=1,Array.isArray(s))for(let e=0,p=s.length;e<p&&!i.now;e++){const p=h.path?`${h.path}.${e}`:`${e}`;void 0!==s[e]?(h.parent=t(s),h.parentType="array",h.parentKey=o(p),l=n(r(s[e],void 0,{...h,path:p},i),r,{...h,path:p},i),Number.isNaN(l)&&e<s.length?(s.splice(e,1),e-=1):s[e]=l):s.splice(e,1)}else if(e(s))for(const e in s){if(i.now&&null!=e)break;const p=h.path?`${h.path}.${e}`:e;0===h.depth&&null!=e&&(h.topmostKey=e),h.parent=t(s),h.parentType="object",h.parentKey=o(p),l=n(r(e,s[e],{...h,path:p},i),r,{...h,path:p},i),Number.isNaN(l)?delete s[e]:s[e]=l}return s}(n,p,{},{now:!1})}export{p as traverse,n as version};
