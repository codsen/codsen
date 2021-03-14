/**
 * regex-is-jsp
 * Regular expression for detecting JSP (Java Server Pages) code
 * Version: 2.0.8
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jsp/
 */

const s="2.0.8";function c(){return/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi}export{c as isJSP,s as version};
