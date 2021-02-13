/**
 * string-unfancy
 * Replace all n/m dashes, curly quotes with their simpler equivalents
 * Version: 4.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-unfancy/
 */

import n from"he";const t="4.0.4";function r(t){const r={"´":"'","ʻ":"'","ʼ":"'","ʽ":"'","ˈ":"'","ʹ":"'","̒":"'","̓":"'","̔":"'","̕":"'","ʺ":'"',"“":'"',"”":'"',"‒":"-","–":"-","—":"-","‘":"'","’":"'","…":"...","−":"-","﹉":"-"," ":" "};if(null==t)throw new Error("string-unfancy/unfancy(): [THROW_ID_01] The input is missing!");if("string"!=typeof t)throw new Error("string-unfancy/unfancy(): [THROW_ID_02] The input is not a string! It's: "+typeof t);let e=t;for(;n.decode(e)!==e;)e=n.decode(e);for(let n=0,t=e.length;n<t;n++)Object.prototype.hasOwnProperty.call(r,e[n])&&(e=e.slice(0,n)+r[e[n]]+e.slice(n+1));return e}export{r as unfancy,t as version};
