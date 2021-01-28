/**
 * regex-is-jsp
 * Regular expression for detecting JSP (Java Server Pages) code
 * Version: 2.0.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jsp/
 */

const s="2.0.1";function n(){return/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi}export{n as isJSP,s as version};
