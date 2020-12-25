/**
 * regex-is-jsp
 * Regular expression for detecting JSP (Java Server Pages) code
 * Version: 1.1.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jsp/
 */

var s="1.1.1";function r(){return/<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi}export{r as isJSP,s as version};
