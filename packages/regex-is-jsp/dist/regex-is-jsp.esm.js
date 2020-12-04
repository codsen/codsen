/**
 * regex-is-jsp
 * Regular expression for detecting JSP (Java Server Pages) code
 * Version: 1.1.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/regex-is-jsp/
 */

var main = () => /<%|%>|<\s*jsp:|<\s*cms:|<\s*c:|\${\s*jsp/gi;

export default main;
