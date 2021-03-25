/**
 * regex-jinja-specific
 * Regular expression for detecting Python-specific Jinja code
 * Version: 2.0.10
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-jinja-specific/
 */

const s="2.0.10";function t(){return/(set\s*[\w]+\s*=\s*namespace\()|({{['"][\w]+['"]\s+if)|(['"]%x?[+0]?[.>^<]?\d+[\w%]['"]\|format\()/gi}export{t as isJinjaSpecific,s as version};
