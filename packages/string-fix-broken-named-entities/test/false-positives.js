import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.esm";

tap.test(
  `01 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`,
  (t) => {
    const inp1 = "one pound;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        decode: false,
      }),
      [],
      "01"
    );
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${36}m${`false positives`}\u001b[${39}m`} - legit pound, no decode`,
  (t) => {
    const inp1 = "one pound;";
    t.strictSame(
      fix(inp1, {
        cb: (obj) => obj,
        decode: true,
      }),
      [],
      "02"
    );
    t.end();
  }
);

tap.test(`03`, (t) => {
  const gathered = [];
  const inp1 = `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>`;
  t.strictSame(
    fix(inp1, {
      cb: (obj) => obj,
      decode: true,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "03.01"
  );
  t.strictSame(gathered, [55], "03.02");
  t.end();
});

tap.test(`04`, (t) => {
  const gathered = [];
  const inp1 = `<a href="https://example.com/test?param1=<%= @param1 %>&param2=<%= @param2 %>">click me</a>`;
  t.strictSame(
    fix(inp1, {
      cb: (obj) => obj,
      decode: false,
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    [],
    "04.01"
  );
  t.strictSame(gathered, [55], "04.02");
  t.end();
});
