import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${`false positives`}\u001b[${39}m`} - double percentage`,
  (t) => {
    const gathered = [];
    ct(`<table width="100%%">`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(
      gathered,
      [
        {
          type: "tag",
          tagName: "table",
          start: 0,
          end: 21,
          attribs: [
            {
              attribName: "width",
              attribNameStartsAt: 7,
              attribNameEndsAt: 12,
              attribOpeningQuoteAt: 13,
              attribClosingQuoteAt: 19,
              attribValueRaw: "100%%",
              attribValue: [
                {
                  type: "text",
                  start: 14,
                  end: 19,
                  value: "100%%",
                },
              ],
              attribValueStartsAt: 14,
              attribValueEndsAt: 19,
              attribStart: 7,
              attribEnd: 20,
            },
          ],
        },
      ],
      "01.01"
    );
    t.end();
  }
);
