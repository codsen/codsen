// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("001 - a basic JSX pattern", () => {
  equal(
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
      ranges: [
        [0, 5],
        [6, 14],
      ],
    },
    "001.01",
  );
});

test.run();
