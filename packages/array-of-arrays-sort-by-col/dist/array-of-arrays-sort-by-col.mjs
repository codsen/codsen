/**
 * array-of-arrays-sort-by-col
 * Sort array of arrays by column, rippling the sorting outwards from that column
 * Version: 2.13.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/array-of-arrays-sort-by-col/
 */

var r="2.13.0";function t(r){return null!=r}function n(r,n=0){if(!Array.isArray(r))throw Error(`array-of-arrays-sort-by-col: [THROW_ID_01]: The first input argument was given not as array but as ${typeof r}, equal to:\n${JSON.stringify(r,null,0)}`);if(isNaN(+n))throw Error(`array-of-arrays-sort-by-col: [THROW_ID_02]: The second input argument, index of the column to sort by (axis), is not integer (incl. zero)! It's currently given as:\n${JSON.stringify(n,null,0)} (type ${typeof n})`);const e=Math.max(...r.map((r=>r.length)));if(!e)return r;if(+n>=e)throw Error(`array-of-arrays-sort-by-col: [THROW_ID_03]: The second input argument, index of the column to sort by (axis), is marking the column which does not exist on any of the input arrays. Axis was given as ${+n} while highest index goes as far as ${e}.`);return Array.from(r).sort(((r,e)=>{if(r[+n]!==e[+n]){if(!t(r[+n])&&t(e[+n])||t(r[+n])&&t(e[+n])&&r[+n]>e[+n])return 1;if(t(r[+n])&&!t(e[+n])||t(r[+n])&&t(e[+n])&&e[+n]>r[+n])return-1}const i=Math.max(r.length,e.length),a=Math.max(+n,i-+n-1);for(let o=1;a>=o;o++){if(+n-o>=0)if(t(r[+n-o])){if(!t(e[+n-o]))return-1;if(e[+n-o]>r[+n-o])return-1;if(r[+n-o]>e[+n-o])return 1}else if(t(e[+n-o]))return 1;if(i>+n+o)if(t(r[+n+o])){if(!t(e[+n+o]))return-1;if(e[+n+o]>r[+n+o])return-1;if(r[+n+o]>e[+n+o])return 1}else if(t(e[+n+o]))return 1}return 0}))}export{n as sortByCol,r as version};
