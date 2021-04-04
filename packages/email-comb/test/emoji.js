import tap from "tap";
import { comb } from "./util/util";

// emoji
// -----------------------------------------------------------------------------

tap.test("01 - doesn't affect emoji characters within the code", (t) => {
  const actual = comb(t, "<td>🦄</td>").result;
  const intended = `<td>🦄</td>`;

  t.strictSame(actual, intended, "01");
  t.end();
});

tap.test(
  "02 - doesn't affect emoji characters within the attribute names",
  (t) => {
    const actual = comb(t, '<td data-emoji="🦄">emoji</td>').result;
    const intended = `<td data-emoji="🦄">emoji</td>`;

    t.strictSame(actual, intended, "02");
    t.end();
  }
);
