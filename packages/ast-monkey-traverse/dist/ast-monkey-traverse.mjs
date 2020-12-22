/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 1.13.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

import t from"lodash.clone";import e from"lodash.isplainobject";import{parent as o}from"ast-monkey-util";var r="1.13.1";function n(r,n){return function r(n,p,a,i){const l=t(n);let h;const s={depth:-1,path:"",...a};if(s.depth+=1,Array.isArray(l))for(let e=0,n=l.length;n>e&&!i.now;e++){const n=s.path?`${s.path}.${e}`:""+e;void 0!==l[e]?(s.parent=t(l),s.parentType="array",s.parentKey=o(n),h=r(p(l[e],void 0,{...s,path:n},i),p,{...s,path:n},i),Number.isNaN(h)&&l.length>e?(l.splice(e,1),e-=1):l[e]=h):l.splice(e,1)}else if(e(l))for(const e in l){if(i.now&&null!=e)break;const n=s.path?`${s.path}.${e}`:e;0===s.depth&&null!=e&&(s.topmostKey=e),s.parent=t(l),s.parentType="object",s.parentKey=o(n),h=r(p(e,l[e],{...s,path:n},i),p,{...s,path:n},i),Number.isNaN(h)?delete l[e]:l[e]=h}return l}(r,n,{},{now:!1})}export{n as traverse,r as version};
