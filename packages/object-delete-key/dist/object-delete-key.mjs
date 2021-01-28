/**
 * object-delete-key
 * Delete keys from all arrays or plain objects, nested within anything, by key or by value or by both, and clean up afterwards. Accepts wildcards.
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-delete-key/
 */

import{find as e,del as o,get as l,drop as t}from"ast-monkey";import{isEmpty as r}from"ast-is-empty";import n from"lodash.clonedeep";import{arrObjOrBoth as y}from"util-array-object-or-both";const a="2.0.1";function i(a,i){function s(e){return null!=e}if(!s(a))throw new Error("object-delete-key/deleteKey(): [THROW_ID_01] Please provide the first argument, something to work upon.");const k={...{key:null,val:void 0,cleanup:!0,only:"any"},...i};if(k.only=y(k.only,{msg:"object-delete-key/deleteKey(): [THROW_ID_03]",optsVarName:"opts.only"}),!s(k.key)&&!s(k.val))throw new Error("object-delete-key/deleteKey(): [THROW_ID_04] Please provide at least a key or a value.");let p=n(a);if(k.cleanup){let n,y,a=e(p,{key:k.key,val:k.val,only:k.only});for(;Array.isArray(a)&&a.length;){y=a[0].index;for(let e=1,t=a[0].path.length;e<t;e++)n=a[0].path[t-1-e],r(o(l(p,{index:n}),{key:k.key,val:k.val,only:k.only}))&&(y=n);p=t(p,{index:y}),a=e(p,{key:k.key,val:k.val,only:k.only})}return p}return o(p,{key:k.key,val:k.val,only:k.only})}export{i as deleteKey,a as version};
