import tap from "tap";
import { m } from "./util/util";

// pre + code
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`ex-bugs`}\u001b[${39}m`} - does not mangle pre/code`,
  (t) => {
    t.is(
      m(
        t,
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
        }
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
      "01"
    );
    t.end();
  }
);

tap.test(`02`, (t) => {
  const input = `  <a>
     <b>
   c </b>
   </a>
     <b>
     `;
  t.match(
    m(t, input, {
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
    "02"
  );
  t.end();
});
