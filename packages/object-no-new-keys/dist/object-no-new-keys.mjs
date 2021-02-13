/**
 * object-no-new-keys
 * Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)
 * Version: 3.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-no-new-keys/
 */

const e="3.0.4";function r(e){return e&&"object"==typeof e&&!Array.isArray(e)}function t(e,t,s){if(s&&!r(s))throw new TypeError(`object-no-new-keys/noNewKeys(): [THROW_ID_02] opts should be a plain object. It was given as ${JSON.stringify(s,null,4)} (type ${typeof s})`);const o={mode:2,...s};if("string"==typeof o.mode&&["1","2"].includes(o.mode))o.mode=+o.mode;else if(![1,2].includes(o.mode))throw new TypeError('object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode should be "1" or "2" (string or number).');return function e(t,s,o,n){let a;if(r(t))r(s)?Object.keys(t).forEach((p=>{Object.prototype.hasOwnProperty.call(s,p)?(r(t[p])||Array.isArray(t[p]))&&(a={path:n.path.length>0?`${n.path}.${p}`:p,res:n.res},n.res=e(t[p],s[p],o,a).res):(a=n.path.length>0?`${n.path}.${p}`:p,n.res.push(a))})):n.res=n.res.concat(Object.keys(t).map((e=>n.path.length>0?`${n.path}.${e}`:e)));else if(Array.isArray(t))if(Array.isArray(s))for(let r=0,p=t.length;r<p;r++)a={path:`${n.path.length>0?n.path:""}[${r}]`,res:n.res},n.res=2===o.mode?e(t[r],s[0],o,a).res:e(t[r],s[r],o,a).res;else n.res=n.res.concat(t.map(((e,r)=>`${n.path.length>0?n.path:""}[${r}]`)));return n}(e,t,o,{path:"",res:[]}).res}export{t as noNewKeys,e as version};
