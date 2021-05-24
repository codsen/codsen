/**
 * @name object-no-new-keys
 * @fileoverview Check, does a plain object (AST/JSON) has any unique keys, not present in a reference object (another AST/JSON)
 * @version 3.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/object-no-new-keys/}
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).objectNoNewKeys={})}(this,(function(e){"use strict";function t(e){return e&&"object"==typeof e&&!Array.isArray(e)}e.noNewKeys=function(e,r,o){if(o&&!t(o))throw new TypeError(`object-no-new-keys/noNewKeys(): [THROW_ID_02] opts should be a plain object. It was given as ${JSON.stringify(o,null,4)} (type ${typeof o})`);const s={mode:2,...o};if("string"==typeof s.mode&&["1","2"].includes(s.mode))s.mode=+s.mode;else if(![1,2].includes(s.mode))throw new TypeError('object-no-new-keys/objectNoNewKeys(): [THROW_ID_01] opts.mode should be "1" or "2" (string or number).');return function e(r,o,s,n){let a;if(t(r))t(o)?Object.keys(r).forEach((p=>{Object.prototype.hasOwnProperty.call(o,p)?(t(r[p])||Array.isArray(r[p]))&&(a={path:n.path.length>0?`${n.path}.${p}`:p,res:n.res},n.res=e(r[p],o[p],s,a).res):(a=n.path.length>0?`${n.path}.${p}`:p,n.res.push(a))})):n.res=n.res.concat(Object.keys(r).map((e=>n.path.length>0?`${n.path}.${e}`:e)));else if(Array.isArray(r))if(Array.isArray(o))for(let t=0,p=r.length;t<p;t++)a={path:`${n.path.length>0?n.path:""}[${t}]`,res:n.res},n.res=2===s.mode?e(r[t],o[0],s,a).res:e(r[t],o[t],s,a).res;else n.res=n.res.concat(r.map(((e,t)=>`${n.path.length>0?n.path:""}[${t}]`)));return n}(e,r,s,{path:"",res:[]}).res},e.version="3.1.0",Object.defineProperty(e,"__esModule",{value:!0})}));
