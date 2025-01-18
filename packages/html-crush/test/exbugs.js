import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

// pre + code
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${"ex-bugs"}\u001b[${39}m`} - does not mangle pre/code`, () => {
  is(
    m(
      equal,
      `<html>
<body>
  <pre class="language-html">
    <code class="language-html">
Some text
  <div>Content</div>
More content
    </code>
  </pre>
</body>
</html>
      `,
      {
        removeLineBreaks: true,
      },
    ).result,
    `<html>
<body><pre class="language-html">
    <code class="language-html">
Some text
  <div>Content</div>
More content
    </code>
  </pre>
</body>
</html>`,
    "01.01",
  );
});

test("02", () => {
  let input = `  <a>
     <b>
   c </b>
   </a>
     <b>
     `;
  compare(
    ok,
    m(equal, input, {
      lineLengthLimit: 8,
      removeIndentations: true,
      removeLineBreaks: true,
    }),
    {
      ranges: [
        [0, 2],
        [5, 11, " "],
        [14, 18, "\n"],
        [24, 28, "\n"],
        [32, 38, " "],
        [41, 47],
      ],
      result: `<a> <b>
c </b>
</a> <b>`,
    },
    "02",
  );
});

test.run();
