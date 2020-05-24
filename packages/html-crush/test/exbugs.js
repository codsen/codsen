import tap from "tap";
import { crush } from "../dist/html-crush.esm";

// pre + code
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`ex-bugs`}\u001b[${39}m`} - does not mangle pre/code`,
  (t) => {
    t.is(
      crush(
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
