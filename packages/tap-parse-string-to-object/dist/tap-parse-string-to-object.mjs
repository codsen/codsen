/**
 * tap-parse-string-to-object
 * Parses raw Tap: string-to-object or stream-to-a-promise-of-an-object
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/tap-parse-string-to-object/
 */

import t from"isstream";import s from"split2";import e from"through2";class i{constructor(){this.canCount=!1,this.doNothing=!1,this.thereWereFailuresInThisSuite=null,this.total={ok:!0,assertsTotal:0,assertsPassed:0,assertsFailed:0,suitesTotal:0,suitesPassed:0,suitesFailed:0}}readLine(t){this.doNothing||"---"!==t.trim()||(this.doNothing=!0),this.doNothing&&"..."===t.trim()?this.doNothing=!1:!this.doNothing&&this.canCount&&(t.trim().startsWith("ok")||t.trim().startsWith("not ok")?(t.trim().startsWith("ok")?this.total.assertsPassed+=1:t.trim().startsWith("not ok")&&(this.total.assertsFailed+=1,this.thereWereFailuresInThisSuite||(this.thereWereFailuresInThisSuite=!0)),this.total.assertsTotal+=1):this.canCount=!1),this.doNothing||"{"!==t.trim()||(this.total.suitesTotal+=1,null!==this.thereWereFailuresInThisSuite&&(this.thereWereFailuresInThisSuite?this.total.suitesFailed+=1:this.total.suitesPassed+=1),this.thereWereFailuresInThisSuite=!1);const s="# Subtest";this.doNothing||this.canCount||!t.includes(s)||(this.canCount=!0,t.slice(0,t.indexOf(s)).trim().endsWith("{")&&(this.total.suitesTotal+=1,null===this.thereWereFailuresInThisSuite?this.thereWereFailuresInThisSuite=!1:this.thereWereFailuresInThisSuite?(this.total.suitesFailed+=1,this.thereWereFailuresInThisSuite=!1):this.total.suitesPassed+=1))}getTotal(){return this.thereWereFailuresInThisSuite?(this.total.suitesFailed+=1,this.thereWereFailuresInThisSuite=!1):this.total.suitesTotal&&(this.total.suitesPassed+=1),!this.total.suitesTotal&&this.total.assertsTotal&&(this.total.suitesTotal=1,this.thereWereFailuresInThisSuite?this.total.suitesFailed=1:this.total.suitesPassed=1),{...this.total}}}const r="2.0.12";function a(r){if(t(r))return new Promise(((t,a)=>{const h=new i;r.pipe(s()).pipe(e.obj(((t,s,e)=>{h.readLine(t),e()}))),r.on("end",(()=>t(h.getTotal()))),r.on("error",a)}));if("string"==typeof r){if(!r.length)return{ok:!0,assertsTotal:0,assertsPassed:0,assertsFailed:0,suitesTotal:0,suitesPassed:0,suitesFailed:0};const t=new i;return function(t,s){let e=null;for(let i=0,r=t.length;i<r;i++)["\n","\r"].includes(t[i])?null!==e&&(s(t.slice(e,i)),e=null):null===e&&(e=i),null===e||t[i+1]||s(t.slice(e,i+1))}(r,(s=>{t.readLine(s)})),t.getTotal()}throw new Error("tap-parse-string-to-object: [THROW_ID_01] inputs should be either string or stream")}export{a as parseTap,r as version};
