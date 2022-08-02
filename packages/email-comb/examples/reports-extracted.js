// Returns all extracted and deleted classes and id's

import { strict as assert } from "assert";
import { comb } from "../dist/email-comb.esm.js";

const { allInHead, allInBody, deletedFromHead, deletedFromBody } = comb(
  `<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Tile</title>
<style type="text/css">
div.non-existent-class{display: block;}
table#other div#non-existent-id{width:100%; display: inline-block;}
</style>
</head>
<body>
<table>
<td>
  <img class="unused1 unused2" src="image.jpg" width="zzz" height="zzz" border="0" style="display:block;" alt="zzz">
  <br><br>
  <hr class="unused3">
  <br><br id="unused4">
</td>
</tr>
</table>
</body>
</html>
`
);

assert.deepEqual(allInHead, [
  "#non-existent-id",
  "#other",
  ".non-existent-class",
]);
assert.deepEqual(allInBody, ["#unused4", ".unused1", ".unused2", ".unused3"]);
assert.deepEqual(deletedFromHead, [
  "#non-existent-id",
  "#other",
  ".non-existent-class",
]);
assert.deepEqual(deletedFromBody, [
  "#unused4",
  ".unused1",
  ".unused2",
  ".unused3",
]);
