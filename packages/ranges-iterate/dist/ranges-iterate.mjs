/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 1.2.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

var r="1.2.2";function t(r,t,e,n=0){if("string"!=typeof r)throw new TypeError(`ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ${typeof r}, equal to: ${JSON.stringify(r,null,0)}`);if(!r.length)throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");if(t&&!Array.isArray(t))throw new TypeError(`ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ${typeof t}, equal to: ${JSON.stringify(t,null,0)}`);if(!e)throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");if("function"!=typeof e)throw new TypeError(`ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ${typeof e}, equal to: ${JSON.stringify(e,null,0)}`);if(null!==t&&t.length){const i=Array.from(t);let a=n,o=n;if(i[0][0]>o)for(;i[0][0]>o&&r[o];o++,a++)e({i:o,val:r[o]});i[0][0]>a||i.forEach(((t,n)=>{if(t[2])for(let r=0,n=t[2].length;n>r;r++)e({i:o,val:t[2][r]}),o+=1;for(;t[1]>a;)a+=1;let l=r.length;for(i[n+1]&&(l=i[n+1][0]);l>a;o++,a++)e({i:o,val:r[a]})}))}else for(let t=0;r.length>t;t++)e({i:t,val:r[t]})}export{t as rIterate,r as version};
