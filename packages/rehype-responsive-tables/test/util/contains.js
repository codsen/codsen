// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import rehypeParse from "rehype-parse";
import { unified } from "unified";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";
import { contains } from "../../dist/rehype-responsive-tables.esm.js";

const parse = (str) =>
  unified().data("settings", { fragment: true }).use(rehypeParse).parse(str);

// -----------------------------------------------------------------------------

test("01 - spaced", () => {
  const input = `
<table>
  <tbody>
    <tr>
      <td>
        Foo
      </td>
      <td>
        Bar
      </td>
    </tr>
  </tbody>
</table>
`;

  equal(contains(parse(input), "Foo"), "Foo", "01.01");
  equal(contains(parse(input), ["Foo"]), "Foo", "01.02");
  equal(contains(parse(input), ["Foo", "Baz"]), "Foo", "01.03");
  equal(contains(parse(input), "Bar"), "Bar", "01.04");
  equal(contains(parse(input), ["Bar"]), "Bar", "01.05");
  equal(contains(parse(input), ["Bar", "Foo"]), "Foo", "01.06");
  equal(contains(parse(input), "Baz"), undefined, "01.07");
  equal(contains(parse(input), ""), undefined, "01.08");
  equal(contains(parse(input), []), undefined, "01.09");
});

test.run();
