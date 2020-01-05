/**
 * is-media-descriptor
 * Is given string a valid media descriptor (including media query)?
 * Version: 0.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/is-media-descriptor
 */

!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e=e||self).isMediaDescriptor=t()}(this,(function(){"use strict";const e=[],t=[],r=(r,n)=>{if(r===n)return 0;const i=r;r.length>n.length&&(r=n,n=i);let o=r.length,f=n.length;for(;o>0&&r.charCodeAt(~-o)===n.charCodeAt(~-f);)o--,f--;let a,h,l,s,d=0;for(;d<o&&r.charCodeAt(d)===n.charCodeAt(d);)d++;if(o-=d,f-=d,0===o)return f;let u=0,c=0;for(;u<o;)t[u]=r.charCodeAt(d+u),e[u]=++u;for(;c<f;)for(a=n.charCodeAt(d+c),l=c++,h=c,u=0;u<o;u++)s=a===t[u]?l:l+1,l=e[u],h=e[u]=l>h?s>h?h+1:s:s>l?l+1:s;return h};var n=r,i=r;n.default=i;var o=["all","aural","braille","embossed","handheld","print","projection","screen","speech","tty","tv"];return function(e){if("string"!=typeof e)return[];if(!e.trim().length)return[];var t=[],r=0,i=e.length,f=e.trim();if(e!==e.trim()){var a=[];if(!e[0].trim().length)for(var h=0,l=e.length;h<l;h++)if(e[h].trim().length){a.push([0,h]),r=h;break}if(!e[e.length-1].trim().length)for(var s=e.length;s--;)if(e[s].trim().length){a.push([s+1,e.length]),i=s+1;break}t.push({idxFrom:a[0][0],idxTo:a[a.length-1][1],message:"Remove whitespace.",fix:{ranges:a}})}if(o.includes(f))return t;if(f.match(/^\w+$|^\w*\W\w+$|^\w+\W\w*$/g))for(var d=0,u=o.length;d<u;d++)if(1===n(o[d],f)){t.push({idxFrom:r,idxTo:i,message:'Did you mean "'.concat(o[d],'"?'),fix:{ranges:[[r,i,o[d]]]}});break}return t}}));
