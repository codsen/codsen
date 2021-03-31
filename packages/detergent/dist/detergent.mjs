/**
 * detergent
 * Extracts, cleans and encodes text
 * Version: 7.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/detergent/
 */

import{left as e,right as t,leftStopAtNewLines as s,rightStopAtNewLines as r,chompLeft as n}from"string-left-right";import{fixEnt as o}from"string-fix-broken-named-entities";import{removeWidows as i}from"string-remove-widows";import{rProcessOutside as a}from"ranges-process-outside";import{collapse as l}from"string-collapse-white-space";import{trimSpaces as c}from"string-trim-spaces-only";import{stripHtml as p}from"string-strip-html";import{rInvert as h}from"ranges-invert";import{rApply as u}from"ranges-apply";import m from"ansi-regex";import{Ranges as v}from"ranges-push";import f from"he";import{notEmailFriendly as d}from"html-entities-not-email-friendly";import{allNamedEntities as g}from"all-named-html-entities";import{expander as L}from"string-range-expander";import{convertOne as A}from"string-apostrophes";const k={fixBrokenEntities:!0,removeWidows:!0,convertEntities:!0,convertDashes:!0,convertApostrophes:!0,replaceLineBreaks:!0,removeLineBreaks:!1,useXHTML:!0,dontEncodeNonLatin:!0,addMissingSpaces:!0,convertDotsToEllipsis:!0,stripHtml:!0,eol:"lf",stripHtmlButIgnoreTags:["b","strong","i","em","br","sup"],stripHtmlAddNewLine:["li","/ul"],cb:null},B=[".",",",";","!","?"],C=/. ./g,E=[[0,880],[887,890],[894,900],[906,908],[908,910],[929,931],[1319,1329],[1366,1369],[1375,1377],[1415,1417],[1418,1423],[1423,1425],[1479,1488],[1514,1520],[1524,1536],[1540,1542],[1563,1566],[1805,1807],[1866,1869],[1969,1984],[2042,2048],[2093,2096],[2110,2112],[2139,2142],[2142,2208],[2208,2210],[2220,2276],[2302,2304],[2423,2425],[2431,2433],[2435,2437],[2444,2447],[2448,2451],[2472,2474],[2480,2482],[2482,2486],[2489,2492],[2500,2503],[2504,2507],[2510,2519],[2519,2524],[2525,2527],[2531,2534],[2555,2561],[2563,2565],[2570,2575],[2576,2579],[2600,2602],[2608,2610],[2611,2613],[2614,2616],[2617,2620],[2620,2622],[2626,2631],[2632,2635],[2637,2641],[2641,2649],[2652,2654],[2654,2662],[2677,2689],[2691,2693],[2701,2703],[2705,2707],[2728,2730],[2736,2738],[2739,2741],[2745,2748],[2757,2759],[2761,2763],[2765,2768],[2768,2784],[2787,2790],[2801,2817],[2819,2821],[2828,2831],[2832,2835],[2856,2858],[2864,2866],[2867,2869],[2873,2876],[2884,2887],[2888,2891],[2893,2902],[2903,2908],[2909,2911],[2915,2918],[2935,2946],[2947,2949],[2954,2958],[2960,2962],[2965,2969],[2970,2972],[2972,2974],[2975,2979],[2980,2984],[2986,2990],[3001,3006],[3010,3014],[3016,3018],[3021,3024],[3024,3031],[3031,3046],[3066,3073],[3075,3077],[3084,3086],[3088,3090],[3112,3114],[3123,3125],[3129,3133],[3140,3142],[3144,3146],[3149,3157],[3158,3160],[3161,3168],[3171,3174],[3183,3192],[3199,3202],[3203,3205],[3212,3214],[3216,3218],[3240,3242],[3251,3253],[3257,3260],[3268,3270],[3272,3274],[3277,3285],[3286,3294],[3294,3296],[3299,3302],[3311,3313],[3314,3330],[3331,3333],[3340,3342],[3344,3346],[3386,3389],[3396,3398],[3400,3402],[3406,3415],[3415,3424],[3427,3430],[3445,3449],[3455,3458],[3459,3461],[3478,3482],[3505,3507],[3515,3517],[3517,3520],[3526,3530],[3530,3535],[3540,3542],[3542,3544],[3551,3570],[3572,3585],[3642,3647],[3675,3713],[3714,3716],[3716,3719],[3720,3722],[3722,3725],[3725,3732],[3735,3737],[3743,3745],[3747,3749],[3749,3751],[3751,3754],[3755,3757],[3769,3771],[3773,3776],[3780,3782],[3782,3784],[3789,3792],[3801,3804],[3807,3840],[3911,3913],[3948,3953],[3991,3993],[4028,4030],[4044,4046],[4058,4096],[4293,4295],[4295,4301],[4301,4304],[4680,4682],[4685,4688],[4694,4696],[4696,4698],[4701,4704],[4744,4746],[4749,4752],[4784,4786],[4789,4792],[4798,4800],[4800,4802],[4805,4808],[4822,4824],[4880,4882],[4885,4888],[4954,4957],[4988,4992],[5017,5024],[5108,5120],[5788,5792],[5872,5888],[5900,5902],[5908,5920],[5942,5952],[5971,5984],[5996,5998],[6e3,6002],[6003,6016],[6109,6112],[6121,6128],[6137,6144],[6158,6160],[6169,6176],[6263,6272],[6314,7936],[7957,7960],[7965,7968],[8005,8008],[8013,8016],[8023,8025],[8025,8027],[8027,8029],[8029,8031],[8061,8064],[8116,8118],[8132,8134],[8147,8150],[8155,8157],[8175,8178],[8180,8182],[8190,11904],[11929,11931],[12019,12032],[12245,12288],[12351,12353],[12438,12441],[12543,12549],[12589,12593],[12686,12688],[12730,12736],[12771,12784],[12830,12832],[13054,13056],[13312,19893],[19893,19904],[40869,40908],[40908,40960],[42124,42128],[42182,42192],[42539,42560],[42647,42655],[42743,42752],[42894,42896],[42899,42912],[42922,43e3],[43051,43056],[43065,43072],[43127,43136],[43204,43214],[43225,43232],[43259,43264],[43347,43359],[43388,43392],[43469,43471],[43481,43486],[43487,43520],[43574,43584],[43597,43600],[43609,43612],[43643,43648],[43714,43739],[43766,43777],[43782,43785],[43790,43793],[43798,43808],[43814,43816],[43822,43968],[44013,44016],[44025,44032],[55203,55216],[55238,55243],[55291,63744],[64109,64112],[64217,64256],[64262,64275],[64279,64285],[64310,64312],[64316,64318],[64318,64320],[64321,64323],[64324,64326],[64449,64467],[64831,64848],[64911,64914],[64967,65008],[65021,65136],[65140,65142],[65276,66560],[66717,66720],[66729,67584],[67589,67592],[67592,67594],[67637,67639],[67640,67644],[67644,67647],[67669,67671],[67679,67840],[67867,67871],[67897,67903],[67903,67968],[68023,68030],[68031,68096],[68099,68101],[68102,68108],[68115,68117],[68119,68121],[68147,68152],[68154,68159],[68167,68176],[68184,68192],[68223,68352],[68405,68409],[68437,68440],[68466,68472],[68479,68608],[68680,69216],[69246,69632],[69709,69714],[69743,69760],[69825,69840],[69864,69872],[69881,69888],[69940,69942],[69955,70016],[70088,70096],[70105,71296],[71351,71360],[71369,73728],[74606,74752],[74850,74864],[74867,77824],[78894,92160],[92728,93952],[94020,94032],[94078,94095],[94111,110592],[110593,131072],[131072,173782],[173782,173824],[173824,177972],[177972,177984],[177984,178205],[178205,194560]],w=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"];function y(e,t){return t?Array.from(e).map((e=>e.charCodeAt(0)<880||E.some((t=>e.charCodeAt(0)>t[0]&&e.charCodeAt(0)<t[1]))?f.encode(e,{useNamedReferences:!0}):e)).join(""):f.encode(e,{useNamedReferences:!0})}function b(e){return"string"==typeof e&&e.charCodeAt(0)>=48&&e.charCodeAt(0)<=57||Number.isInteger(e)}function O(e){return"string"==typeof e&&1===e.length&&e.toUpperCase()!==e.toLowerCase()}function H(e){return!!O(e)&&(e===e.toLowerCase()&&e!==e.toUpperCase())}function T(e){return!!O(e)&&(e===e.toUpperCase()&&e!==e.toLowerCase())}const W="7.0.12";function M(E,W){if("string"!=typeof E)throw new Error("detergent(): [THROW_ID_01] the first input argument must be of a string type, not "+typeof E);if(W&&"object"!=typeof W)throw new Error("detergent(): [THROW_ID_02] Options object must be a plain object, not "+typeof W);if(W&&W.cb&&"function"!=typeof W.cb)throw new Error(`detergent(): [THROW_ID_03] Options callback, opts.cb must be a function, not ${typeof W.cb} (value was given as:\n${JSON.stringify(W.cb,null,0)})`);const M={...k,...W};["lf","crlf","cr"].includes(M.eol)||(M.eol="lf");const S={fixBrokenEntities:!1,removeWidows:!1,convertEntities:!1,convertDashes:!1,convertApostrophes:!1,replaceLineBreaks:!1,removeLineBreaks:!1,useXHTML:!1,dontEncodeNonLatin:!1,addMissingSpaces:!1,convertDotsToEllipsis:!1,stripHtml:!1,eol:!1};let D="\n";"crlf"===M.eol?D="\r\n":"cr"===M.eol&&(D="\r");const N=[],X=new v({limitToBeAddedWhitespace:!1}),$=new v;function U(){E=u(E,X.current()),X.wipe()}function P(e){return Number.isInteger(e)}const j={onUrlCurrently:!1};let x,R=E=c(E.replace(m(),"").replace(/\u200A/g," "),{cr:!0,lf:!0,tab:!0,space:!0,nbsp:!1}).res;do{x=R,R=f.decode(R)}while(R!==E&&x!==R);E!==R&&(E=R);for(let e=0,t=(E=l(E,{trimLines:!0,removeEmptyLines:!0,limitConsecutiveEmptyLinesTo:1}).result).length;e<t;e++)if(65533===E[e].charCodeAt(0))if(E[e-1]&&E[e+1]&&("n"===E[e-1].toLowerCase()&&"t"===E[e+1].toLowerCase()||O(E[e-1])&&"s"===E[e+1].toLowerCase())||E[e+2]&&(("r"===E[e+1].toLowerCase()||"v"===E[e+1].toLowerCase())&&"e"===E[e+2].toLowerCase()||"l"===E[e+1].toLowerCase()&&"l"===E[e+2].toLowerCase())&&(E[e-3]&&"y"===E[e-3].toLowerCase()&&"o"===E[e-2].toLowerCase()&&"u"===E[e-1].toLowerCase()||E[e-2]&&"w"===E[e-2].toLowerCase()&&"e"===E[e-1].toLowerCase()||E[e-4]&&"t"===E[e-4].toLowerCase()&&"h"===E[e-3].toLowerCase()&&"e"===E[e-2].toLowerCase()&&"y"===E[e-1].toLowerCase())||(E[e-1]&&"i"===E[e-1].toLowerCase()||E[e-2]&&"h"===E[e-2].toLowerCase()&&"e"===E[e-1].toLowerCase()||E[e-3]&&"s"===E[e-3].toLowerCase()&&"h"===E[e-2].toLowerCase()&&"e"===E[e-1].toLowerCase())&&E[e+2]&&"l"===E[e+1].toLowerCase()&&"l"===E[e+2].toLowerCase()||E[e-5]&&E[e+2]&&"m"===E[e-5].toLowerCase()&&"i"===E[e-4].toLowerCase()&&"g"===E[e-3].toLowerCase()&&"h"===E[e-2].toLowerCase()&&"t"===E[e-1].toLowerCase()&&"v"===E[e+1]&&"e"===E[e+2]||E[e-1]&&"s"===E[e-1].toLowerCase()&&(!E[e+1]||!O(E[e+1])&&!b(E[e+1]))){X.push(e,e+1,`${M.convertApostrophes?"’":"'"}`),S.convertApostrophes=!0}else E[e-2]&&H(E[e-2])&&!E[e-1].trim()&&E[e+2]&&H(E[e+2])&&!E[e+1].trim()?X.push(e,e+1,"—"):X.push(e,e+1);U();const I=o(E,{decode:!1});if(I&&I.length&&(S.fixBrokenEntities=!0,M.fixBrokenEntities&&(E=u(E,I))),"function"==typeof M.cb)if(E.includes("<")||E.includes(">")){const e=p(E,{cb:({tag:e,rangesArr:t})=>t.push(e.lastOpeningBracketAt,e.lastClosingBracketAt+1),skipHtmlDecoding:!0}).ranges,t=(h(e,E.length)||[]).reduce(((e,t)=>"function"==typeof M.cb&&E.slice(t[0],t[1])!==M.cb(E.slice(t[0],t[1]))?e.concat([[t[0],t[1],M.cb(E.slice(t[0],t[1]))]]):e),[]);Array.isArray(t)&&t.length&&(E=u(E,t))}else E=M.cb(E);if(E.includes("<")||E.includes(">")){const r=({tag:r,deleteFrom:o,deleteTo:i,proposedReturn:a})=>{if(P(r.lastOpeningBracketAt)&&P(r.lastClosingBracketAt)&&r.lastOpeningBracketAt<r.lastClosingBracketAt||r.slashPresent){if(S.stripHtml=!0,$.push(r.lastOpeningBracketAt,r.lastClosingBracketAt?r.lastClosingBracketAt+1:E.length),M.stripHtml&&!M.stripHtmlButIgnoreTags.includes(r.name.toLowerCase()))Array.isArray(M.stripHtmlAddNewLine)&&M.stripHtmlAddNewLine.length&&M.stripHtmlAddNewLine.some((e=>e.startsWith("/")&&r.slashPresent&&r.slashPresent<r.nameEnds&&r.name.toLowerCase()===e.slice(1)||!e.startsWith("/")&&!(r.slashPresent&&r.slashPresent<r.nameEnds)&&r.name.toLowerCase()===function(e){return"string"==typeof e&&e.length&&e.endsWith("/")?e.slice(0,-1).trim():e}(e)))?(S.removeLineBreaks=!0,M.removeLineBreaks||"number"!=typeof o||"number"!=typeof i?X.push(a):(S.replaceLineBreaks=!0,M.replaceLineBreaks&&(S.useXHTML=!0),X.push(o,i,(M.replaceLineBreaks?`<br${M.useXHTML?"/":""}>`:"")+"\n"))):(X.push(a),$.push(a));else{if(w.includes(r.name.toLowerCase())){if(S.useXHTML=!0,"/"!==E[e(E,r.lastClosingBracketAt)]&&r.lastClosingBracketAt&&M.useXHTML&&X.push(r.lastClosingBracketAt,r.lastClosingBracketAt,"/"),r.slashPresent&&P(r.lastOpeningBracketAt)&&r.nameStarts&&r.lastOpeningBracketAt<r.nameStarts-1&&E.slice(r.lastOpeningBracketAt+1,r.nameStarts).split("").every((e=>!e.trim()||"/"===e))&&X.push(r.lastOpeningBracketAt+1,r.nameStarts),r.slashPresent&&"/"===E[e(E,r.lastClosingBracketAt)])if("/"===E[e(E,e(E,r.lastClosingBracketAt))])S.useXHTML=!0,(!M.useXHTML||"number"==typeof n(E,r.lastClosingBracketAt,{mode:2},"/")&&"/"!==E.slice(n(E,r.lastClosingBracketAt,{mode:2},"/"),r.lastClosingBracketAt))&&X.push(n(E,r.lastClosingBracketAt,{mode:2},"/"),r.lastClosingBracketAt,M.useXHTML?"/":void 0);else if(!M.useXHTML||"number"!=typeof e(E,r.slashPresent)||"/"!==E.slice(e(E,r.slashPresent)+1,r.lastClosingBracketAt)){const t=e(E,r.slashPresent)+1,s=r.lastClosingBracketAt,n=M.useXHTML?"/":null;n?X.push(t,s,n):X.push(t,s)}}else r.slashPresent&&"/"===E[e(E,r.lastClosingBracketAt)]&&(X.push(n(E,r.lastClosingBracketAt,{mode:2},"/"),r.lastClosingBracketAt),X.push(r.lastOpeningBracketAt+1,r.lastOpeningBracketAt+1,"/"));r.name.toLowerCase()!==r.name&&X.push(r.nameStarts,r.nameEnds,r.name.toLowerCase()),"/>".includes(E[t(E,r.nameEnds-1)])&&(t(E,r.nameEnds-1)||0)>r.nameEnds&&X.push(r.nameEnds,t(E,r.nameEnds-1)),P(r.lastOpeningBracketAt)&&P(r.nameStarts)&&r.lastOpeningBracketAt+1<r.nameStarts&&(E.slice(r.lastOpeningBracketAt+1,r.nameStarts).trim().length?!w.includes(r.name.toLowerCase())&&E.slice(r.lastOpeningBracketAt+1,r.nameStarts).split("").every((e=>!e.trim()||"/"===e))&&X.push(r.lastOpeningBracketAt+1,r.nameStarts,"/"):X.push(r.lastOpeningBracketAt+1,r.nameStarts))}"br"===r.name.toLowerCase()&&r.lastClosingBracketAt&&N.push(r.lastClosingBracketAt),["ul","li"].includes(r.name.toLowerCase())&&!M.removeLineBreaks&&E[r.lastOpeningBracketAt-1]&&!E[r.lastOpeningBracketAt-1].trim()&&"number"==typeof r.lastOpeningBracketAt&&"number"==typeof s(E,r.lastOpeningBracketAt)&&X.push(s(E,r.lastOpeningBracketAt)+1,r.lastOpeningBracketAt),E[r.lastClosingBracketAt-1]&&!E[r.lastClosingBracketAt-1].trim()&&"number"==typeof r.lastClosingBracketAt&&"number"==typeof e(E,r.lastClosingBracketAt)&&X.push(e(E,r.lastClosingBracketAt)+1,r.lastClosingBracketAt)}};p(E,{cb:r,trimOnlySpaces:!0,ignoreTags:M.stripHtml?M.stripHtmlButIgnoreTags:[],skipHtmlDecoding:!0})}a(E,$.current(),((n,o,i)=>function(n,o,i,a,l,c,p,h,u,m){const v=n.length;if(/[\uD800-\uDFFF]/g.test(n[a])&&!(n.charCodeAt(a+1)>=56320&&n.charCodeAt(a+1)<=57343||n.charCodeAt(a-1)>=55296&&n.charCodeAt(a-1)<=56319))i.push(a,a+1);else if(l-a>1)u.convertEntities=!0,u.dontEncodeNonLatin=u.dontEncodeNonLatin||y(n.slice(a,l),!0)!==y(n.slice(a,l),!1),o.convertEntities&&i.push(a,l,y(n.slice(a,l),o.dontEncodeNonLatin));else{const k=n[a].charCodeAt(0);if(k<127){if(k<32)if(k<9)3===k?(i.push(a,l,o.removeLineBreaks?" ":o.replaceLineBreaks?`<br${o.useXHTML?"/":""}>\n`:"\n"),u.removeLineBreaks=!0,o.removeLineBreaks||(u.replaceLineBreaks=!0,o.replaceLineBreaks&&(u.useXHTML=!0))):i.push(a,l);else if(9===k)i.push(a,l," ");else if(10===k){if(u.removeLineBreaks||(u.removeLineBreaks=!0),o.removeLineBreaks||p&&(!Array.isArray(p)||p.some((t=>e(n,a)===t)))||(o.replaceLineBreaks?(u.useXHTML=!0,u.replaceLineBreaks=!0):o.replaceLineBreaks||(u.replaceLineBreaks=!0)),o.removeLineBreaks||(u.eol=!0),o.removeLineBreaks){let e=" ";B.includes(n[t(n,a)])&&(e=""),i.push(a,l,e)}else if(o.replaceLineBreaks&&(!p||Array.isArray(p)&&!p.some((t=>e(n,a)===t)))){let e=a;" "===n[a-1]&&"number"==typeof s(n,a)&&(e=s(n,a)+1),i.push(e,a+("\r"===m?1:0),`<br${o.useXHTML?"/":""}>${"\r\n"===m?"\r":""}${"\r"===m?"\r":""}`)}else{if(n[s(n,a)]&&n[s(n,a)].trim()){const e=s(n,a);"number"==typeof e&&e<a-1&&i.push(e+1,a,"\r\n"===m?"\r":"")}"\r\n"===m&&"\r"!==n[a-1]?i.push(a,a,"\r"):"\r"===m&&i.push(a,a+1);const e=r(n,a);e&&n[e].trim()&&e>a+1&&i.push(a+1,e)}h.onUrlCurrently=!1}else if(11===k||12===k)u.removeLineBreaks=!0,i.push(a,l,o.removeLineBreaks?" ":"\n");else if(13===k)if(u.removeLineBreaks||(u.removeLineBreaks=!0),o.removeLineBreaks||p&&(!Array.isArray(p)||p.some((t=>e(n,a)===t)))||(o.replaceLineBreaks&&!o.removeLineBreaks?(u.useXHTML=!0,u.replaceLineBreaks=!0):o.replaceLineBreaks||(u.replaceLineBreaks=!0)),o.removeLineBreaks||(u.eol=!0),o.removeLineBreaks){let e=" ";(B.includes(n[t(n,a)])||["\n","\r"].includes(n[a+1]))&&(e=""),i.push(a,l,e)}else if(o.replaceLineBreaks&&(!p||Array.isArray(p)&&!p.some((t=>e(n,a)===t)))){let e=a;" "===n[a-1]&&"number"==typeof s(n,a)&&(e=s(n,a)+1);let t=a,r="";"\n"!==n[a+1]&&("\n"===m?r="\n":"\r\n"===m&&i.push(a+1,a+1,"\n")),"\n"===m?t=a+1:"\r"===m&&"\n"===n[a+1]&&i.push(a+1,a+2),i.push(e,t,`<br${o.useXHTML?"/":""}>${r}`),"\n"===n[a+1]&&c(1)}else{"\n"===m?i.push(a,a+1,"\n"===n[a+1]?"":"\n"):"\r"===m&&"\n"===n[a+1]?i.push(a+1,a+2):"\r\n"===m&&"\n"!==n[a+1]&&i.push(a,a+1,"\n");const e=s(n,a);if("number"==typeof e&&n[e].trim()){let t=a;"\n"===m&&(t=a+1),e<a-1&&i.push(e+1,t,"\n"===n[a+1]?"":"\n")}const t=r(n,a);t&&n[t].trim()&&"\n"!==n[a+1]&&t>a+1&&i.push(a+1,t)}else k>13&&i.push(a,l);else if(32===k);else if(34===k){u.convertEntities=!0,(b(e(n,a))||b(t(n,a)))&&(u.convertApostrophes=!0);const s=A(n,{from:a,convertEntities:o.convertEntities,convertApostrophes:o.convertApostrophes,offsetBy:c});s&&s.length?i.push(s):o.convertEntities&&i.push(a,a+1,"&quot;")}else if(38===k)if(O(n[a+1])){const e=Object.keys(g).find((e=>n.startsWith(e,a+1)&&";"===n[a+e.length+1]));if(u.convertEntities=!0,e)if("apos"===e){u.convertApostrophes=!0;const t=A(n,{from:a,to:a+e.length+2,value:"'",convertEntities:o.convertEntities,convertApostrophes:o.convertApostrophes,offsetBy:c});Array.isArray(t)&&t.length?(i.push(t),c(e.length+2)):(i.push([a,a+e.length+2,"'"]),c(e.length+2))}else o.convertEntities&&Object.keys(d).includes(n.slice(a+1,a+e.length+1))?(i.push(a,a+e.length+2,`&${d[n.slice(a+1,a+e.length+1)]};`),c(e.length+1)):(o.convertEntities||i.push(a,a+e.length+2,f.decode(`${n.slice(a,a+e.length+2)}`)),c(e.length+1));else o.convertEntities&&i.push(a,a+1,"&amp;")}else if("#"===n[t(n,a)]){for(let e=t(n,a);e<v;e++)if(n[e].trim()&&!b(n[e])&&"#"!==n[e]&&";"===n[e]){const t=f.encode(f.decode(n.slice(a,e+1)),{useNamedReferences:!0});t&&i.push(a,e+1,t),c(e+1-a)}}else u.convertEntities=!0,o.convertEntities&&i.push(a,a+1,"&amp;");else if(39===k){const e=A(n,{from:a,convertEntities:!0,convertApostrophes:!0});e&&e.length&&(u.convertApostrophes=!0,o.convertApostrophes&&(u.convertEntities=!0),i.push(A(n,{from:a,convertEntities:o.convertEntities,convertApostrophes:o.convertApostrophes,offsetBy:c})))}else if(44===k||59===k){if(n[a-1]&&!n[a-1].trim()){const t=e(n,a);"number"==typeof t&&t<a-1&&i.push(t+1,a)}44!==k||void 0===n[l]||h.onUrlCurrently||b(n[l])||!n[l].trim()||" "===n[l]||"\n"===n[l]||'"'===n[l]||"'"===n[l]||"‘"===n[l]||"“"===n[l]||"’"===n[l]||"”"===n[l]||(u.addMissingSpaces=!0,o.addMissingSpaces&&i.push(l,l," ")),59===k&&void 0!==n[l]&&!h.onUrlCurrently&&n[l].trim()&&"&"!==n[l]&&'"'!==n[l]&&"'"!==n[l]&&"‘"!==n[l]&&"“"!==n[l]&&"’"!==n[l]&&"”"!==n[l]&&(u.addMissingSpaces=!0,o.addMissingSpaces&&i.push(l,l," "))}else if(45===k)" "===n[a-1]&&" "===n[l]&&b(n[e(n,a)])&&b(n[t(n,l)])||(" "!==n[a-1]&&" "!==n[a-1]||"$"===n[l]||"£"===n[l]||"€"===n[l]||"₽"===n[l]||"0"===n[l]||"1"===n[l]||"2"===n[l]||"3"===n[l]||"4"===n[l]||"5"===n[l]||"6"===n[l]||"7"===n[l]||"8"===n[l]||"9"===n[l]||"-"===n[l]||">"===n[l]||" "===n[l]?n[a-1]&&n[l]&&(b(n[a-1])&&b(n[l])||"a"===n[a-1].toLowerCase()&&"z"===n[l].toLowerCase())?(u.convertDashes=!0,o.convertDashes&&(u.convertEntities=!0,i.push(a,l,o.convertEntities?"&ndash;":"–"))):(n[a-1]&&n[l]&&(!n[a-1].trim()&&!n[l].trim()||H(n[a-1])&&"'"===n[l])||n[a-1]&&n[l]&&O(n[a-1])&&function(e){return'"'===e||"'"===e||"‘"===e||"’"===e||"“"===e||"”"===e}(n[l]))&&(u.convertDashes=!0,o.convertDashes&&(u.convertEntities=!0,i.push(a,l,o.convertEntities?"&mdash;":"—"))):(u.addMissingSpaces=!0,o.addMissingSpaces&&i.push(l,l," "))),n[a-2]&&n[a-2].trim()&&!n[a-1].trim()&&!["\n","\r"].includes(n[a-1])&&(u.removeWidows=!0,o.removeWidows&&(u.convertEntities=!0,i.push(a-1,a,o.convertEntities?"&nbsp;":" ")));else if(46===k){"."!==n[a-1]&&"."===n[l]&&"."===n[l+1]&&"."!==n[l+2]&&(u.convertDotsToEllipsis=!0,o.convertDotsToEllipsis&&(u.convertEntities=!0,i.push(a,l+2,o.convertEntities?"&hellip;":"…")));const e=n[l]?n[l].toLowerCase():"",t=n[l+1]?n[l+1].toLowerCase():"",s=n[l+2]?n[l+2].toLowerCase():"",r=n[l+3]?n[l+3].toLowerCase():"",c=e+t+s;if(e+t!=="js"&&"jpg"!==c&&"png"!==c&&"gif"!==c&&"svg"!==c&&"htm"!==c&&"pdf"!==c&&"psd"!==c&&"tar"!==c&&"zip"!==c&&"rar"!==c&&"otf"!==c&&"ttf"!==c&&"eot"!==c&&"php"!==c&&"rss"!==c&&"asp"!==c&&"ppt"!==c&&"doc"!==c&&"txt"!==c&&"rtf"!==c&&"git"!==c&&c+r!=="jpeg"&&c+r!=="html"&&c+r!=="woff"&&(O(n[a-2])||"p"!==n[a-1]||"s"!==n[l]||"t"!==n[l+1]||O(n[l+2]))&&(void 0!==n[l]&&(!h.onUrlCurrently&&T(n[l])||h.onUrlCurrently&&O(n[l])&&T(n[l])&&O(n[l+1])&&H(n[l+1]))&&" "!==n[l]&&"."!==n[l]&&"\n"!==n[l]&&(u.addMissingSpaces=!0,o.addMissingSpaces&&i.push(l,l," ")),void 0!==n[a-1]&&""===n[a-1].trim()&&"."!==n[l]&&(void 0===n[a-2]||"."!==n[a-2])))for(l=a-1;l--;)if(""!==n[l].trim()){i.push(l+1,a);break}}else if(47===k);else if(58===k)n[l-1]&&"/"===n[t(n,l-1)]&&"/"===n[t(n,t(n,l-1))]&&(h.onUrlCurrently=!0);else if(60===k)u.convertEntities=!0,o.convertEntities&&i.push(a,a+1,"&lt;");else if(62===k)u.convertEntities=!0,o.convertEntities&&i.push(a,a+1,"&gt;");else if(119===k)n[l+1]&&"w"===n[l].toLowerCase()&&"w"===n[l+1].toLowerCase()&&(h.onUrlCurrently=!0);else if(123===k){let e;if("{"===n[l]?e="}}":"%"===n[l]&&(e="%}"),e)for(let t=a;t<v;t++)if(n[t]===e[0]&&n[t+1]===e[1]){c(t+1-a);break}}}else if(k>126&&k<160)133!==k?i.push(a,l):(u.removeLineBreaks=!0,i.push(a,l,o.removeLineBreaks?"":"\n"));else if(160===k)if(o.removeWidows)u.convertEntities=!0,u.removeWidows=!0,o.convertEntities&&i.push(a,l,"&nbsp;");else{const s=a,r=l;let c=" ";const p=e(n,a),h=t(n,r-1);null===p||null===h?(c=o.convertEntities?"&nbsp;":" ",u.convertEntities=!0):u.removeWidows=!0,c?i.push(s,r,c):i.push(s,r)}else if(173===k)i.push(a,l);else if(8232===k||8233===k)u.removeLineBreaks=!0,i.push(a,l,o.removeLineBreaks?"":"\n");else if([5760,8191,8192,8193,8194,8195,8196,8197,8198,8199,8200,8201,8202,8239,8287,12288].includes(k))if(n[l]){const e=L({str:n,from:a,to:l,wipeAllWhitespaceOnLeft:!0,wipeAllWhitespaceOnRight:!0,addSingleSpaceToPreventAccidentalConcatenation:!0});i.push(...e)}else i.push(a,l);else if(8206===k)i.push(a,l);else if(8207===k)i.push(a,l);else if(8211===k||65533===k&&b(n[a-1])&&b(n[l])){if(u.convertDashes=!0,o.convertDashes?(u.convertEntities=!0,o.convertEntities?!n[a-1]||n[a-1].trim()||!n[a+1]||n[a+1].trim()||b(n[a-2])&&b(n[a+2])?i.push(a,l,"&ndash;"):i.push(a,l,"&mdash;"):65533===k&&(n[a-1]&&!n[a-1].trim()&&n[a+1]&&!n[a+1].trim()?i.push(a,l,"—"):i.push(a,l,"–"))):i.push(a,l,"-"),n[a-1]&&!n[a-1].trim()&&n[l].trim())if(n[a-2]&&b(n[a-2])&&b(n[l]))i.push(a-1,a);else{if(u.addMissingSpaces=!0,u.convertEntities=!0,o.addMissingSpaces){let e=" ";C.test(n.slice(l))||(u.removeWidows=!0,o.removeWidows&&(e=o.convertEntities?"&nbsp;":" ")),i.push(l,l,e)}" "!==n.slice(a-1,a)&&(u.removeWidows=!0,o.removeWidows&&i.push(a-1,a,o.convertEntities?"&nbsp;":" "))}else n[a-2]&&n[a-1]&&n[l]&&n[l+1]&&b(n[a-2])&&b(n[l+1])&&!n[a-1].trim()&&!n[l].trim()&&(i.push(a-1,a),i.push(l,l+1));!n[a-2]||!n[a+1]||n[a-1].trim()||!n[a-2].trim()||n[a+1].trim()||b(n[a-2])&&b(n[a+2])||(u.removeWidows=!0,o.removeWidows&&i.push(a-1,a,o.convertEntities?"&nbsp;":" "))}else if(8212===k||65533===k&&" "===n[a-1]&&" "===n[l])u.convertDashes=!0," "===n[a-1]&&null!==e(n,a)&&(u.removeWidows=!0,o.removeWidows&&(u.convertEntities=!0,"number"==typeof e(n,a)&&i.push(e(n,a)+1,a,o.convertEntities?"&nbsp;":" "))),o.convertDashes?(u.convertEntities=!0,n[a-1]&&!n[a-1].trim()&&n[l].trim()&&(u.addMissingSpaces=!0,o.addMissingSpaces&&i.push(l,l," ")),o.convertEntities?i.push(a,l,"&mdash;"):65533===k&&i.push(a,l,"—")):i.push(a,l,"-");else if(8216===k){const e=A(n,{from:a,to:l,convertEntities:!0,convertApostrophes:!0});e&&e.length&&(u.convertApostrophes=!0,A(n,{from:a,to:l,convertEntities:!0,convertApostrophes:!0})&&(o.convertApostrophes&&(u.convertEntities=!0),i.push(A(n,{from:a,to:l,convertEntities:o.convertEntities,convertApostrophes:o.convertApostrophes,offsetBy:c}))))}else if(8217===k)u.convertApostrophes=!0,o.convertApostrophes?(u.convertEntities=!0,o.convertEntities&&i.push(a,l,"&rsquo;")):i.push(a,l,"'");else if(8220===k)u.convertApostrophes=!0,o.convertApostrophes?o.convertEntities&&(u.convertEntities=!0,i.push(a,l,"&ldquo;")):(u.convertEntities=!0,i.push(a,l,o.convertEntities?"&quot;":'"'));else if(8221===k)u.convertApostrophes=!0,o.convertApostrophes?o.convertEntities&&(u.convertEntities=!0,i.push(a,l,"&rdquo;")):(u.convertEntities=!0,i.push(a,l,o.convertEntities?"&quot;":'"'));else if(8230===k)u.convertDotsToEllipsis=!0,o.convertDotsToEllipsis?(u.convertEntities=!0,o.convertEntities&&i.push(a,l,"&hellip;")):i.push(a,l,"...");else if(65279===k)i.push(a,l);else{u.dontEncodeNonLatin||y(n[a],!0)===y(n[a],!1)||(u.dontEncodeNonLatin=!0);let e=y(n[a],o.dontEncodeNonLatin);Object.keys(d).includes(e.slice(1,e.length-1))&&(e=`&${d[e.slice(1,e.length-1)]};`),n[a]!==e&&(u.convertEntities=!0,o.convertEntities&&("&mldr;"===e?i.push(a,l,"&hellip;"):"&apos;"!==e&&i.push(a,l,e),u.convertEntities=!0))}h.onUrlCurrently&&!n[a].trim()&&(h.onUrlCurrently=!1)}}(E,M,X,n,o,i,N,j,S,D)),!0),U(),E=(E=E.replace(/ (<br[/]?>)/g,"$1")).replace(/(\r\n|\r|\n){3,}/g,`${D}${D}`);const q=i(E,{ignore:"all",convertEntities:M.convertEntities,targetLanguage:"html",UKPostcodes:!0,hyphens:M.convertDashes,tagRanges:$.current()});return q&&q.ranges&&q.ranges.length&&(!S.removeWidows&&q.whatWasDone.removeWidows&&(S.removeWidows=!0,M.removeWidows&&(S.convertEntities=!0)),!S.convertEntities&&q.whatWasDone.convertEntities&&(S.convertEntities=!0),M.removeWidows&&(E=q.res)),E!==E.replace(/\r\n|\r|\n/gm," ")&&(S.removeLineBreaks=!0,M.removeLineBreaks&&(E=E.replace(/\r\n|\r|\n/gm," "))),E=l(E,{trimLines:!0}).result,u(E,X.current()).split("").forEach(((e,t)=>{})),{res:u(E,X.current()),applicableOpts:S}}export{M as det,k as opts,W as version};
