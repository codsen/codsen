import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test("01 - adds class to parent table, no class there", () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table class="rrt-table">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "01.01");
});

test("02 - adds class to parent table, no class there but other attrs", () => {
  let input = `
<table border="0">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table border="0" class="rrt-table">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "02.01");
});

test("03 - adds class to parent table, no class value", () => {
  let input = `
<table border="0" class>
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table border="0" class="rrt-table">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "03.01");
});

test("04 - adds class to parent table, where class is empty", () => {
  let input = `
<table border="0" class="">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table border="0" class="rrt-table">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "04.01");
});

test("05 - adds class to parent table, one class exists already", () => {
  let input = `
<table border="0" class="foo">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table border="0" class="foo rrt-table">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "05.01");
});

test("06 - adds class to parent table, two classes exist already", () => {
  let input = `
<table border="0" class="foo  bar">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table border="0" class="foo bar zzz">
  <tbody>
    <tr>
      <td>a</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      tableClassName: "zzz",
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "06.01");
});

test.run();
