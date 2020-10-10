import tap from "tap";
import cparser from "../dist/codsen-parser.esm";

// 01. void tags
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`void tags`}\u001b[${39}m`} - one slash in front`,
  (t) => {
    const gatheredErr = [];
    const ast = cparser("</br>", {
      errCb: (incoming) => gatheredErr.push(incoming),
    });
    t.match(
      ast,
      [
        {
          type: "tag",
          start: 0,
          end: 5,
          value: "</br>",
          tagNameStartsAt: 2,
          tagNameEndsAt: 4,
          tagName: "br",
          recognised: true,
          closing: true,
          void: true,
          pureHTML: true,
          kind: "inline",
          attribs: [],
          children: [],
        },
      ],
      "01.01"
    );
    t.is(ast.length, 1, "01.02");

    t.match(
      gatheredErr,
      [
        {
          ruleId: `tag-void-frontal-slash`,
          idxFrom: 0,
          idxTo: 5,
          fix: { ranges: [[1, 2]] },
        },
      ],
      "01.03"
    );
    t.is(gatheredErr.length, 1, "01.04");
    t.end();
  }
);
