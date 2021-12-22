import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { tokenizer as ct } from "../dist/codsen-tokenizer.esm.js";

// missing closing bracket on a <style> tag
// -----------------------------------------------------------------------------

test.skip(`01`, () => {
  let gathered = [];
  ct(`<style.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  match(gathered, [], "01.01");
});

test.skip(`02`, () => {
  let gathered = [];
  ct(`<style.a.a\n.a{b:c !important;}</style.a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  match(gathered, [], "02.01");
});

// misplaced semi
// -----------------------------------------------------------------------------

test.skip(`03 - standalone semi in head CSS - chopped`, () => {
  let gathered = [];
  ct(`<style>.a{b:c!important};`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(gathered, [], "03.01");
});

test.skip(`04 - standalone semi in head CSS - closed`, () => {
  let gathered = [];
  ct(`<style.a.a.a.a.a>.red{color:red!important};</style.a.a.a.a.a.a.a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  equal(gathered, [], "04.01");
});

test.skip(`05 - standalone semi in head CSS - surroundings`, () => {
  let gathered = [];
  ct(
    `<style>.a{b:c!important};
.b{text-align:left;}`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  equal(gathered, [], "05.01");
});

test.run();
