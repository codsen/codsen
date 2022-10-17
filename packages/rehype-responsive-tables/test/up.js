import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rehype } from "rehype";
import rehypeFormat from "rehype-format";
import rehypeResponsiveTables from "../dist/rehype-responsive-tables.esm.js";

// target cells by their thead column's contents
// -----------------------------------------------------------------------------

test(`01 - lifts Bar, text`, () => {
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
<table class="rrt-table">
  <thead>
    <tr>
      <th class="rrt-del-td">Foo</th>
      <th class="rrt-del-td">Bar</th>
      <th>Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span><br><span class="rrt-new-tr__span-other">Bar:</span> b</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td class="rrt-del-td">b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">x</span><br><span class="rrt-new-tr__span-other">Bar:</span> y</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td class="rrt-del-td">y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      up: ["Bar"],
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "01");
});

test(`02 - lifts Bar, code`, () => {
  let input = `
<table>
  <thead>
    <tr>
      <th>
        <code>
          Foo
        </code>
      </th>
      <th>
        <code>
          Bar
        </code>
      </th>
      <th>
        <code>
          Baz
        </code>
      </th>
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
      <td>
        c
      </td>
    </tr>
    <tr>
      <td>
        x
      </td>
      <td>
        y
      </td>
      <td>
        z
      </td>
    </tr>
  </tbody>
</table>
`;

  let intended = `
<table class="rrt-table">
  <thead>
    <tr>
      <th class="rrt-del-td"><code>Foo</code></th>
      <th class="rrt-del-td"><code>Bar</code></th>
      <th><code>Baz</code></th>
    </tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span><br><span class="rrt-new-tr__span-other"><code>Bar</code>:</span> b</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td class="rrt-del-td">b</td>
      <td>c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">x</span><br><span class="rrt-new-tr__span-other"><code>Bar</code>:</span> y</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td class="rrt-del-td">y</td>
      <td>z</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      up: ["Bar"],
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "02");
});

test(`03 - wildcard`, () => {
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
<table class="rrt-table">
  <thead>
    <tr>
      <th class="rrt-del-td">Foo</th>
      <th class="rrt-del-td">Bar</th>
      <th class="rrt-del-td">Baz</th>
    </tr>
  </thead>
  <tbody>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">a</span><br><span class="rrt-new-tr__span-other">Foo:</span> a<br><span class="rrt-new-tr__span-other">Bar:</span> b<br><span class="rrt-new-tr__span-other">Baz:</span> c</td>
    </tr>
    <tr>
      <td class="rrt-del-td">a</td>
      <td class="rrt-del-td">b</td>
      <td class="rrt-del-td">c</td>
    </tr>
    <tr class="rrt-gap-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"></td>
    </tr>
    <tr class="rrt-new-tr">
      <td class="rrt-del-td"></td>
      <td colspan="2"><span class="rrt-new-tr__span-top">x</span><br><span class="rrt-new-tr__span-other">Foo:</span> x<br><span class="rrt-new-tr__span-other">Bar:</span> y<br><span class="rrt-new-tr__span-other">Baz:</span> z</td>
    </tr>
    <tr>
      <td class="rrt-del-td">x</td>
      <td class="rrt-del-td">y</td>
      <td class="rrt-del-td">z</td>
    </tr>
  </tbody>
</table>
`;

  let res = rehype()
    .data("settings", { fragment: true })
    .use(rehypeResponsiveTables, {
      up: ["*"],
    })
    .use(rehypeFormat)
    .processSync(input)
    .toString();

  equal(res, intended, "03");
});

test.run();
