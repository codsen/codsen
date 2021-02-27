/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 2.0.6
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

import t from"lodash.clonedeep";import n from"lodash.isplainobject";const e="2.0.6";function o(e,o,p=0){function r(t){return"string"==typeof t&&"."===t[0]?t.slice(1):t}const a=[];function h(){const n=a.shift();n[2].next=[];for(let e=0;e<p&&a[e];e++)n[2].next.push(t([a[e][0],a[e][1],a[e][2]]));o(...n)}if(function e(o,p,a,h){if((a={...a}).depth+=1,Array.isArray(o))for(let n=0,i=o.length;n<i&&!h.now;n++){const i=`${a.path}.${n}`;a.parent=t(o),a.parentType="array",p(o[n],void 0,{...a,path:r(i)},h),e(o[n],p,{...a,path:r(i)},h)}else if(n(o))for(const n in o){if(h.now&&null!=n)break;const i=`${a.path}.${n}`;0===a.depth&&null!=n&&(a.topmostKey=n),a.parent=t(o),a.parentType="object",p(n,o[n],{...a,path:r(i)},h),e(o[n],p,{...a,path:r(i)},h)}return o}(e,(function(...t){a.push([...t]),a.length>p&&h()}),{depth:-1,path:""},{now:!1}),a.length)for(let t=0,n=a.length;t<n;t++)h()}export{o as traverse,e as version};
