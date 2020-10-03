import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// css comments
// -----------------------------------------------------------------------------

tap.todo(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - opening is missing`,
  (t) => {
    const gathered = [];
    ct(`<style>comment */</style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "01");
    t.end();
  }
);

tap.todo(
  `02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - closing is missing`,
  (t) => {
    const gathered = [];
    ct(`<style>/* comment </style>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.match(gathered, [], "02");
    t.end();
  }
);
