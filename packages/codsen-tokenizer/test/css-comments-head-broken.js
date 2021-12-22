import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// css comments
// -----------------------------------------------------------------------------

test.skip(`01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - opening is missing`, () => {
  let gathered = [];
  ct(`<style>comment */</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  match(gathered, [], "01");
});

test.skip(`02 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - closing is missing`, () => {
  let gathered = [];
  ct(`<style>/* comment </style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  match(gathered, [], "02");
});

test.run();
