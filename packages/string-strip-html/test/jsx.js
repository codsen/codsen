import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

test("01 - a basic JSX pattern", () => {
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
    "01.01",
  );
});

test.run();
