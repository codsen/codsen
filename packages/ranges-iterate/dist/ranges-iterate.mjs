/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

const r="2.0.1";function t(r,t,e,n=0){if("string"!=typeof r)throw new TypeError(`ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof r}, equal to: ${JSON.stringify(r,null,0)}`);if(!r.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(t&&!Array.isArray(t))throw new TypeError(`ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof t}, equal to: ${JSON.stringify(t,null,0)}`);if(!e)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof e)throw new TypeError(`ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof e}, equal to: ${JSON.stringify(e,null,0)}`);if(null!==t&&t.length){const i=Array.from(t);let o=n,a=n;if(a<i[0][0])for(;a<i[0][0]&&r[a];a++,o++)e({i:a,val:r[a]});i[0][0]<=o&&i.forEach(((t,n)=>{if(t[2])for(let r=0,n=t[2].length;r<n;r++)e({i:a,val:t[2][r]}),a+=1;for(;o<t[1];)o+=1;let s=r.length;for(i[n+1]&&(s=i[n+1][0]);o<s;a++,o++)e({i:a,val:r[o]})}))}else for(let t=0;t<r.length;t++)e({i:t,val:r[t]})}export{t as rIterate,r as version};
