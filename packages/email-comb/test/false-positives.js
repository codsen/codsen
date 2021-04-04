import tap from "tap";
import { comb } from "./util/util";

// false positives
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - word class in text`,
  (t) => {
    const source = `<html>
  <head>
  </head>
  <body>
    <p>test class test </p>
  </body>
</html>
`;
    t.equal(comb(t, source).result, source, "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - word id in text`,
  (t) => {
    const source = `<html>
  <head>
  </head>
  <body>
    <p>test id test </p>
  </body>
</html>
`;
    t.equal(comb(t, source).result, source, "02");
    t.end();
  }
);
