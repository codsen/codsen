/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.2.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

var t="1.2.1";const e={targetJSON:!1},n={b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v","'":"'",'"':'"',"\\":"\\",0:"\0"};function r(t){return t.replace(/\\([bfnrtv'"\\0])/g,(t=>n[t]||t&&(t.startsWith("\\")?n[t.slice(1)]:"")))}function i(t,n){const i={...e,...n},c=r(t);let f=r(t);return i.targetJSON&&(f=JSON.stringify(f.replace(/\t/g,"  "),null,0),f=f.slice(1,f.length-1)),{minified:f,beautified:c}}export{e as defaults,i as helga,t as version};
