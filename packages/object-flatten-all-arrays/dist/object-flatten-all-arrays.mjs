/**
 * object-flatten-all-arrays
 * Merge and flatten any arrays found in all values within plain objects
 * Version: 5.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-flatten-all-arrays/
 */

import r from"lodash.merge";import t from"lodash.clonedeep";import o from"lodash.isplainobject";const n="5.0.10";function e(n,a){const i={flattenArraysContainingStringsToBeEmpty:!1,...a},s=t(n);let l,y,f;if(Array.isArray(s)){if(i.flattenArraysContainingStringsToBeEmpty&&s.some((r=>"string"==typeof r)))return[];l=null,y={},f=0;for(let t=0,n=s.length;t<n;t++)o(s[t])&&(y=r(y,s[t]),null===l?(l=!0,f=t):(s.splice(t,1),t-=1));null!==l&&(s[f]=t(y))}return o(s)?Object.keys(s).forEach((r=>{(o(s[r])||Array.isArray(s[r]))&&(s[r]=e(s[r],i))})):Array.isArray(s)&&s.forEach(((r,t)=>{(o(s[t])||Array.isArray(s[t]))&&(s[t]=e(s[t],i))})),s}export{e as flattenAllArrays,n as version};
