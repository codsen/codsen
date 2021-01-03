/**
 * object-flatten-all-arrays
 * Merge and flatten any arrays found in all values within plain objects
 * Version: 4.9.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/object-flatten-all-arrays/
 */

import r from"lodash.merge";import t from"lodash.clonedeep";import o from"lodash.isplainobject";var n="4.9.1";function a(n,e){const i={flattenArraysContainingStringsToBeEmpty:!1,...e},l=t(n);let s,y,f;if(Array.isArray(l)){if(i.flattenArraysContainingStringsToBeEmpty&&l.some((r=>"string"==typeof r)))return[];s=null,y={},f=0;for(let t=0,n=l.length;t<n;t++)o(l[t])&&(y=r(y,l[t]),null===s?(s=!0,f=t):(l.splice(t,1),t-=1));null!==s&&(l[f]=t(y))}return o(l)?Object.keys(l).forEach((r=>{(o(l[r])||Array.isArray(l[r]))&&(l[r]=a(l[r],i))})):Array.isArray(l)&&l.forEach(((r,t)=>{(o(l[t])||Array.isArray(l[t]))&&(l[t]=a(l[t],i))})),l}export{a as flattenAllArrays,n as version};
