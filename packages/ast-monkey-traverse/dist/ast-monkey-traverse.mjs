/**
 * ast-monkey-traverse
 * Utility library to traverse AST
 * Version: 1.13.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse/
 */

import t from"lodash.clonedeep";import e from"lodash.isplainobject";import{parent as o}from"ast-monkey-util";var p="1.13.1";function r(p,r){return function p(r,n,a,i){const l=t(r);let h;const s={depth:-1,path:"",...a};if(s.depth+=1,Array.isArray(l))for(let e=0,r=l.length;r>e&&!i.now;e++){const r=s.path?`${s.path}.${e}`:""+e;void 0!==l[e]?(s.parent=t(l),s.parentType="array",s.parentKey=o(r),h=p(n(l[e],void 0,{...s,path:r},i),n,{...s,path:r},i),Number.isNaN(h)&&l.length>e?(l.splice(e,1),e-=1):l[e]=h):l.splice(e,1)}else if(e(l))for(const e in l){if(i.now&&null!=e)break;const r=s.path?`${s.path}.${e}`:e;0===s.depth&&null!=e&&(s.topmostKey=e),s.parent=t(l),s.parentType="object",s.parentKey=o(r),h=p(n(e,l[e],{...s,path:r},i),n,{...s,path:r},i),Number.isNaN(h)?delete l[e]:l[e]=h}return l}(p,r,{},{now:!1})}export{r as traverse,p as version};
