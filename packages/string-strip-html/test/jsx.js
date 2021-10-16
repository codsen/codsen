import tap from "tap";
import { stripHtml } from "../dist/string-strip-html.esm.js";

tap.test("01 - a basic JSX pattern", (t) => {
  t.match(
    stripHtml(`<A b>c</A>
</>`),
    {
      result: "c",
      allTagLocations: [
        [0, 5],
        [6, 10],
        [11, 14],
      ],
      filteredTagLocations: [
        [0, 5],
        [6, 10],
        [11, 14],
      ],
    },
    "01"
  );
  t.end();
});
