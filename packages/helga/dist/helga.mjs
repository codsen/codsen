/**
 * helga
 * Your next best friend when editing complex nested code
 * Version: 1.3.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/helga/
 */

const t="1.3.0",e={targetJSON:!1},n={b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",v:"\v","'":"'",'"':'"',"\\":"\\",0:"\0"};function r(t){return t.replace(/\\([bfnrtv'"\\0])/g,(t=>n[t]||t&&(t.startsWith("\\")?n[t.slice(1)]:"")))}function i(t,n){const i={...e,...n},s=r(t);let c=r(t);return i.targetJSON&&(c=JSON.stringify(c.replace(/\t/g,"  "),null,0),c=c.slice(1,c.length-1)),{minified:c,beautified:s}}export{e as defaults,i as helga,t as version};
