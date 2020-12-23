/**
 * ast-monkey-traverse-with-lookahead
 * Utility library to traverse AST, reports upcoming values
 * Version: 1.2.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey-traverse-with-lookahead/
 */

import t from"lodash.clonedeep";import n from"lodash.isplainobject";var e="1.2.1";function o(e,o,r=0){function p(t){return"string"==typeof t&&"."===t[0]?t.slice(1):t}const a=[];function h(){const n=a.shift();n[2].next=[];for(let e=0;r>e&&a[e];e++)n[2].next.push(t([a[e][0],a[e][1],a[e][2]]));o(...n)}if(function e(o,r,a,h){if((a={...a}).depth+=1,Array.isArray(o))for(let n=0,i=o.length;i>n&&!h.now;n++){const i=`${a.path}.${n}`;a.parent=t(o),a.parentType="array",r(o[n],void 0,{...a,path:p(i)},h),e(o[n],r,{...a,path:p(i)},h)}else if(n(o))for(const n in o){if(h.now&&null!=n)break;const i=`${a.path}.${n}`;0===a.depth&&null!=n&&(a.topmostKey=n),a.parent=t(o),a.parentType="object",r(n,o[n],{...a,path:p(i)},h),e(o[n],r,{...a,path:p(i)},h)}return o}(e,(function(...t){a.push([...t]),a.length>r&&h()}),{depth:-1,path:""},{now:!1}),a.length)for(let t=0,n=a.length;n>t;t++)h()}export{o as traverse,e as version};
