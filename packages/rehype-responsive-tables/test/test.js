import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test(`01 - one row, one cell`, () => {
  let input = `
<table>
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

  equal(res, input, "01");
});

test(`02 - one row, two cells`, () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td>a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
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

  equal(res, intended, "02");
});

test(`03 - one row, three cells`, () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2">a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
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

  equal(res, intended, "03");
});

test(`04 - one row, five cells`, () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
      <td>d</td>
      <td>e</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="4">a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
      <td>d</td>
      <td>e</td>
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

  equal(res, intended, "04");
});

test(`05 - 2x3`, () => {
  let input = `
<table>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr>
      <td>x</td>
      <td>y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2">a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2">x</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
      <td>z</td>
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

  equal(res, intended, "05");
});

test(`06 - thead, 2x3`, () => {
  let input = `
<table>
  <thead>
    <tr>
      <th>Foo</th>
      <th>Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr>
      <td>x</td>
      <td>y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <thead>
    <tr>
      <th class="rrt-del-td">Foo</th>
      <th>Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2">a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2">x</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
      <td>z</td>
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

  equal(res, intended, "06");
});

test(`07 - empty thead, 2x2`, () => {
  let input = `
<table>
  <thead></thead>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
    </tr>
    <tr>
      <td>x</td>
      <td>y</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <thead></thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td>a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td>x</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
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

  equal(res, intended, "07");
});

test(`08 - empty thead tr, 2x2`, () => {
  let input = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr>
      <td>a</td>
      <td>b</td>
    </tr>
    <tr>
      <td>x</td>
      <td>y</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td>a</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td>x</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
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

  equal(res, intended, "08");
});

test.skip(`09 - nested tags inside, no colspan`, () => {
  let input = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>a</code></td>
      <td>b</td>
    </tr>
    <tr>
      <td><code>x</code></td>
      <td>y</td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><code>a</code></td>
    </tr>
    <tr>
      <td class="rrt-del-td"><code>a</code></td>
      <td>b</td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><code>x</code></td>
    </tr>
    <tr>
      <td class="rrt-del-td"><code>x</code></td>
      <td>y</td>
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

  equal(res, intended, "09");
});

test.skip(`10 - nested tags inside, colspan`, () => {
  let input = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr>
      <td><code>a</code></td>
      <td>b</td>
      <td><code>c</code></td>
    </tr>
    <tr>
      <td><code>x</code></td>
      <td>y</td>
      <td><code>z</code></td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table>
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><code>a</code></td>
    </tr>
    <tr>
      <td class="rrt-del-td"><code>a</code></td>
      <td>b</td>
      <td><code>c</code></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><code>x</code></td>
    </tr>
    <tr>
      <td class="rrt-del-td"><code>x</code></td>
      <td>y</td>
      <td><code>z</code></td>
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

  equal(res, intended, "10");
});

test.run();
