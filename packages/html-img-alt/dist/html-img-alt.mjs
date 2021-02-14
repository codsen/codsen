/**
 * html-img-alt
 * Adds missing alt attributes to img tags. Non-parsing.
 * Version: 2.0.5
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/html-img-alt/
 */

import{unfancy as t}from"string-unfancy";import{rApply as r}from"ranges-apply";import{Ranges as e}from"ranges-push";import{checkTypesMini as i}from"check-types-mini";const n="2.0.5";function a(n,a){if("string"!=typeof n)throw new TypeError(`html-img-alt/alts(): [THROW_ID_01] Input must be string! Currently its type is: ${typeof n}, equal to: ${JSON.stringify(n,null,4)}`);if(a&&(!(l=a)||"object"!=typeof l||Array.isArray(l)))throw new TypeError(`html-img-alt/alts(): [THROW_ID_02] Options object must be a plain object! Currently its type is: ${typeof a}, equal to: ${JSON.stringify(a,null,4)}`);var l;let o,s=!1,d=!1,m=0,c=0,u=0,f=0,g=!1,p=0,h=0,y=0,w=!1,$=null;const T=new e,_=new e,O={unfancyTheAltContents:!0},b={...O,...a};i(b,O,{msg:"html-img-alt/alts(): [THROW_ID_03]"});for(let r=0,e=n.length;r<e;r++){if(n[r].charCodeAt(0),"<img"==`${n[r]}${n[r+1]}${n[r+2]}${n[r+3]}`){if(s)throw new TypeError(`html-img-alt/alts(): [THROW_ID_02] Something is wrong with the code - there's an image tag within an image tag. First image tag was: ${n.slice(m-20,m+20)}, then before it was closed, we've got this: ${n.slice(r-20,r+20)}`);s=!0,m=r}if(s&&"/"===n[r]&&(u=r),s&&!d&&("alt"==`${n[r]}${n[r+1]}${n[r+2]}`?$=r:"alt"==`${n[r-3]}${n[r-2]}${n[r-1]}`&&(g=!0)),g&&""!==n[r].trim()&&"="!==n[r]&&'"'!==n[r]&&(g=!1),$&&r===$+3&&(p=r),"="===n[r]&&($&&(p=0,h=r+1),_.current()&&_.current().length&&_.wipe(),d&&'"'===n[r+1]&&(d=!1,f=0)),c&&""!==n[r].trim()){if(c<r-1+(">"===n[r]||"'"===n[r]||u||p||h||y?1:0)&&(d?_.add(c,r-1+(">"===n[r]||"'"===n[r]||u||p||h||y?1:0)):T.add(c,r-1+(">"===n[r]||"'"===n[r]||u||p||h||y?1:0)),">"!==n[r]&&"/"!==n[r]||(w=!0),p&&"="!==n[r]&&r>=p||h&&'"'!==n[r]&&r>=h)){const t="",r=p||h;let e="";p&&(e+="="),d||T.add(r,r,`${e}""${t}`),p=0,h=0}c=0}if('"'===n[r]&&(d=!d,r===h&&(y=r+1)),'"'===n[r])if(h&&r>=h)y=h,h=0,g&&(f=r+1,g=!1),"/"!==n[r+1].trim()&&">"!==n[r+1].trim()||(w=!0,o=!1);else if(y&&r>=y){if(_.wipe(),y=0,">"!==n[r+1]&&"/"!==n[r+1]||(w=!0,o=!1),f&&b.unfancyTheAltContents){const e=n.slice(f,r);t(e).trim()!==e&&T.add(f,r,t(e).trim())}f=0}s&&!d&&"'"===n[r]&&(T.add(r,r+1),"/"!==n[r+1]&&">"!==n[r+1]||(w=!0)),s&&">"===n[r]&&(m=0,d=!1,null===$&&(u?T.add(u,u,' alt="" '):T.add(r,r,' alt="" '),o=!1,w=!1),u||p!==r?u&&p===r-1&&(T.add(r-1,r-1,'="" '),o=!1):(T.add(r,r,'="" '),o=!1),!u&&h&&h<=r?(T.add(r,r,'"" '),w=!1):u&&h&&h<=r?(T.add(r-1,r-1,'"" '),w=!1):!u&&y&&y<=r?(T.add(r,r,'"'),w=!0,_.current()&&_.current().forEach((t=>{T.add(t[0],t[1],t[2])})),T.current(),_.wipe()):u&&y&&y<=r&&(T.add(y+1,y+1,'"'),_.current()&&_.current().forEach((t=>{T.add(t[0],t[1],t[2])})),_.wipe(),T.current()),(o||w)&&(u?T.add(u,u," "):T.add(r,r," ")),s=!1,$=null,h=0,y=0,o=!1),u&&"/"!==n[r]&&""!==n[r].trim()&&(u=0,p=0,h=0,y=0),s&&""===n[r].trim()&&!c&&(c=r)}return T.current()&&T.current().length>0?r(n,T.current()):n}export{a as alts,n as version};
