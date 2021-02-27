/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

const t="2.0.5";function r(t,r,e,n=0){if("string"!=typeof t)throw new TypeError(`ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof t}, equal to: ${JSON.stringify(t,null,0)}`);if(!t.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(r&&!Array.isArray(r))throw new TypeError(`ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof r}, equal to: ${JSON.stringify(r,null,0)}`);if(!e)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof e)throw new TypeError(`ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof e}, equal to: ${JSON.stringify(e,null,0)}`);if(null!==r&&r.length){const i=Array.from(r);let o=n,a=n;if(a<i[0][0])for(;a<i[0][0]&&t[a];a++,o++)e({i:a,val:t[a]});i[0][0]<=o&&i.forEach(((r,n)=>{if(r[2])for(let t=0,n=r[2].length;t<n;t++)e({i:a,val:r[2][t]}),a+=1;for(;o<r[1];)o+=1;let l=t.length;for(i[n+1]&&(l=i[n+1][0]);o<l;a++,o++)e({i:a,val:t[o]})}))}else for(let r=0;r<t.length;r++)e({i:r,val:t[r]})}export{r as rIterate,t as version};
