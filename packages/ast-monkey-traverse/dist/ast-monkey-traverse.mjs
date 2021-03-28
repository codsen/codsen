/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 2.0.11
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

import t from"lodash.clonedeep";import e from"lodash.isplainobject";import{parent as o}from"ast-monkey-util";const n="2.0.11";function p(n,p){return function n(p,r,a,i){const l=t(p);let s;const h={depth:-1,path:"",...a};if(h.depth+=1,Array.isArray(l))for(let e=0,p=l.length;e<p&&!i.now;e++){const p=h.path?`${h.path}.${e}`:`${e}`;void 0!==l[e]?(h.parent=t(l),h.parentType="array",h.parentKey=o(p),s=n(r(l[e],void 0,{...h,path:p},i),r,{...h,path:p},i),Number.isNaN(s)&&e<l.length?(l.splice(e,1),e-=1):l[e]=s):l.splice(e,1)}else if(e(l))for(const e in l){if(i.now&&null!=e)break;const p=h.path?`${h.path}.${e}`:e;0===h.depth&&null!=e&&(h.topmostKey=e),h.parent=t(l),h.parentType="object",h.parentKey=o(p),s=n(r(e,l[e],{...h,path:p},i),r,{...h,path:p},i),Number.isNaN(s)?delete l[e]:l[e]=s}return l}(n,p,{},{now:!1})}export{p as traverse,n as version};
