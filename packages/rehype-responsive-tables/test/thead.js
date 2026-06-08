// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// -----------------------------------------------------------------------------

test("01 - thead, 2x3", () => {
  const input = `
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

  const intended = `
<table class="rrt-table">
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
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">x</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  const res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "01.01");
});

test("02 - empty thead, 2x2", () => {
  const input = `
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

  const intended = `
<table class="rrt-table">
  <thead></thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><span class="rrt-new-tr__span-top">x</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
    </tr>
  </tbody>
</table>
`;

  const res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "02.01");
});

test("03 - empty thead tr, 2x2", () => {
  const input = `
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

  const intended = `
<table class="rrt-table">
  <thead>
    <tr></tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td><span class="rrt-new-tr__span-top">x</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td>y</td>
    </tr>
  </tbody>
</table>
`;

  const res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "03.01");
});

test("04 - thead, td with children", () => {
  const input = `
<table>
  <thead>
    <tr>
      <th>
        Foo
      </th>
      <th>




      Bar
      </th>
      <th>Baz           </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        a
      </td>
      <td>
                  b
      </td>
      <td>   c   </td>
    </tr>
    <tr>
      <td>
        <code>x</code> y <code>z</code>
      </td>
      <td>
        o
      </td>
      <td>
        i
      </td>
    </tr>
  </tbody>
</table>
`;

  const intended = `
<table class="rrt-table">
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
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span></td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td>b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top"><code>x</code> y <code>z</code></span></td>
    </tr>
    <tr>
      <td class="rrt-del-td"><code>x</code> y <code>z</code></td>
      <td>o</td>
      <td>i</td>
    </tr>
  </tbody>
</table>
`;

  const res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables)
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "04.01");
});

test.run();
