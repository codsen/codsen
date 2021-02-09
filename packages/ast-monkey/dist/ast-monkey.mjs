/**
 * ast-monkey
 * Traverse and edit AST
 * Version: 7.13.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ast-monkey/
 */

import{arrObjOrBoth as e}from"util-array-object-or-both";import{checkTypesMini as n}from"check-types-mini";import{compare as r}from"ast-compare";import{traverse as t}from"ast-monkey-traverse";export{traverse}from"ast-monkey-traverse";const o="7.13.3";function i(e){return null!=e}function s(e){return void 0!==e}function a(e,n){return typeof e==typeof n&&!!r(e,n,{matchStrictly:!0,useWildcards:!0})}function d(e){return e&&"object"==typeof e&&!Array.isArray(e)}function l(e,n){if(!i(e))throw new Error("ast-monkey/main.js/monkey(): [THROW_ID_01] Please provide an input");const r={...n},o={count:0,gatherPath:[],finding:null},d=[];let l=!1,m=!1;i(r.key)&&!s(r.val)&&(l=!0),!i(r.key)&&s(r.val)&&(m=!0);let y=e;return"arrayFirstOnly"===r.mode&&Array.isArray(y)&&y.length>0&&(y=[y[0]]),y=t(y,((e,n,t)=>{let y;if(o.count+=1,o.gatherPath.length=t.depth,o.gatherPath.push(o.count),"get"===r.mode)o.count===r.index&&(s(n)?(o.finding={},o.finding[e]=n):o.finding=e);else if("find"===r.mode||"del"===r.mode){if(!("any"===r.only||"array"===r.only&&void 0===n||"object"===r.only&&void 0!==n)||!(l&&a(e,r.key)||m&&a(n,r.val)||!l&&!m&&a(e,r.key)&&a(n,r.val)))return void 0!==n?n:e;if("find"!==r.mode)return NaN;y={index:o.count,key:e,val:n,path:[...o.gatherPath]},d.push(y)}return"set"===r.mode&&o.count===r.index?r.val:"drop"===r.mode&&o.count===r.index?NaN:"arrayFirstOnly"===r.mode?s(n)&&Array.isArray(n)?[n[0]]:i(e)&&Array.isArray(e)?[e[0]]:void 0!==n?n:e:void 0!==n?n:e})),"get"===r.mode?o.finding:"find"===r.mode?d:y}function m(r,t){if(!i(r))throw new Error("ast-monkey/main.js/find(): [THROW_ID_02] Please provide the input");if(!d(t)||void 0===t.key&&void 0===t.val)throw new Error("ast-monkey/main.js/find(): [THROW_ID_03] Please provide opts.key or opts.val");const o={...t};return n(o,null,{schema:{key:["null","string"],val:"any",only:["undefined","null","string"]},msg:"ast-monkey/get(): [THROW_ID_04*]"}),o.only="string"==typeof o.only&&o.only.length>0?e(o.only,{optsVarName:"opts.only",msg:"ast-monkey/find(): [THROW_ID_05*]"}):"any",l(r,{...o,mode:"find"})}function y(e,n){if(!i(e))throw new Error("ast-monkey/main.js/get(): [THROW_ID_06] Please provide the input");if(!d(n))throw new Error("ast-monkey/main.js/get(): [THROW_ID_07] Please provide the opts");if(!i(n.index))throw new Error("ast-monkey/main.js/get(): [THROW_ID_08] Please provide opts.index");const r={...n};if("string"==typeof r.index&&/^\d*$/.test(r.index))r.index=+r.index;else if(!Number.isInteger(r.index))throw new Error(`ast-monkey/main.js/get(): [THROW_ID_11] opts.index must be a natural number. It was given as: ${r.index} (type ${typeof r.index})`);return l(e,{...r,mode:"get"})}function p(e,r){if(!i(e))throw new Error("ast-monkey/main.js/set(): [THROW_ID_12] Please provide the input");if(!d(r))throw new Error("ast-monkey/main.js/set(): [THROW_ID_13] Please provide the input");if(!i(r.key)&&!s(r.val))throw new Error("ast-monkey/main.js/set(): [THROW_ID_14] Please provide opts.val");if(!i(r.index))throw new Error("ast-monkey/main.js/set(): [THROW_ID_15] Please provide opts.index");const t={...r};if("string"==typeof t.index&&/^\d*$/.test(t.index))t.index=+t.index;else if(!Number.isInteger(t.index))throw new Error(`ast-monkey/main.js/set(): [THROW_ID_17] opts.index must be a natural number. It was given as: ${t.index}`);return i(t.key)&&!s(t.val)&&(t.val=t.key),n(t,null,{schema:{key:[null,"string"],val:"any",index:"number"},msg:"ast-monkey/set(): [THROW_ID_18*]"}),l(e,{...t,mode:"set"})}function u(e,n){if(!i(e))throw new Error("ast-monkey/main.js/drop(): [THROW_ID_19] Please provide the input");if(!d(n))throw new Error("ast-monkey/main.js/drop(): [THROW_ID_20] Please provide the input");if(!i(n.index))throw new Error("ast-monkey/main.js/drop(): [THROW_ID_21] Please provide opts.index");const r={...n};if("string"==typeof r.index&&/^\d*$/.test(r.index))r.index=+r.index;else if(!Number.isInteger(r.index))throw new Error(`ast-monkey/main.js/drop(): [THROW_ID_23] opts.index must be a natural number. It was given as: ${r.index}`);return l(e,{...r,mode:"drop"})}function f(r,t){if(!i(r))throw new Error("ast-monkey/main.js/del(): [THROW_ID_26] Please provide the input");if(!d(t))throw new Error("ast-monkey/main.js/del(): [THROW_ID_27] Please provide the opts object");if(!i(t.key)&&!s(t.val))throw new Error("ast-monkey/main.js/del(): [THROW_ID_28] Please provide opts.key or opts.val");const o={...t};return n(o,null,{schema:{key:[null,"string"],val:"any",only:["undefined","null","string"]},msg:"ast-monkey/drop(): [THROW_ID_29*]"}),o.only="string"==typeof o.only&&o.only.length>0?e(o.only,{msg:"ast-monkey/del(): [THROW_ID_30*]",optsVarName:"opts.only"}):"any",l(r,{...o,mode:"del"})}function h(e){if(!i(e))throw new Error("ast-monkey/main.js/arrayFirstOnly(): [THROW_ID_31] Please provide the input");return l(e,{mode:"arrayFirstOnly"})}export{h as arrayFirstOnly,f as del,u as drop,m as find,y as get,p as set,o as version};
