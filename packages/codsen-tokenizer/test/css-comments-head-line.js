import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// line
// -----------------------------------------------------------------------------

tap.todo(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - line comment`,
  (t) => {
    const gathered = [];
    ct(`<style>// something\na{text-decoration: none;}</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "01");
    t.end();
  }
);

tap.todo(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - line comment`,
  (t) => {
    const gathered = [];
    ct(`<style>// something</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "02");
    t.end();
  }
);
