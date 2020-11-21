import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// whole line
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - first line commented out`,
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

tap.test(
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

// mixed
// -----------------------------------------------------------------------------

tap.test(
  `03 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - first line commented out`,
  (t) => {
    const gathered = [];
    ct(`<style>a { color: red; }</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "03");
    t.end();
  }
);
