/**
 * json-variables
 * Resolves custom-marked, cross-referenced paths in parsed JSON
 * Version: 10.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/json-variables/
 */

import{traverse as t}from"ast-monkey-traverse";import e from"matcher";import r from"object-path";import{arrayiffy as a}from"arrayiffy-if-string";import{strFindHeadsTails as n}from"string-find-heads-tails";import{getByKey as i}from"ast-get-values-by-key";import{Ranges as s}from"ranges-push";import{rApply as o}from"ranges-apply";import{remDup as l}from"string-remove-duplicate-heads-tails";import{matchRightIncl as h,matchLeftIncl as p}from"string-match-left-right";const d="10.0.12",f=Object.prototype.hasOwnProperty,u={heads:"%%_",tails:"_%%",headsNoWrap:"%%-",tailsNoWrap:"-%%",lookForDataContainers:!0,dataContainerIdentifierTails:"_data",wrapHeadsWith:"",wrapTailsWith:"",dontWrapVars:[],preventDoubleWrapping:!0,wrapGlobalFlipSwitch:!0,noSingleMarkers:!1,resolveToBoolIfAnyValuesContainBool:!0,resolveToFalseIfAnyValuesContainBool:!0,throwWhenNonStringInsertedInString:!1,allowUnresolved:!1};function g(t){return"string"==typeof t}function c(t){return"boolean"==typeof t}function W(t){return null===t}function w(t){return t&&"object"==typeof t&&!Array.isArray(t)}function v(t){return null!=t}function y(t){return g(t)?t.trim():t}function b(t){if("string"==typeof t&&t.length>0&&-1!==t.indexOf("."))for(let e=0,r=t.length;e<r;e++)if("."===t[e])return t.slice(e+1);return t}function m(t){if("string"==typeof t&&t.length>0&&-1!==t.indexOf("."))for(let e=t.length;e--;)if("."===t[e])return t.slice(0,e);return t}function A(t){if("string"==typeof t&&t.length>0&&-1!==t.indexOf("."))for(let e=t.length;e--;)if("."===t[e])return t.slice(e+1);return t}function T(t,e){return!("string"!=typeof t||!t.trim())&&!!(t.includes(e.heads)||t.includes(e.tails)||g(e.headsNoWrap)&&e.headsNoWrap.length>0&&t.includes(e.headsNoWrap)||g(e.tailsNoWrap)&&e.tailsNoWrap.length>0&&t.includes(e.tailsNoWrap))}function I(t,r,a=!1,n,i,s){if(r.wrapHeadsWith||(r.wrapHeadsWith=""),r.wrapTailsWith||(r.wrapTailsWith=""),g(t)&&!a&&r.wrapGlobalFlipSwitch&&!r.dontWrapVars.some((t=>e.isMatch(s,t)))&&(!r.preventDoubleWrapping||r.preventDoubleWrapping&&g(t)&&!t.includes(r.wrapHeadsWith)&&!t.includes(r.wrapTailsWith)))return r.wrapHeadsWith+t+r.wrapTailsWith;if(a){if(!g(t))return t;const e=l(t,{heads:r.wrapHeadsWith,tails:r.wrapTailsWith});return g(e)?function(t,e,r){let a,n;return"string"==typeof t&&t.length>0&&h(t,0,e,{trimBeforeMatching:!0,cb:(t,e,r)=>(a=r,!0)})&&p(t,t.length-1,r,{trimBeforeMatching:!0,cb:(t,e,r)=>(n=r+1,!0)})?t.slice(a,n):t}(e,r.wrapHeadsWith,r.wrapTailsWith):e}return t}function _(t,e,a,n){let s;if(-1!==a.indexOf(".")){let i=a,o=!0;if(n.lookForDataContainers&&"string"==typeof n.dataContainerIdentifierTails&&n.dataContainerIdentifierTails.length>0&&!i.endsWith(n.dataContainerIdentifierTails)){const a=r.get(t,i+n.dataContainerIdentifierTails);w(a)&&r.get(a,e)&&(s=r.get(a,e),o=!1)}for(;o&&-1!==i.indexOf(".");){if(i=m(i),A(i)===e)throw new Error(`json-variables/findValues(): [THROW_ID_20] While trying to resolve: "${e}" at path "${a}", we encountered a closed loop. The parent key "${A(i)}" is called the same as the variable "${e}" we're looking for.`);if(n.lookForDataContainers&&"string"==typeof n.dataContainerIdentifierTails&&n.dataContainerIdentifierTails.length>0&&!i.endsWith(n.dataContainerIdentifierTails)){const a=r.get(t,i+n.dataContainerIdentifierTails);w(a)&&r.get(a,e)&&(s=r.get(a,e),o=!1)}if(void 0===s){const a=r.get(t,i);w(a)&&r.get(a,e)&&(s=r.get(a,e),o=!1)}}}if(void 0===s){const a=r.get(t,e);void 0!==a&&(s=a)}if(void 0===s)if(-1===e.indexOf(".")){const r=i(t,e);if(r.length>0)for(let t=0,n=r.length;t<n;t++){if(g(r[t].val)||c(r[t].val)||W(r[t].val)){s=r[t].val;break}if("number"==typeof r[t].val){s=String(r[t].val);break}if(Array.isArray(r[t].val)){s=r[t].val.join("");break}throw new Error(`json-variables/findValues(): [THROW_ID_21] While trying to resolve: "${e}" at path "${a}", we actually found the key named ${e}, but it was not equal to a string but to:\n${JSON.stringify(r[t],null,4)}\nWe can't resolve a string with that! It should be a string.`)}}else{const a=i(t,function(t){if("string"==typeof t&&t.length>0&&-1!==t.indexOf("."))for(let e=0,r=t.length;e<r;e++)if("."===t[e])return t.slice(0,e);return t}(e));if(a.length>0)for(let t=0,n=a.length;t<n;t++){const n=r.get(a[t].val,b(e));n&&g(n)&&(s=n)}}return s}function j(t,e,r,a,i=[]){if(i.includes(r)){let t="";if(i.length>1){const e=" →\n";t=i.reduce(((t,a,n)=>t+(0===n?"":e)+(a===r?"💥 ":"  ")+a)," Here's the path we travelled up until we hit the recursion:\n\n"),t+=`${e}💥 ${r}`}throw new Error(`json-variables/resolveString(): [THROW_ID_19] While trying to resolve: "${e}" at path "${r}", we encountered a closed loop, the key is referencing itself."${t}`)}const l={},h=Array.from(i);h.push(r);const p=new s;function d(n,i,s){for(let o=0,d=n.length;o<d;o++){const d=n[o],u=e.slice(d.headsEndAt,d.tailsStartAt);if(0===u.length)p.push(d.headsStartAt,d.tailsEndAt);else if(f.call(l,u)&&g(l[u]))p.push(d.headsStartAt,d.tailsEndAt,l[u]);else{let n=_(t,u.trim(),r,a);if(void 0===n)if(!0===a.allowUnresolved)n="";else{if("string"!=typeof a.allowUnresolved)throw new Error(`json-variables/processHeadsAndTails(): [THROW_ID_18] We couldn't find the value to resolve the variable ${e.slice(d.headsEndAt,d.tailsStartAt)}. We're at path: "${r}".`);n=a.allowUnresolved}if(!s&&a.throwWhenNonStringInsertedInString&&!g(n))throw new Error(`json-variables/processHeadsAndTails(): [THROW_ID_23] While resolving the variable ${e.slice(d.headsEndAt,d.tailsStartAt)} at path ${r}, it resolved into a non-string value, ${JSON.stringify(n,null,4)}. This is happening because options setting "throwWhenNonStringInsertedInString" is active (set to "true").`);if(c(n)){if(a.resolveToBoolIfAnyValuesContainBool)return p.wipe(),!a.resolveToFalseIfAnyValuesContainBool&&n;n=""}else{if(W(n)&&s)return p.wipe(),n;n=Array.isArray(n)?String(n.join("")):W(n)?"":String(n)}const o=r.includes(".")?`${m(r)}.${u}`:u;if(T(n,a)){const e=I(j(t,n,o,a,h),a,i,0,0,u.trim());g(e)&&p.push(d.headsStartAt,d.tailsEndAt,e)}else{l[u]=n;const t=I(n,a,i,0,0,u.trim());g(t)&&p.push(d.headsStartAt,d.tailsEndAt,t)}}}}let u;try{u=n(e,a.heads,a.tails,{source:"",throwWhenSomethingWrongIsDetected:!1})}catch(t){throw new Error(`json-variables/resolveString(): [THROW_ID_17] While trying to resolve string: "${e}" at path ${r}, something wrong with heads and tails was detected! Here's the internal error message:\n${t}`)}let w=!1;1===u.length&&""===o(e,[[u[0].headsStartAt,u[0].tailsEndAt]]).trim()&&(w=!0);const v=d(u,!1,w);if(c(v))return v;if(W(v))return v;try{u=n(e,a.headsNoWrap,a.tailsNoWrap,{source:"",throwWhenSomethingWrongIsDetected:!1})}catch(t){throw new Error(`json-variables/resolveString(): [THROW_ID_22] While trying to resolve string: "${e}" at path ${r}, something wrong with no-wrap heads and no-wrap tails was detected! Here's the internal error message:\n${t}`)}1===u.length&&""===o(e,[[u[0].headsStartAt,u[0].tailsEndAt]]).trim()&&(w=!0);const y=d(u,!0,w);return c(y)||W(y)?y:p&&p.current()?o(e,p.current()):e}function N(e,r){if(!arguments.length)throw new Error("json-variables/jVar(): [THROW_ID_01] Alas! Inputs are missing!");if(!w(e))throw new TypeError("json-variables/jVar(): [THROW_ID_02] Alas! The input must be a plain object! Currently it's: "+(Array.isArray(e)?"array":typeof e));if(r&&!w(r))throw new TypeError("json-variables/jVar(): [THROW_ID_03] Alas! An Optional Options Object must be a plain object! Currently it's: "+(Array.isArray(r)?"array":typeof r));const n={...u,...r};let i,s,o;if(n.dontWrapVars?Array.isArray(n.dontWrapVars)||(n.dontWrapVars=a(n.dontWrapVars)):n.dontWrapVars=[],n.dontWrapVars.length>0&&!n.dontWrapVars.every(((t,e)=>!!g(t)||(i=t,s=e,!1))))throw new Error(`json-variables/jVar(): [THROW_ID_05] Alas! All variable names set in opts.dontWrapVars should be of a string type. Computer detected a value "${i}" at index ${s}, which is not string but ${Array.isArray(i)?"array":typeof i}!`);if(""===n.heads)throw new Error("json-variables/jVar(): [THROW_ID_06] Alas! opts.heads are empty!");if(""===n.tails)throw new Error("json-variables/jVar(): [THROW_ID_07] Alas! opts.tails are empty!");if(n.lookForDataContainers&&""===n.dataContainerIdentifierTails)throw new Error("json-variables/jVar(): [THROW_ID_08] Alas! opts.dataContainerIdentifierTails is empty!");if(n.heads===n.tails)throw new Error("json-variables/jVar(): [THROW_ID_09] Alas! opts.heads and opts.tails can't be equal!");if(n.heads===n.headsNoWrap)throw new Error("json-variables/jVar(): [THROW_ID_10] Alas! opts.heads and opts.headsNoWrap can't be equal!");if(n.tails===n.tailsNoWrap)throw new Error("json-variables/jVar(): [THROW_ID_11] Alas! opts.tails and opts.tailsNoWrap can't be equal!");if(""===n.headsNoWrap)throw new Error("json-variables/jVar(): [THROW_ID_12] Alas! opts.headsNoWrap is an empty string!");if(""===n.tailsNoWrap)throw new Error("json-variables/jVar(): [THROW_ID_13] Alas! opts.tailsNoWrap is an empty string!");if(n.headsNoWrap===n.tailsNoWrap)throw new Error("json-variables/jVar(): [THROW_ID_14] Alas! opts.headsNoWrap and opts.tailsNoWrap can't be equal!");return t(e,((t,r,a)=>{if(v(r)&&T(t,n))throw new Error(`json-variables/jVar(): [THROW_ID_15] Alas! Object keys can't contain variables!\nPlease check the following key: ${t}`);if(o=void 0!==r?r:t,""===o)return o;if(0!==n.heads.length&&y(o)===y(n.heads)||0!==n.tails.length&&y(o)===y(n.tails)||0!==n.headsNoWrap.length&&y(o)===y(n.headsNoWrap)||0!==n.tailsNoWrap.length&&y(o)===y(n.tailsNoWrap)){if(!n.noSingleMarkers)return o;throw new Error(`json-variables/jVar(): [THROW_ID_16] Alas! While processing the input, we stumbled upon ${y(o)} which is equal to ${y(o)===y(n.heads)?"heads":""}${y(o)===y(n.tails)?"tails":""}${g(n.headsNoWrap)&&y(o)===y(n.headsNoWrap)?"headsNoWrap":""}${g(n.tailsNoWrap)&&y(o)===y(n.tailsNoWrap)?"tailsNoWrap":""}. If you wouldn't have set opts.noSingleMarkers to "true" this error would not happen and computer would have left the current element (${y(o)}) alone`)}return g(o)&&T(o,n)?j(e,o,a.path,n):o}))}export{u as defaults,N as jVar,d as version};
