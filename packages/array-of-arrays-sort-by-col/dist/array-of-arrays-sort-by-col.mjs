/**
 * array-of-arrays-sort-by-col
 * Sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 3.0.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-sort-by-col/
 */

const r="3.0.3";function t(r){return null!=r}function n(r,n=0){if(!Array.isArray(r))throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof r}, equal to:\n${JSON.stringify(r,null,0)}`);if(isNaN(+n))throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(n,null,0)} (type ${typeof n})`);const e=Math.max(...r.map((r=>r.length)));if(!e)return r;if(+n>=e)throw new Error(`array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${+n} while highest index goes as far as ${e}.`);return Array.from(r).sort(((r,e)=>{if(r[+n]!==e[+n]){if(!t(r[+n])&&t(e[+n])||t(r[+n])&&t(e[+n])&&r[+n]>e[+n])return 1;if(t(r[+n])&&!t(e[+n])||t(r[+n])&&t(e[+n])&&r[+n]<e[+n])return-1}const i=Math.max(r.length,e.length),o=Math.max(+n,i-+n-1);for(let a=1;a<=o;a++){if(+n-a>=0)if(t(r[+n-a])){if(!t(e[+n-a]))return-1;if(r[+n-a]<e[+n-a])return-1;if(r[+n-a]>e[+n-a])return 1}else if(t(e[+n-a]))return 1;if(+n+a<i)if(t(r[+n+a])){if(!t(e[+n+a]))return-1;if(r[+n+a]<e[+n+a])return-1;if(r[+n+a]>e[+n+a])return 1}else if(t(e[+n+a]))return 1}return 0}))}export{n as sortByCol,r as version};
