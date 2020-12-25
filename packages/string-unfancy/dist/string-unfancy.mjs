/**
 * string-unfancy
 * Replace all n/m dashes, curly quotes with their simpler equivalents
 * Version: 3.10.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-unfancy/
 */

import t from"he";var n="3.10.1";function r(n){const r={"´":"'","ʻ":"'","ʼ":"'","ʽ":"'","ˈ":"'","ʹ":"'","̒":"'","̓":"'","̔":"'","̕":"'","ʺ":'"',"“":'"',"”":'"',"‒":"-","–":"-","—":"-","‘":"'","’":"'","…":"...","−":"-","﹉":"-"," ":" "};if(null==n)throw Error("string-unfancy/unfancy(): [THROW_ID_01] The input is missing!");if("string"!=typeof n)throw Error("string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It's: "+typeof n);let e=n;for(;t.decode(e)!==e;)e=t.decode(e);for(let t=0,n=e.length;n>t;t++)Object.prototype.hasOwnProperty.call(r,e[t])&&(e=e.slice(0,t)+r[e[t]]+e.slice(t+1));return e}export{r as unfancy,n as version};
