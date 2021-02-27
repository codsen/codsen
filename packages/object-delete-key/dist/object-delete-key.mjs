/**
 * object-delete-key
 * Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-delete-key/
 */

import{find as e,del as o,get as l,drop as t}from"ast-monkey";import{isEmpty as r}from"ast-is-empty";import n from"lodash.clonedeep";import{arrObjOrBoth as y}from"util-array-object-or-both";const a="2.0.5";function i(a,i){function k(e){return null!=e}if(!k(a))throw new Error("object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.");const p={...{key:null,val:void 0,cleanup:!0,only:"any"},...i};if(p.only=y(p.only,{msg:"object-delete-key/deleteKey(): [THROW_ID_03]",optsVarName:"opts.only"}),!k(p.key)&&!k(p.val))throw new Error("object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.");let s=n(a);if(p.cleanup){let n,y,a=e(s,{key:p.key,val:p.val,only:p.only});for(;Array.isArray(a)&&a.length;){y=a[0].index;for(let e=1,t=a[0].path.length;e<t;e++)n=a[0].path[t-1-e],r(o(l(s,{index:n}),{key:p.key,val:p.val,only:p.only}))&&(y=n);s=t(s,{index:y}),a=e(s,{key:p.key,val:p.val,only:p.only})}return s}return o(s,{key:p.key,val:p.val,only:p.only})}export{i as deleteKey,a as version};
