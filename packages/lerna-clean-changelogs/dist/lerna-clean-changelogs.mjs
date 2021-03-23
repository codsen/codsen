/**
 * lerna-clean-changelogs
 * Removes frivolous entries from commitizen generated changelogs
 * Version: 2.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/lerna-clean-changelogs/
 */

const t="2.0.9";function r(t){return"string"==typeof t}function n(t){if(void 0===t)throw new Error("lerna-clean-changelogs: [THROW_ID_01] The first input argument is missing!");if(!r(t))throw new Error(`lerna-clean-changelogs: [THROW_ID_02] The first input argument must be a string! It was given as ${Array.isArray(t)?"array":typeof t}, equal to:\n${JSON.stringify(t,null,4)}`);let n,i=!1;if("string"==typeof t&&t.length&&(!t.includes("\n")||!t.includes("\r"))){const e=r(t)&&t.length&&("\n"===t[t.length-1]||"\r"===t[t.length-1]),s=(t=t.trim().replace(/(https:\/\/git\.sr\.ht\/~[^/]+\/[^/]+\/)commits\//g,"$1commit/")).split(/\r?\n/);s.forEach(((t,r)=>{t.startsWith("#")&&(s[r]=t.replace(/(#+) \[?(\d+\.\d+\.\d+)\s?\]\([^)]*\)/g,"$1 $2")),r&&s[r].startsWith("# ")&&(s[r]=`#${s[r]}`)}));const o=[];for(let t=s.length;t--;){if(s[t].startsWith("**Note:** Version bump only")||s[t].toLowerCase().includes("wip")){for(;r(s[t-1])&&!s[t-1].trim()&&t;)t-=1;for(t&&r(s[t-1])&&s[t-1].trim().startsWith("#")&&(t-=1);r(s[t-1])&&!s[t-1].trim()&&t;)t-=1}else s[t].trim()?o.unshift("*"===s[t][0]&&" "===s[t][1]?`- ${s[t].slice(2)}`:s[t]):i||(o.unshift(s[t].trim()),i=!0);s[t].trim()&&(i=!1)}n=`${o.join("\n")}${e?"\n":""}`}return{version:"2.0.9",res:n||t}}export{n as cleanChangelogs,t as version};
