/**
 * is-html-attribute-closing
 * Is a character on a given index a closing of an HTML attribute?
 * Version: 2.2.3
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/is-html-attribute-closing/
 */

import{allHtmlAttribs as t}from"html-all-known-attributes";import{isAttrNameChar as e}from"is-char-suitable-for-html-attr-name";import{left as i,right as r}from"string-left-right";import{matchRight as s}from"string-match-left-right";function n(t){return"'"===t?'"':"'"}function c(t,e,i,r=[]){for(let s=e,n=t.length;s<n;s++){if(r.some((e=>t.startsWith(e,s))))return!0;if(t[s]===i)return!1}return!0}function l(t,e,i,r){for(let s=e,n=t.length;s<n;s++){if(t.startsWith(i,s))return!0;if(t.startsWith(r,s))return!1}return!1}function u(t,i){if(!e(t[i])||!i)return!1;return/^[a-zA-Z0-9:-]*(\s*[=]?\s*((?:'[^']*')|(?:"[^"]*")))|( [^/>'"=]*['"])/.test(t.slice(i))}function f(t,i){if(!i||!e(t[i]))return!1;return/^[a-zA-Z0-9:-]*=(((?:'[^']*')|(?:"[^"]*"))|((?:['"][^'"]*['"]\s*\/?>)))/.test(t.slice(i))}function a(t,r){if(e(t[i(t,r)]))for(let i=r;i--;)if(t[i].trim().length&&!e(t[i]))return t.slice(i+1,r)}const h="2.2.3";function m(h,m,o){if("string"!=typeof h||!h.trim()||!Number.isInteger(m)||!Number.isInteger(o)||!h[m]||!h[o]||m>=o)return!1;const d="'\"".includes(h[m])?h[m]:null;let g,p=null;d&&(p=n(d));const P=(new Map).set("'",0).set('"',0).set("matchedPairs",0);let W,v,y,b,M=null,A=0,B=!1,k=!1,w=!1,z=!1;for(let C=m,I=h.length;C<I;C++){const I=r(h,C),N=i(h,C);if("'\"".includes(h[C])&&B&&W===m&&void 0!==v&&v<C&&C>=o){const s=C!==o||f(h,r(h,o))||"/>".includes(h[I]),n=!(C>o&&h[m]===h[o]&&h[m]===h[C]&&u(h,C+1)),l=C===o&&u(h,o+1),d=g&&g<C&&t.has(h.slice(g,C).trim());g&&h.slice(g,C).trim();const p=g&&g<C&&h[g-1]&&!h[g-1].trim()&&Array.from(h.slice(g,C).trim()).every((t=>e(t)))&&h[m]===h[o]&&!"/>".includes(h[I])&&c(h,C+1,"=",["'",'"']);let P;C===o&&(P=a(h,C));const W=C===o&&(!e(h[N])||P&&!t.has(P))&&"="!==h[N],v="/>".includes(h[I])&&C===o,y=e(h[I]),b=B&&C!==o,M=!(C>=o&&":"===h[i(h,o)]);return!!(s&&n&&(l||d||p||W)&&(v||y||b)&&M)}if("'\"".includes(h[C])){if("'"===h[C]&&'"'===h[C-1]&&'"'===h[C+1]||'"'===h[C]&&"'"===h[C-1]&&"'"===h[C+1])continue;M&&h[C]===h[M]?(P.set("matchedPairs",P.get("matchedPairs")+1),W=M,v=C,M=null,B=!0):B=!1,P.set(h[C],P.get(h[C])+1),A=P.get('"')+P.get("'")}if(">"===h[C]&&!w&&(w=!0,A&&P.get("matchedPairs")&&A===2*P.get("matchedPairs")&&C<o))return!1;if("<"===h[C]&&"%"!==h[I]&&w&&!z)return z=!0,!1;if(h[C].trim()&&!g)e(h[C])&&(g=C);else if(g&&!e(h[C])){if(b=y,y=h.slice(g,C),k=g>=o,"'\"".includes(h[C])&&0===P.get("matchedPairs")&&3===A&&h[m]===h[C]&&t.has(y)&&!"'\"".includes(h[I])){const e=C>o,i=!M,r=M+1>=C,s=h.slice(M+1,C).trim().split(/\s+/).every((e=>t.has(e))),n=!y||!b||!b.endsWith(":"),c=C===o,l=A<3,u=!!B,f=!M,a=M+1>=C,m=!h.slice(M+1,C).trim().split(/\s+/).every((e=>t.has(e)));return e&&(i||r||s)&&n||c&&(l||u||f||a||m)}if(y&&t.has(y)&&W===m&&v===o)return!0}if("'\"".includes(h[C])&&(!(P.get('"')%2)||!(P.get("'")%2))&&(P.get('"')+P.get("'"))%2&&(y&&t.has(y)||C>o+1&&t.has(h.slice(o+1,C).trim()))&&(h[C+1]!==h[C]||h[C]!==h[m])&&!(C>o+1&&":"===h[i(h,o)])&&!(y&&b&&b.trim().endsWith(":"))){const e=C>o,i=!!d,r=h[m]!==h[o],s=t.has(h.slice(m+1,o).trim()),c=!l(h,C+1,h[o],n(h[o]));return e&&!(i&&r&&s&&c)}if(("="===h[C]||!h[C].length&&"="===h[I])&&y&&t.has(y)){const t=C>o,e=!(!(B&&W===m&&v===o||f(h,g))&&B&&void 0!==W&&W<=o);return t&&e}if(C>o){if(d&&h[C]===d){const e=!!M,i=M===o,r=M+1<C&&h.slice(M+1,C).trim(),s=h.slice(M+1,C).trim().split(/\s+/).every((e=>t.has(e))),n=C>=o,c=!h[I]||!"'\"".includes(h[I]);return!!(e&&i&&r&&s&&n&&c)}if(d&&h[o]===p&&h[C]===p)return!1;if("/"===h[C]||">"===h[C]||"<"===h[C]){const i=h[m]===h[o]&&M===o&&!h.slice(m+1,o).includes(h[m]),r=P.get("matchedPairs")<2,s=a(h,C),n=(!s||!t.has(s))&&(!(C>o&&P.get("'")&&P.get('"')&&P.get("matchedPairs")>1)||"/>".includes(h[I])),l=A<3||P.get('"')+P.get("'")-2*P.get("matchedPairs")!=2,u=!B||B&&!(void 0!==W&&Array.from(h.slice(m+1,W).trim()).every((t=>e(t)))&&t.has(h.slice(m+1,W).trim())),f=!I&&A%2==0,d=h[m-2]&&"="===h[m-1]&&e(h[m-2]),g=!c(h,C+1,"<",["='",'="']);return i||(r||n)&&l&&(u||f||d||g)}if("="===h[C]&&s(h,C,["'",'"'],{trimBeforeMatching:!0,trimCharsBeforeMatching:["="]}))return!0}else{let n;if(h[C-1]&&h[C-1].trim()&&"="!==h[C-1])n=C-1;else for(let t=C;t--;)if(h[t].trim()&&"="!==h[t]){n=t;break}if("="===h[C]&&s(h,C,["'",'"'],{cb:t=>!"/>".includes(t),trimBeforeMatching:!0,trimCharsBeforeMatching:["="]})&&e(h[n])&&!h.slice(m+1).startsWith("http")&&!h.slice(m+1,C).includes("/")&&!h.endsWith("src=",m)&&!h.endsWith("href=",m))return!1;if(C===o&&f(h,C+1))return!0;if(C<o&&"'\"".includes(h[C])&&y&&h[i(h,m)]&&"="!==h[i(h,m)]&&W===m&&t.has(y))return!1;if(C===o&&"'\"".includes(h[C])&&("'"===h[N]||'"'===h[N])&&y&&b&&A%2==0&&b.endsWith(":"))return!0;if(C===o&&"'\"".includes(h[C])&&h.slice(m,o).includes(":")&&(">"===h[I]||"/"===h[I]&&">"===h[r(h,I)]))return!0}if("'\"".includes(h[C])&&C>o)return!!(k&&y&&t.has(y));"'\"".includes(h[C])&&(M=C),g&&!e(h[C])&&(g=null)}return!1}export{m as isAttrClosing,h as version};
