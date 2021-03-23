/**
 * array-of-arrays-sort-by-col
 * Sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 3.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-sort-by-col/
 */

!function(r,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((r="undefined"!=typeof globalThis?globalThis:r||self).arrayOfArraysSortByCol={})}(this,(function(r){"use strict";function e(r){return null!=r}r.sortByCol=function(r,t){if(void 0===t&&(t=0),!Array.isArray(r))throw new Error("array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as "+typeof r+", equal to:\n"+JSON.stringify(r,null,0));if(isNaN(+t))throw new Error("array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n"+JSON.stringify(t,null,0)+" (type "+typeof t+")");var n=Math.max.apply(Math,r.map((function(r){return r.length})));if(!n)return r;if(+t>=n)throw new Error("array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as "+ +t+" while highest index goes as far as "+n+".");return Array.from(r).sort((function(r,n){if(r[+t]!==n[+t]){if(!e(r[+t])&&e(n[+t])||e(r[+t])&&e(n[+t])&&r[+t]>n[+t])return 1;if(e(r[+t])&&!e(n[+t])||e(r[+t])&&e(n[+t])&&r[+t]<n[+t])return-1}for(var i=Math.max(r.length,n.length),o=Math.max(+t,i-+t-1),a=1;a<=o;a++){if(+t-a>=0)if(e(r[+t-a])){if(!e(n[+t-a]))return-1;if(r[+t-a]<n[+t-a])return-1;if(r[+t-a]>n[+t-a])return 1}else if(e(n[+t-a]))return 1;if(+t+a<i)if(e(r[+t+a])){if(!e(n[+t+a]))return-1;if(r[+t+a]<n[+t+a])return-1;if(r[+t+a]>n[+t+a])return 1}else if(e(n[+t+a]))return 1}return 0}))},r.version="3.0.9",Object.defineProperty(r,"__esModule",{value:!0})}));
