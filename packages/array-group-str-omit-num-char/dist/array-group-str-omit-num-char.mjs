/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 4.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

import e from"lodash.uniq";import{rApply as c}from"ranges-apply";const t="4.0.9",a={wildcard:"*",dedupePlease:!0};function l(t,l){if(!Array.isArray(t))return t;if(!t.length)return{};const r={...a,...l},i=r.dedupePlease?e(t):Array.from(t),n={};for(let e=0,c=i.length;e<c;e++){const c=i[e].match(/\d+/gm);if(c){const t=i[e].replace(/\d+/gm,r.wildcard);Object.prototype.hasOwnProperty.call(n,t)?(c.forEach(((e,c)=>{n[t].elementsWhichWeCanReplaceWithWildcards[c]&&e!==n[t].elementsWhichWeCanReplaceWithWildcards[c]&&(n[t].elementsWhichWeCanReplaceWithWildcards[c]=!1)})),n[t].count+=1):n[t]={count:1,elementsWhichWeCanReplaceWithWildcards:Array.from(c)}}else n[i[e]]={count:1}}const h={};return Object.keys(n).forEach((e=>{let t=e;if(Array.isArray(n[e].elementsWhichWeCanReplaceWithWildcards)&&n[e].elementsWhichWeCanReplaceWithWildcards.some((e=>!1!==e))){const a=[];let l=0;for(let c=0;c<n[e].elementsWhichWeCanReplaceWithWildcards.length;c++)l=t.indexOf(`${r.wildcard||""}`,l+(r.wildcard||"").length),!1!==n[e].elementsWhichWeCanReplaceWithWildcards[c]&&a.push([l,l+(r.wildcard||"").length,n[e].elementsWhichWeCanReplaceWithWildcards[c]]);t=c(t,a)}h[t]=n[e].count})),h}export{l as groupStr,t as version};
