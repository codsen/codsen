import tap from "tap";
import { m } from "./util/util";

// grouped tests
tap.test(
  `01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - does nothing`,
  (t) => {
    [
      `abc def`,
      `!--`,
      `-->`,
      `abd <!-- def`,
      `<!--<span>-->`,
      `<!--a-->`,
      `<!-->`,
      `<!--<!---->`,
      `<!--a b-->`,
      `<!-- tralala -->`,
    ].forEach((source) => {
      t.match(
        m(t, source, {
          removeHTMLComments: false,
        }),
        {
          result: source,
        },
        "01.01"
      );
    });
    t.end();
  }
);
