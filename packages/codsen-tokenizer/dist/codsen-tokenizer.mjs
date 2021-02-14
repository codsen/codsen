/**
 * codsen-tokenizer
 * HTML and CSS lexer aimed at code with fatal errors, accepts mixed coding languages
 * Version: 5.1.2
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/codsen-tokenizer/
 */

import{matchRight as t,matchLeft as e,matchRightIncl as a,matchLeftIncl as l}from"string-match-left-right";import r from"lodash.clonedeep";import{right as i,left as n}from"string-left-right";import{isAttrClosing as s}from"is-html-attribute-closing";import{allHtmlAttribs as u}from"html-all-known-attributes";import{isAttrNameChar as o}from"is-char-suitable-for-html-attr-name";import{isOpening as p}from"is-html-tag-opening";const d=new Set(["a","abbr","acronym","address","applet","area","article","aside","audio","b","base","basefont","bdi","bdo","bgsound","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","command","content","data","datalist","dd","del","details","dfn","dialog","dir","div","dl","dt","element","em","embed","fieldset","figcaption","figure","font","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","image","img","input","ins","isindex","kbd","keygen","label","legend","li","link","listing","main","map","mark","marquee","menu","menuitem","meta","meter","multicol","nav","nextid","nobr","noembed","noframes","noscript","object","ol","optgroup","option","output","p","param","picture","plaintext","pre","progress","q","rb","rp","rt","rtc","ruby","s","samp","script","section","select","shadow","slot","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","title","tr","track","tt","u","ul","var","video","wbr","xmp"]),g="{}%-$_()*|#",c="{}|#",b="%()$_*#",h="({",m="})",y=[")|(","|(",")(","()","}{","{}","%)","*)","||","--"],f=".,;!?";function A(t){return!(!t||!(t.charCodeAt(0)>64&&t.charCodeAt(0)<91||t.charCodeAt(0)>96&&t.charCodeAt(0)<123))}function V(t){let e="";for(let a=0,l=t.length;a<l;a++)e="["===t[a]?`]${e}`:"]"===t[a]?`[${e}`:"{"===t[a]?`}${e}`:"}"===t[a]?`{${e}`:"("===t[a]?`)${e}`:")"===t[a]?`(${e}`:"<"===t[a]?`>${e}`:">"===t[a]?`<${e}`:"“"===t[a]?`”${e}`:"”"===t[a]?`“${e}`:`${t[a]}${e}`;return e}function v(t){return d.has(t.toLowerCase())||["doctype","cdata","xml"].includes(t.toLowerCase())}function S(t,e,a,l){for(let r=e,i=t.length;r<i;r++){if(t.startsWith(a,r))return!0;if(t.startsWith(l,r))return!1}return!1}function C(t){return t&&"object"==typeof t&&!Array.isArray(t)}const E=["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"],k=new Set(["a","abbr","acronym","audio","b","bdi","bdo","big","br","button","canvas","cite","code","data","datalist","del","dfn","em","embed","i","iframe","img","input","ins","kbd","label","map","mark","meter","noscript","object","output","picture","progress","q","ruby","s","samp","script","select","slot","small","span","strong","sub","sup","svg","template","textarea","time","u","tt","var","video","wbr"]),N=["{","}",","],x="'\"“”",L=/[\w-]/;function O(t){if(t&&t.length)for(let e=t.length;e--;)if("esp"===t[e].type)return e}function w(t,e,a){let l=t[e];const r=t.length,i=a[O(a)];for(let n=e+1;n<r&&(!h.includes(t[n])||!m.includes(t[n-1]))&&!(l.length>1&&(l.includes("<")||l.includes("{")||l.includes("[")||l.includes("("))&&"("===t[n])&&(g.includes(t[n])||i&&i.guessedClosingLump.includes(t[n])||"<"===t[e]&&"/"===t[n]||">"===t[n]&&"--"===l&&Array.isArray(a)&&a.length&&"esp"===a[a.length-1].type&&"<"===a[a.length-1].openingLump[0]&&"-"===a[a.length-1].openingLump[2]&&"-"===a[a.length-1].openingLump[3]||!i&&n>e&&"!=@".includes(t[n]));n++)l+=t[n];if(l&&Array.isArray(a)&&a.length&&"esp"===a[a.length-1].type&&a[a.length-1].guessedClosingLump&&l.length>a[a.length-1].guessedClosingLump.length){if(l.endsWith(a[a.length-1].openingLump))return l.slice(0,l.length-a[a.length-1].openingLump.length);let t=new Set(a[a.length-1].guessedClosingLump),e=0;for(let a=0,r=l.length;a<r;a++){if(!t.has(l[a])&&e>1)return l.slice(0,a);t.has(l[a])&&(e+=1,t=new Set([...t].filter((t=>t!==l[a]))))}}return l}function M(a,l,r,i){return!(("<"!==a[l]||!t(a,l,["!--"],{maxMismatches:1,firstMustMatch:!0,trimBeforeMatching:!0})&&!t(a,l,["![endif]"],{i:!0,maxMismatches:2,trimBeforeMatching:!0})||t(a,l,["![cdata","<"],{i:!0,maxMismatches:1,trimBeforeMatching:!0})||"comment"===r.type&&"not"===r.kind)&&("-"!==a[l]||!t(a,l,["->"],{trimBeforeMatching:!0})||"comment"===r.type&&(r.closing||"not"===r.kind)||e(a,l,"<",{trimBeforeMatching:!0,trimCharsBeforeMatching:["-","!"]})||Array.isArray(i)&&i.length&&"esp"===i[i.length-1].type&&"<"===i[i.length-1].openingLump[0]&&"-"===i[i.length-1].openingLump[2]&&"-"===i[i.length-1].openingLump[3]))}function Q(t,e,a,l,r){return r&&("/"===t[e]&&"*"===t[e+1]||"*"===t[e]&&"/"===t[e+1])}function $(t,e,a=!1){if(!e.length)return;const l=a?e[0]:e[e.length-1];return"esp"===l.type&&(t.includes(l.guessedClosingLump)||Array.from(t).every((t=>l.guessedClosingLump.includes(t)))||l.guessedClosingLump&&l.guessedClosingLump.length>2&&l.guessedClosingLump[l.guessedClosingLump.length-1]===t[t.length-1]&&l.guessedClosingLump[l.guessedClosingLump.length-2]===t[t.length-2])?t.length:void 0}const F="\\";function q(e,a,l,r,s){return!(!e[a]||!e[a].trim().length||r.length&&"text"!==l.type||l.kind&&["doctype","xml"].includes(l.kind)||s&&"<"!==e[a]||!("<"===e[a]&&(p(e,a,{allowCustomTagNames:!0})||">"===e[i(e,a)]||t(e,a,["doctype","xml","cdata"],{i:!0,trimBeforeMatching:!0,trimCharsBeforeMatching:["?","!","["," ","-"]}))||A(e[a])&&(!e[a-1]||!A(e[a-1])&&!["<","/","!",F].includes(e[n(e,a)]))&&p(e,a,{allowCustomTagNames:!1,skipOpeningBracket:!0}))||!("esp"!==l.type||l.tail&&l.tail.includes(e[a])))}function B(t,e,a,l,r){return!!(g.includes(t[e])&&t[e+1]&&g.includes(t[e+1])&&!(b.includes(t[e])&&b.includes(t[e+1]))&&(t[e]!==t[e+1]||c.includes(t[e]))&&"rule"!==a.type&&"at"!==a.type&&!("-"===t[e]&&"-{(".includes(t[e+1]))&&!("})".includes(t[e])&&"-".includes(t[e+1]))&&!("%"===t[e]&&"%"===t[e+1]&&"0123456789".includes(t[e-1])&&(!t[e+2]||f.includes(t[e+2])||!t[e+2].trim().length))&&!(r&&("{}".includes(t[e])||"{}".includes(t[i(t,e)])))||"<"===t[e]&&("/"===t[e+1]&&g.includes(t[e+2])||g.includes(t[e+1])&&!["-"].includes(t[e+1]))||"<"===t[e]&&("%"===t[e+1]||t.startsWith("jsp:",e+1)||t.startsWith("cms:",e+1)||t.startsWith("c:",e+1))||t.startsWith("${jspProp",e)||">})".includes(t[e])&&Array.isArray(l)&&l.length&&"esp"===l[l.length-1].type&&l[l.length-1].openingLump.includes(V(t[e]))&&(">"!==t[e]||!S(t,e+1,">","<"))||"-"===t[e]&&"-"===t[e+1]&&">"===t[e+2]&&Array.isArray(l)&&l.length&&"esp"===l[l.length-1].type&&"<"===l[l.length-1].openingLump[0]&&"-"===l[l.length-1].openingLump[2]&&"-"===l[l.length-1].openingLump[3])}const W="5.1.2",P={tagCb:null,tagCbLookahead:0,charCb:null,charCbLookahead:0,reportProgressFunc:null,reportProgressFuncFrom:0,reportProgressFuncTo:100};function T(p,d){const b=Date.now();if("string"!=typeof p)throw void 0===p?new Error("codsen-tokenizer: [THROW_ID_01] the first input argument is completely missing! It should be given as string."):new Error(`codsen-tokenizer: [THROW_ID_02] the first input argument must be string! It was given as "${typeof p}", equal to:\n${JSON.stringify(p,null,4)}`);if(d&&!C(d))throw new Error(`codsen-tokenizer: [THROW_ID_03] the second input argument, an options object, should be a plain object but it was given as type ${typeof d}, equal to ${JSON.stringify(d,null,4)}`);if(d&&C(d)&&d.tagCb&&"function"!=typeof d.tagCb)throw new Error(`codsen-tokenizer: [THROW_ID_04] the opts.tagCb, callback function, should be a function but it was given as type ${typeof d.tagCb}, equal to ${JSON.stringify(d.tagCb,null,4)}`);if(d&&C(d)&&d.charCb&&"function"!=typeof d.charCb)throw new Error(`codsen-tokenizer: [THROW_ID_05] the opts.charCb, callback function, should be a function but it was given as type ${typeof d.charCb}, equal to ${JSON.stringify(d.charCb,null,4)}`);if(d&&C(d)&&d.reportProgressFunc&&"function"!=typeof d.reportProgressFunc)throw new Error(`codsen-tokenizer: [THROW_ID_06] the opts.reportProgressFunc, callback function, should be a function but it was given as type ${typeof d.reportProgressFunc}, equal to ${JSON.stringify(d.reportProgressFunc,null,4)}`);const h={...P,...d};let m=0,f=0;const F=p.length,W=Math.floor(F/2);let T=0,R=!1,_=!1;const H=[],D=[];let I={};function j(){I={type:null,start:null,end:null,value:null},U()}const z={attribName:"",attribNameRecognised:!1,attribNameStartsAt:null,attribNameEndsAt:null,attribOpeningQuoteAt:null,attribClosingQuoteAt:null,attribValueRaw:null,attribValue:[],attribValueStartsAt:null,attribValueEndsAt:null,attribStarts:null,attribEnds:null,attribLeft:null};let J={...z};function U(){J=r(z)}function G(t){J.attribValue.length&&J.attribValue[~-J.attribValue.length].start&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=t.start,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,t.start)),J.attribValue.push(t)}const K={start:null,end:null,value:null,property:null,propertyStarts:null,propertyEnds:null,colon:null,valueStarts:null,valueEnds:null,semi:null};let X,Y,Z,tt={...K};function et(){tt={...K}}function at(t){J&&"style"===J.attribName?J.attribValue.push({...t}):I&&Array.isArray(I.properties)&&I.properties.push({...t})}j();let lt=null;const rt=[];function it(t){return!(!Array.isArray(rt)||!rt.length||rt[~-rt.length].type!==t)}function nt(t){const e=(i(p,t)||t)+1;G({type:"comment",start:t,end:e,value:p.slice(t,e),closing:!0,kind:"block",language:"css"}),T=e,it("block")&&rt.pop()}function st(t,e,a){const l=t.shift(),i=[];for(let e=0;e<a&&t[e];e++)i.push(r(t[e]));"function"==typeof e&&e(l,i)}function ut(t){h.tagCb&&(H.push(t),H.length>h.tagCbLookahead&&st(H,h.tagCb,h.tagCbLookahead))}function ot(t,e){if(!["text","esp"].includes(t.type)&&null!==t.start&&t.start<e&&(p[~-e]&&!p[~-e].trim()||"<"===p[e]))if(t.end=null!==n(p,e)?n(p,e)+1:e,t.value=p.slice(t.start,t.end),"tag"!==t.type||"/>".includes(p[~-t.end]))ut(t),j(),p[~-e]&&!p[~-e].trim()&&dt("text",n(p,e)+1);else{let a=t.tagNameEndsAt||e;if(Array.isArray(t.attribs)&&t.attribs.length)for(let e=0,l=t.attribs.length;e<l;e++){if(!t.attribs[e].attribNameRecognised||!t.attribs[e].attribEnds){t.attribs=0===e?[]:t.attribs.splice(0,e);break}a=t.attribs[e].attribEnds,p[a+1]&&!p[a].trim()&&p[a+1].trim()&&(a+=1)}t.end=a,t.value=p.slice(t.start,t.end),t.tagNameEndsAt||(t.tagNameEndsAt=a),t.tagNameStartsAt&&t.tagNameEndsAt&&!t.tagName&&(t.tagName=p.slice(t.tagNameStartsAt,a),t.recognised=v(t.tagName)),ut(t),dt("text",a)}null!==I.start&&(null===I.end&&I.start!==e&&(I.end=e,I.value=p.slice(I.start,I.end)),null!==I.start&&I.end&&(it("at")?rt[~-rt.length].token.rules.push(I):ut(I)),j())}function pt(t,e=null){return"tag"===t?{type:t,start:e,end:null,value:null,tagNameStartsAt:null,tagNameEndsAt:null,tagName:null,recognised:null,closing:!1,void:!1,pureHTML:!0,kind:null,attribs:[]}:"comment"===t?{type:t,start:e,end:null,value:null,closing:!1,kind:"simple",language:"html"}:"rule"===t?{type:t,start:e,end:null,value:null,left:null,nested:!1,openingCurlyAt:null,closingCurlyAt:null,selectorsStart:null,selectorsEnd:null,selectors:[],properties:[]}:"at"===t?{type:t,start:e,end:null,value:null,left:null,nested:!1,openingCurlyAt:null,closingCurlyAt:null,identifier:null,identifierStartsAt:null,identifierEndsAt:null,query:null,queryStartsAt:null,queryEndsAt:null,rules:[]}:"esp"===t?{type:t,start:e,end:null,value:null,head:null,headStartsAt:null,headEndsAt:null,tail:null,tailStartsAt:null,tailEndsAt:null}:{type:"text",start:e,end:null,value:null}}function dt(t,e){U(),I=pt(t,e)}function gt(t){et(),tt.propertyStarts=t,tt.start=t}function ct(t){return!"'\"".includes(p[t])||!(J.attribOpeningQuoteAt||J.attribValueStartsAt)||s(p,J.attribOpeningQuoteAt||J.attribValueStartsAt,t)}for(let d=0;d<=F;d++){!T&&p[d]&&h.reportProgressFunc&&(F>1e3&&F<2e3?d===W&&h.reportProgressFunc(Math.floor((h.reportProgressFuncTo-h.reportProgressFuncFrom)/2)):F>=2e3&&(m=h.reportProgressFuncFrom+Math.floor(d/F*(h.reportProgressFuncTo-h.reportProgressFuncFrom)),m!==f&&(f=m,h.reportProgressFunc(m))));const b=n(p,d),P=i(p,d);if(R&&I.type&&!["rule","at","text","comment"].includes(I.type)&&(R=!1),T&&d>=T&&(T=0),A(p[d])&&A(p[~-d])&&A(p[d+1]))continue;if(" \t\r\n".includes(p[d])&&p[d]===p[~-d]&&p[d]===p[d+1])continue;if(!T&&it("at")&&C(rt[~-rt.length].token)&&rt[~-rt.length].token.openingCurlyAt&&!rt[~-rt.length].token.closingCurlyAt)if("}"===p[d]){if(!I.type||"text"===I.type||"rule"===I.type&&null===I.openingCurlyAt){"rule"===I.type&&(I.end=b+1,I.value=p.slice(I.start,I.end),ut(I),it("at")&&rt[~-rt.length].token.rules.push(I),j(),null!==b&&b<~-d&&dt("text",b+1)),ot(I,d);const t=rt.pop();I=t.token,I.closingCurlyAt=d,I.end=d+1,I.value=p.slice(I.start,I.end),ut(I),it("at")&&rt[~-rt.length].token.rules.push(I),j(),T=d+1}}else"text"===I.type&&p[d]&&p[d].trim()&&(I.end=d,I.value=p.slice(I.start,I.end),it("at")?rt[~-rt.length].token.rules.push(I):ut(I),j());I.end&&I.end===d&&("style"!==I.tagName||I.closing||(R=!0),Z?(J=Z,J.attribValue.push(I),I=r(Y),Z=void 0,Y=void 0):(ot(I,d),rt.length=0)),T||(["tag","rule","at"].includes(I.type)&&"cdata"!==I.kind?!p[d]||!x.includes(p[d])&&!"()".includes(p[d])||x.includes(p[b])&&p[b]===p[P]||!ct(d)||(it("simple")&&rt[~-rt.length].value===V(p[d])?rt.pop():rt.push({type:"simple",value:p[d],position:d})):"comment"===I.type&&["only","not"].includes(I.kind)?["[","]"].includes(p[d])&&(it("simple")&&rt[~-rt.length].value===V(p[d])?rt.pop():rt.push({type:"simple",value:p[d],position:d})):"esp"!==I.type||!"'\"`()".includes(p[d])||['"',"'","`"].includes(p[b])&&p[b]===p[P]||(it("simple")&&rt[~-rt.length].value===V(p[d])?(rt.pop(),T=d+1):"]})>".includes(p[d])||rt.push({type:"simple",value:p[d],position:d}))),!T&&"at"===I.type&&null!=I.start&&d>=I.start&&!I.identifierStartsAt&&p[d]&&p[d].trim()&&"@"!==p[d]&&(I.identifierStartsAt=d),!T&&"at"===I.type&&I.queryStartsAt&&!I.queryEndsAt&&"{;".includes(p[d])&&(I.queryEndsAt="{"===p[d]?p[~-d]&&p[~-d].trim()?d:null!==b?b+1:d:n(p,d+1)||0,I.queryStartsAt&&I.queryEndsAt&&(I.query=p.slice(I.queryStartsAt,I.queryEndsAt)),I.end=";"===p[d]?d+1:d,I.value=p.slice(I.start,I.end),";"===p[d]?ut(I):(I.openingCurlyAt=d,rt.push({type:"at",token:I})),j(),T=d+1),!T&&"at"===I.type&&I.identifier&&p[d]&&p[d].trim()&&!I.queryStartsAt&&(I.queryStartsAt=d),!T&&I&&"at"===I.type&&I.identifierStartsAt&&d>=I.start&&p[d]&&(!p[d].trim()||"()".includes(p[d]))&&!I.identifierEndsAt&&(I.identifierEndsAt=d,I.identifier=p.slice(I.identifierStartsAt,d)),"rule"===I.type&&X&&(N.includes(p[d])||p[d]&&!p[d].trim()&&N.includes(p[P]))&&(I.selectors.push({value:p.slice(X,d),selectorStarts:X,selectorEnds:d}),X=void 0,I.selectorsEnd=d);const H=O(rt);if(!T&&p[d])if(q(p,d,I,rt,R)){I.type&&null!==I.start&&("rule"===I.type&&tt&&tt.propertyStarts&&(tt.propertyEnds=d,tt.property=p.slice(tt.propertyStarts,d),tt.end||(tt.end=d),at(tt),et()),ot(I,d),j()),dt("tag",d),R&&(R=!1);const t="?![-/";let e="",a=!1;if(P)for(let l=P;l<F&&(!a&&p[l]&&p[l].trim()&&p[l].toUpperCase()!==p[l].toLowerCase()&&(a=!0),!a||!p[l]||p[l].trim()&&(/\w/.test(p[l])||t.includes(p[l]))&&"["!==p[l]);l++)t.includes(p[l])||(e+=p[l].trim().toLowerCase());"doctype"===e?I.kind="doctype":"cdata"===e?I.kind="cdata":"xml"===e?I.kind="xml":k.has(e)&&(I.kind="inline")}else if(M(p,d,I,rt))null!=I.start&&ot(I,d),dt("comment",d),"-"===p[d]?I.closing=!0:a(p,d,["<![endif]--\x3e"],{i:!0,trimBeforeMatching:!0,maxMismatches:2})&&(I.closing=!0,I.kind="only"),R&&(R=!1);else if(Q(p,d,0,0,R))null!=I.start&&ot(I,d),dt("comment",d),I.language="css",I.kind="/"===p[d]&&"/"===p[d+1]?"line":"block",I.value=p.slice(d,d+2),I.end=d+2,I.closing="*"===p[d]&&"/"===p[d+1],_=!0,I.closing&&(_=!1),T=d+2;else if("number"==typeof H&&rt[H]&&"esp"===rt[H].type&&rt[H].openingLump&&rt[H].guessedClosingLump&&rt[H].guessedClosingLump.length>1&&rt[H].guessedClosingLump.includes(p[d])&&rt[H].guessedClosingLump.includes(p[d+1])&&!(rt[H+1]&&"'\"".includes(rt[H+1].value)&&p.indexOf(rt[H+1].value,d)>0&&rt[H].guessedClosingLump.includes(p[i(p,p.indexOf(rt[H+1].value,d))]))||B(p,d,I,rt,R)&&(!it("simple")||!["'",'"'].includes(rt[~-rt.length].value)||J&&J.attribStarts&&!J.attribEnds)){const t=w(p,d,rt);if(!y.includes(t)){let e,a;if(rt.length&&(e=$(t,rt))){if("esp"===I.type){if(I.end||(I.end=d+e,I.value=p.slice(I.start,I.end),I.tail=p.slice(d,d+e),I.tailStartsAt=d,I.tailEndsAt=I.end,">"===p[d]&&"/"===p[b]&&(I.tailStartsAt=b,I.tail=p.slice(I.tailStartsAt,d+1))),T=I.tailEndsAt,Y){Array.isArray(Y.attribs)||(Y.attribs=[]),Z?(J=Z,J.attribValue.push({...I})):Y.attribs.push({...I}),I=r(Y),Y=void 0,Z=void 0,rt.pop();continue}ot(I,d),j()}rt.pop()}else if(rt.length&&(e=$(t,rt,!0)))"esp"===I.type&&(I.end||(I.end=d+(e||0),I.value=p.slice(I.start,I.end)),I.tailStartsAt||(I.tailStartsAt=d),!I.tailEndsAt&&e&&(I.tailEndsAt=I.tailStartsAt+e,I.tail=p.slice(d,d+e)),ot(I,d),j()),rt.length=0;else if(J&&J.attribValue&&J.attribValue.length&&J.attribValue[~-J.attribValue.length].start&&Array.from(p.slice(J.attribValue[~-J.attribValue.length].start,d)).some(((e,l)=>t.includes(V(e))&&(c.includes(e)||!l)&&(a={char:e,idx:l})))&&"tag"===I.type&&J&&J.attribValueStartsAt&&!J.attribValueEndsAt&&J.attribValue[~-J.attribValue.length]&&"text"===J.attribValue[~-J.attribValue.length].type){I.pureHTML=!1;const e=J.attribValue[~-J.attribValue.length],l=pt("esp",e.start);a&&a.idx||(l.head=a.char,l.headStartsAt=e.start,l.headEndsAt=l.headStartsAt+1,l.tailStartsAt=d,l.tailEndsAt=d+t.length,l.tail=t,J.attribValue[~-J.attribValue.length]=l)}else it("esp")&&rt.pop(),Z&&(Array.isArray(Z.attribValue)||(Z.attribValue=[]),Z.attribValue.push(I)),rt.push({type:"esp",openingLump:t,guessedClosingLump:V(t),position:d}),null!==I.start&&("tag"===I.type?(!I.tagNameStartsAt||I.tagName&&I.tagNameEndsAt||(I.tagNameEndsAt=d,I.tagName=p.slice(I.tagNameStartsAt,d),I.recognised=v(I.tagName)),Y=r(I),J.attribStarts&&!J.attribEnds&&(Z=r(J))):Z?Z&&Array.isArray(Z.attribValue)&&Z.attribValue.length&&"esp"===Z.attribValue[~-Z.attribValue.length].type&&!Z.attribValue[~-Z.attribValue.length].end&&(Z.attribValue[~-Z.attribValue.length].end=d,Z.attribValue[~-Z.attribValue.length].value=p.slice(Z.attribValue[~-Z.attribValue.length].start,d)):ot(I,d)),dt("esp",d),I.head=t,I.headStartsAt=d,I.headEndsAt=d+t.length,Y&&Y.pureHTML&&(Y.pureHTML=!1),Z&&Array.isArray(Z.attribValue)&&Z.attribValue.length&&(Z.attribValue[~-Z.attribValue.length].start===I.start?Z.attribValue.pop():"text"!==Z.attribValue[~-Z.attribValue.length].type||Z.attribValue[~-Z.attribValue.length].end||(Z.attribValue[~-Z.attribValue.length].end=d,Z.attribValue[~-Z.attribValue.length].value=p.slice(Z.attribValue[~-Z.attribValue.length].start,d)));T=d+(e||t.length)}}else!R||_||!p[d]||!p[d].trim()||"{}".includes(p[d])||I.type&&!["text"].includes(I.type)?I.type||dt("text",d):(I.type&&ot(I,d),dt("@"===p[d]?"at":"rule",d),I.left=lt,I.nested=rt.some((t=>"at"===t.type)));if(!T&&tt&&tt.valueStarts&&!tt.valueEnds)if(!p[d]||p[d]&&!p[d].trim()||";}".includes(p[d])&&(!J||!J.attribName||"style"!==J.attribName)||";'\"".includes(p[d])&&J&&"style"===J.attribName&&ct(d))lt&&(tt.valueEnds=lt+1,tt.value=p.slice(tt.valueStarts,lt+1)),";"===p[d]?tt.semi=d:p[d]&&!p[d].trim()&&";"===p[P]&&(tt.semi=P),tt.semi&&(tt.end=tt.semi+1),tt.semi||";"===p[P]||tt.end||(tt.end=d),tt.end&&(tt.end>d&&(T=tt.end),at(tt),et());else if(":"===p[d]&&tt&&tt.colon&&tt.colon<d&&lt&&tt.colon+1<lt){let t=[];i(p,tt.colon)&&(t=p.slice(i(p,tt.colon),lt+1).split(/\s+/)),2===t.length&&(tt.valueEnds=tt.valueStarts+t[0].length,tt.value=p.slice(tt.valueStarts,tt.valueEnds),tt.end=tt.valueEnds,at(tt),et(),tt.propertyStarts=lt+1-t[1].length)}else"/"===p[d]&&"*"===p[P]&&(tt.valueStarts&&!tt.valueEnds&&(tt.valueEnds=d,tt.value=p.slice(tt.valueStarts,d)),tt.end||(tt.end=d),at(tt),et());if(!T&&tt&&tt.colon&&!tt.valueStarts&&p[d]&&p[d].trim()&&(";}'\"".includes(p[d])&&ct(d)?(";"===p[d]&&(tt.semi=d),tt.end||(tt.end=tt.semi?tt.semi+1:d),at(tt),et()):tt.valueStarts=d),T||"rule"!==I.type||!p[d]||!p[d].trim()||"{}".includes(p[d])||X||I.openingCurlyAt||(",".includes(p[d])?I.selectorsEnd=d+1:(X=d,null===I.selectorsStart&&(I.selectorsStart=d))),!(!T&&tt&&tt.propertyStarts&&tt.propertyStarts<d)||tt.propertyEnds||p[d]&&p[d].trim()&&(L.test(p[d])||":"!==p[d]&&P&&":/".includes(p[P]))||"/"===p[d]&&"/"===p[d-1]||(tt.propertyEnds=d,tt.property=p.slice(tt.propertyStarts,d),tt.valueStarts&&(tt.end=d),("};".includes(p[d])||p[d]&&!p[d].trim()&&":"!==p[P])&&(";"===p[d]&&(tt.semi=d),tt.end||(tt.end=tt.semi?tt.semi+1:d),at(tt),et())),!T&&tt&&tt.propertyEnds&&!tt.valueStarts&&":"===p[d]&&(tt.colon=d),!T&&"rule"===I.type&&p[d]&&p[d].trim()&&!"{};".includes(p[d])&&I.selectorsEnd&&I.openingCurlyAt&&!tt.propertyStarts&&(Array.isArray(I.properties)&&I.properties.length&&I.properties[~-I.properties.length].start&&!I.properties[~-I.properties.length].end&&(I.properties[~-I.properties.length].end=d,I.properties[~-I.properties.length].value=p.slice(I.properties[~-I.properties.length].start,d)),gt(d)),T||!J||"style"!==J.attribName||!J.attribOpeningQuoteAt||J.attribClosingQuoteAt||tt.propertyStarts||!p[d]||!p[d].trim()||"'\";".includes(p[d])||it("block")||("/"===p[d]&&"*"===p[P]?(G({type:"comment",start:d,end:P+1,value:p.slice(d,P+1),closing:!1,kind:"block",language:"css"}),rt.push({type:"block",value:p.slice(d,P+1),position:d}),T=P+1):"*"===p[d]&&"/"===p[P]?nt(d):(Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=d,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,d)),gt(d))),"comment"===I.type&&["only","not"].includes(I.kind),!T)if("tag"!==I.type||rt.length||">"!==p[d])if("comment"===I.type&&"html"===I.language&&!rt.length&&"simple"===I.kind&&("<"===p[I.start]&&"-"===p[d]&&(e(p,d,"!-",{trimBeforeMatching:!0})||l(p,d,"!-",{trimBeforeMatching:!0})&&"-"!==p[d+1])||"-"===p[I.start]&&">"===p[d]&&e(p,d,"--",{trimBeforeMatching:!0,maxMismatches:1})))"-"===p[d]&&(t(p,d,["[if","(if","{if"],{i:!0,trimBeforeMatching:!0})||t(p,d,["if"],{i:!0,trimBeforeMatching:!0})&&(S(p,d,"]",">")||p.includes("mso",d)&&!p.slice(d,p.indexOf("mso")).includes("<")&&!p.slice(d,p.indexOf("mso")).includes(">")))?I.kind="only":"-"!==p[I.start]&&a(p,d,["-<![endif"],{i:!0,trimBeforeMatching:!0,maxMismatches:2})?(I.kind="not",I.closing=!0):"simple"!==I.kind||"html"!==I.language||I.closing||">"!==p[P]?"html"===I.language&&(I.end=d+1,"!"===p[b]&&"-"===p[P]&&(I.end=P+1),I.value=p.slice(I.start,I.end)):(I.end=P+1,I.kind="simplet",I.closing=null);else if("comment"!==I.type||"html"!==I.language||">"!==p[d]||rt.length&&"<"!==p[P]){if("comment"===I.type&&"css"===I.language&&"*"===p[d]&&"/"===p[d+1])I.end=d+1,I.value=p.slice(I.start,I.end);else if("esp"===I.type&&null===I.end&&"string"==typeof I.head&&"string"==typeof I.tail&&I.tail.includes(p[d])){let t="";for(let e=d;e<F&&g.includes(p[e]);e++)t+=p[e];if(t.length>I.head.length){const e=I.head[0];if(t.endsWith(I.head))I.end=d+t.length-I.head.length,I.value=p.slice(I.start,I.end),T=I.end;else if(t.startsWith(I.tail))I.end=d+I.tail.length,I.value=p.slice(I.start,I.end),T=I.end;else if(!I.tail.includes(e)&&t.includes(e)||t.endsWith(I.head)||t.startsWith(I.tail)){const a=t.slice(0,t.indexOf(e)),l=t.slice(t.indexOf(e));a.length&&l.length&&I.tail.split("").every((t=>a.includes(t)))&&(I.end=d+a.length,I.value=p.slice(I.start,I.end),T=I.end)}else I.end=d+t.length,I.value=p.slice(I.start,I.end),T=I.end}else I.end=d+t.length,I.value=p.slice(I.start,I.end),it("esp")&&rt.pop(),T=I.end}}else Array.isArray(rt)&&rt.length&&"["===rt[~-rt.length].value&&rt.pop(),!["simplet","not"].includes(I.kind)&&t(p,d,["\x3c!--\x3e","\x3c!----\x3e"],{trimBeforeMatching:!0,maxMismatches:1,lastMustMatch:!0})?I.kind="not":(I.end=d+1,I.value=p.slice(I.start,I.end));else I.end=d+1,I.value=p.slice(I.start,I.end);if(T||"tag"!==I.type||!I.tagNameStartsAt||I.tagNameEndsAt||p[d]&&/[.\-_a-z0-9\u00B7\u00C0-\uFFFD]/i.test(p[d])||(I.tagNameEndsAt=d,I.tagName=p.slice(I.tagNameStartsAt,d).toLowerCase(),"xml"===I.tagName&&I.closing&&!I.kind&&(I.kind="xml"),E.includes(I.tagName)&&(I.void=!0),I.recognised=v(I.tagName)),T||"tag"!==I.type||I.tagNameStartsAt||null==I.start||!(I.start<d||"<"!==p[I.start])||("/"===p[d]?I.closing=!0:A(p[d])&&(I.tagNameStartsAt=d,I.closing||(I.closing=!1))),!T&&"tag"===I.type&&"cdata"!==I.kind&&J.attribNameStartsAt&&d>J.attribNameStartsAt&&null===J.attribNameEndsAt&&!o(p[d])&&(J.attribNameEndsAt=d,J.attribName=p.slice(J.attribNameStartsAt,d),J.attribNameRecognised=u.has(J.attribName),J.attribName.startsWith("mc:")&&(I.pureHTML=!1),p[d]&&!p[d].trim()&&"="===p[P]||(p[d]&&!p[d].trim()||">"===p[d]||"/"===p[d]&&">"===p[P])&&("'\"".includes(p[P])||(J.attribEnds=d,I.attribs.push(r(J)),U()))),!T&&p[d]&&"tag"===I.type&&"cdata"!==I.kind&&I.tagNameEndsAt&&d>I.tagNameEndsAt&&null===J.attribStarts&&o(p[d])&&(J.attribStarts=d,J.attribLeft=lt,J.attribNameStartsAt=d),T||"rule"!==I.type||("{"!==p[d]||I.openingCurlyAt?"}"===p[d]&&I.openingCurlyAt&&!I.closingCurlyAt&&(I.closingCurlyAt=d,I.end=d+1,I.value=p.slice(I.start,I.end),Array.isArray(I.properties)&&I.properties.length&&I.properties[~-I.properties.length].start&&!I.properties[~-I.properties.length].end&&(I.properties[~-I.properties.length].end=d,I.properties[~-I.properties.length].value=p.slice(I.properties[~-I.properties.length].start,d)),ut(I),it("at")&&rt[~-rt.length].token.rules.push(I),j()):I.openingCurlyAt=d),!T&&J.attribName&&Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&"*"===p[d]&&"/"===p[P]&&nt(d),(!T&&J&&J.attribValueStartsAt&&!J.attribValueEndsAt&&!tt.propertyStarts&&d>=J.attribValueStartsAt&&Array.isArray(J.attribValue)&&(!J.attribValue.length||J.attribValue[~-J.attribValue.length].end&&J.attribValue[~-J.attribValue.length].end<=d)||!T&&"rule"===I.type&&I.openingCurlyAt&&!I.closingCurlyAt&&!tt.propertyStarts)&&(p[d]&&!p[d].trim()||it("block"))&&(J.attribName?J.attribValue.push({type:"text",start:d,end:null,value:null}):"rule"!==I.type||Array.isArray(I.properties)&&I.properties.length&&!I.properties[~-I.properties.length].end||I.properties.push({type:"text",start:d,end:null,value:null})),!T&&"tag"===I.type&&J.attribValueStartsAt&&d>=J.attribValueStartsAt&&null===J.attribValueEndsAt)if(x.includes(p[d]))rt.some((t=>"esp"===t.type))||p[d]&&p.includes(">",d)&&!s(p,J.attribOpeningQuoteAt||J.attribValueStartsAt,d)?Array.isArray(J.attribValue)&&J.attribValue.length&&"text"===J.attribValue[~-J.attribValue.length].type||tt.propertyStarts||J.attribValue.push({type:"text",start:d,end:null,value:null}):(J.attribClosingQuoteAt=d,J.attribValueEndsAt=d,J.attribValueStartsAt&&(J.attribValueRaw=p.slice(J.attribValueStartsAt,d)),J.attribEnds=d+1,tt.propertyStarts&&(J.attribValue.push(r(tt)),et()),Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].property||(J.attribValue[~-J.attribValue.length].end=d,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,d))),p[J.attribOpeningQuoteAt]!==p[d]&&(rt.pop(),rt.pop()),J.attribValue[~-J.attribValue.length]&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=d),I.attribs.push(r(J)),U());else if(null===J.attribOpeningQuoteAt&&(p[d]&&!p[d].trim()||["/",">"].includes(p[d])||g.includes(p[d])&&g.includes(p[d+1])))J.attribValueEndsAt=d,J.attribValueRaw=p.slice(J.attribValueStartsAt,d),Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=d,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,J.attribValue[~-J.attribValue.length].end)),J.attribEnds=d,I.attribs.push(r(J)),U(),rt.pop(),">"===p[d]&&(I.end=d+1,I.value=p.slice(I.start,I.end));else if("="!==p[d]||null===b||!P||!("'\"".includes(p[P])||p[~-d]&&A(p[~-d]))||J&&J.attribOpeningQuoteAt&&(/\//.test(p.slice(J.attribOpeningQuoteAt+1,d))||/mailto:/.test(p.slice(J.attribOpeningQuoteAt+1,d))||/\w\?\w/.test(p.slice(J.attribOpeningQuoteAt+1,d))))!J||"style"===J.attribName||!J.attribStarts||J.attribEnds||tt.propertyStarts||Array.isArray(J.attribValue)&&J.attribValue.length&&!(J.attribValue[~-J.attribValue.length].end&&J.attribValue[~-J.attribValue.length].end<=d)||J.attribValue.push({type:"text",start:d,end:null,value:null});else{let t,e;for(let a=b;a>=J.attribValueStartsAt;a--)t||!p[a]||p[a].trim()||(t=!0,e&&p.slice(a,e)),t&&p[a]&&p[a].trim()&&(t=!1,e||(e=a+1));if(e){J.attribValueEndsAt=e,J.attribValueStartsAt&&(J.attribValueRaw=p.slice(J.attribValueStartsAt,e),Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=J.attribValueEndsAt,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,J.attribValueEndsAt))),J.attribEnds=e,p[J.attribOpeningQuoteAt]!==p[d]&&rt.pop(),I.attribs.push(r(J)),U(),d=~-e;continue}if(J.attribOpeningQuoteAt&&("'\"".includes(p[P])||u.has(p.slice(J.attribOpeningQuoteAt+1,d).trim()))){d=J.attribOpeningQuoteAt,J.attribEnds=J.attribOpeningQuoteAt+1,J.attribValueStartsAt=null,rt.pop(),I.attribs.push(r(J)),U();continue}}else"esp"===I.type&&Z&&Y&&Z.attribOpeningQuoteAt&&Z.attribValueStartsAt&&"'\"".includes(p[d])&&p[Z.attribOpeningQuoteAt]===p[d]&&s(p,Z.attribOpeningQuoteAt,d)&&(I.end=d,I.value=p.slice(I.start,d),Z&&!Array.isArray(Z.attribValue)&&(Z.attribValue=[]),Z.attribValue.push(I),Z.attribValueEndsAt=d,Z.attribValueRaw=p.slice(Z.attribValueStartsAt,d),Z.attribClosingQuoteAt=d,Z.attribEnds=d+1,I=r(Y),I.attribs.push(Z),Z=void 0,Y=void 0,rt.pop(),rt.pop(),rt.pop());if(!T&&"tag"===I.type&&!J.attribValueStartsAt&&J.attribNameEndsAt&&J.attribNameEndsAt<=d&&p[d]&&p[d].trim())if("="!==p[d]||x.includes(p[P])||"=".includes(p[P])||g.includes(p[P])){if(x.includes(p[d])){const t=P;!(t&&x.includes(p[t])&&p[d]!==p[t]&&p.length>t+2&&p.slice(t+1).includes(p[t]))||p.indexOf(p[t],t+1)&&i(p,p.indexOf(p[t],t+1))&&p[d]===p[i(p,p.indexOf(p[t],t+1))]||Array.from(p.slice(t+1,p.indexOf(p[t]))).some((t=>`<>=${p[d]}`.includes(t)))?J.attribOpeningQuoteAt?(s(p,J.attribOpeningQuoteAt,d)&&(J.attribClosingQuoteAt=d),J.attribOpeningQuoteAt&&J.attribClosingQuoteAt&&(J.attribValueRaw=J.attribOpeningQuoteAt<~-J.attribClosingQuoteAt?p.slice(J.attribOpeningQuoteAt+1,J.attribClosingQuoteAt):"",J.attribEnds=d+1,I.attribs.push(r(J)),U())):(J.attribOpeningQuoteAt=d,!p[d+1]||p[d+1]===p[d]&&ct(d+1)||(J.attribValueStartsAt=d+1)):rt.pop()}}else{const t=x.split("").map((t=>p.indexOf(t,P))).filter((t=>t>0)).length?Math.min(...x.split("").map((t=>p.indexOf(t,P))).filter((t=>t>0))):void 0;P&&p.slice(P).includes("=")&&u.has(p.slice(P,P+p.slice(P).indexOf("=")).trim().toLowerCase())?(J.attribEnds=d+1,I.attribs.push({...J}),U()):t&&!p.slice(P,t).includes("=")&&p.includes(p[t],t+1)&&!Array.from(p.slice(t+1,p.indexOf(p[t],t+1))).some((t=>"<>=".includes(t)))||(J.attribValueStartsAt=P,rt.push({type:"simple",value:null,position:J.attribValueStartsAt}))}if(!T&&">"===p[d]&&"%"!==p[d-1]&&"tag"===I.type&&J.attribStarts&&!J.attribEnds){let t=!1;if(p[d+1])for(let e=d+1;e<F;e++){if(J.attribOpeningQuoteAt&&p[e]===p[J.attribOpeningQuoteAt]){e!==d+1&&"="!==p[~-e]&&(t=!0);break}if(">"===p[e])break;if("<"===p[e]){t=!0,rt.pop();break}if(!p[e+1]){t=!0;break}}else t=!0;t&&(I.end=d+1,I.value=p.slice(I.start,I.end),J.attribValueStartsAt&&d&&J.attribValueStartsAt<d&&p.slice(J.attribValueStartsAt,d).trim()?(J.attribValueEndsAt=d,J.attribValueRaw=p.slice(J.attribValueStartsAt,d),Array.isArray(J.attribValue)&&J.attribValue.length&&!J.attribValue[~-J.attribValue.length].end&&(J.attribValue[~-J.attribValue.length].end=d,J.attribValue[~-J.attribValue.length].value=p.slice(J.attribValue[~-J.attribValue.length].start,d))):J.attribValueStartsAt=null,null===J.attribEnds&&(J.attribEnds=d),J&&(I.attribs.push(r(J)),U()))}p[d]&&h.charCb&&(bt={type:I.type,chr:p[d],i:d},h.charCb&&(D.push(bt),D.length>h.charCbLookahead&&st(D,h.charCb,h.charCbLookahead))),p[d]||null===I.start||(I.end=d,I.value=p.slice(I.start,I.end),J&&J.attribName&&(J.attribEnds||(J.attribEnds=d),I.attribs.push({...J}),U()),tt&&tt.propertyStarts&&(tt.end||(tt.end=d),at(tt),et()),ut(I)),p[d]&&p[d].trim()&&(lt=d)}var bt;if(D.length)for(let t=0,e=D.length;t<e;t++)st(D,h.charCb,h.charCbLookahead);if(H.length)for(let t=0,e=H.length;t<e;t++)st(H,h.tagCb,h.tagCbLookahead);return{timeTakenInMilliseconds:Date.now()-b}}const R={matchLayerLast:$};export{P as defaults,T as tokenizer,R as util,W as version};
