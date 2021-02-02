/**
 * array-group-str-omit-num-char
 * Groups array of strings by omitting number characters
 * Version: 4.0.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-group-str-omit-num-char/
 */

import e from"lodash.uniq";import{rApply as a}from"ranges-apply";const c="4.0.2",t={wildcard:"*",dedupePlease:!0};function l(c,l){if(!Array.isArray(c))return c;if(!c.length)return{};const r={...t,...l},i=r.dedupePlease?e(c):Array.from(c),n={};for(let e=0,a=i.length;e<a;e++){const a=i[e].match(/\d+/gm);if(a){const c=i[e].replace(/\d+/gm,r.wildcard);Object.prototype.hasOwnProperty.call(n,c)?(a.forEach(((e,a)=>{n[c].elementsWhichWeCanReplaceWithWildcards[a]&&e!==n[c].elementsWhichWeCanReplaceWithWildcards[a]&&(n[c].elementsWhichWeCanReplaceWithWildcards[a]=!1)})),n[c].count+=1):n[c]={count:1,elementsWhichWeCanReplaceWithWildcards:Array.from(a)}}else n[i[e]]={count:1}}const h={};return Object.keys(n).forEach((e=>{let c=e;if(Array.isArray(n[e].elementsWhichWeCanReplaceWithWildcards)&&n[e].elementsWhichWeCanReplaceWithWildcards.some((e=>!1!==e))){const t=[];let l=0;for(let a=0;a<n[e].elementsWhichWeCanReplaceWithWildcards.length;a++)l=c.indexOf(`${r.wildcard||""}`,l+(r.wildcard||"").length),!1!==n[e].elementsWhichWeCanReplaceWithWildcards[a]&&t.push([l,l+(r.wildcard||"").length,n[e].elementsWhichWeCanReplaceWithWildcards[a]]);c=a(c,t)}h[c]=n[e].count})),h}export{l as groupStr,c as version};
