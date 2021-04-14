/**
 * @name array-of-arrays-sort-by-col
 * @fileoverview Sort array of arrays by column, rippling the sorting outwards from that column
 * @version 3.0.16
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-of-arrays-sort-by-col/}
 */

!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((r="undefined"!=typeof globalThis?globalThis:r||self).arrayOfArraysSortByCol={})}(this,(function(r){"use strict";function e(r){return null!=r}r.sortByCol=function(r,t=0){if(!Array.isArray(r))throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof r}, equal to:\n${JSON.stringify(r,null,0)}`);if(isNaN(+t))throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(t,null,0)} (type ${typeof t})`);const n=Math.max(...r.map((r=>r.length)));if(!n)return r;if(+t>=n)throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${+t} while highest index goes as far as ${n}.`);return Array.from(r).sort(((r,n)=>{if(r[+t]!==n[+t]){if(!e(r[+t])&&e(n[+t])||e(r[+t])&&e(n[+t])&&r[+t]>n[+t])return 1;if(e(r[+t])&&!e(n[+t])||e(r[+t])&&e(n[+t])&&r[+t]<n[+t])return-1}const o=Math.max(r.length,n.length),i=Math.max(+t,o-+t-1);for(let s=1;s<=i;s++){if(+t-s>=0)if(e(r[+t-s])){if(!e(n[+t-s]))return-1;if(r[+t-s]<n[+t-s])return-1;if(r[+t-s]>n[+t-s])return 1}else if(e(n[+t-s]))return 1;if(+t+s<o)if(e(r[+t+s])){if(!e(n[+t+s]))return-1;if(r[+t+s]<n[+t+s])return-1;if(r[+t+s]>n[+t+s])return 1}else if(e(n[+t+s]))return 1}return 0}))},r.version="3.0.16",Object.defineProperty(r,"__esModule",{value:!0})}));
