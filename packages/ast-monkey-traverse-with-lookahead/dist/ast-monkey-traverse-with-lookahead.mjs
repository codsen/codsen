/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

import t from"lodash.clonedeep";import n from"lodash.isplainobject";const e="2.0.5";function o(e,o,r=0){function p(t){return"string"==typeof t&&"."===t[0]?t.slice(1):t}const a=[];function i(){const n=a.shift();n[2].next=[];for(let e=0;e<r&&a[e];e++)n[2].next.push(t([a[e][0],a[e][1],a[e][2]]));o(...n)}if(function e(o,r,a,i){if((a={...a}).depth+=1,Array.isArray(o))for(let n=0,h=o.length;n<h&&!i.now;n++){const h=`${a.path}.${n}`;a.parent=t(o),a.parentType="array",r(o[n],void 0,{...a,path:p(h)},i),e(o[n],r,{...a,path:p(h)},i)}else if(n(o))for(const n in o){if(i.now&&null!=n)break;const h=`${a.path}.${n}`;0===a.depth&&null!=n&&(a.topmostKey=n),a.parent=t(o),a.parentType="object",r(n,o[n],{...a,path:p(h)},i),e(o[n],r,{...a,path:p(h)},i)}return o}(e,(function(...t){a.push([...t]),a.length>r&&i()}),{depth:-1,path:""},{now:!1}),a.length)for(let t=0,n=a.length;t<n;t++)i()}export{o as traverse,e as version};
