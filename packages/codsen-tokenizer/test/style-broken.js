import tap from "tap";
import { tokenizer as ct } from "../dist/codsen-tokenizer.esm";

// missing closing bracket on a <style> tag
// -----------------------------------------------------------------------------

tap.todo(`01`, (t) => {
  const gathered = [];
  ct(`<style.a{b:c !important;}</style>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "01");

  t.end();
});

tap.todo(`02`, (t) => {
  const gathered = [];
  ct(`<style.a.a\n.a{b:c !important;}</style.a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.match(gathered, [], "02");

  t.end();
});

// misplaced semi
// -----------------------------------------------------------------------------

tap.todo(`03 - standalone semi in head CSS - chopped`, (t) => {
  const gathered = [];
  ct(`<style>.a{b:c!important};`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "03");
  t.end();
});

tap.todo(`04 - standalone semi in head CSS - closed`, (t) => {
  const gathered = [];
  ct(`<style.a.a.a.a.a>.red{color:red!important};</style.a.a.a.a.a.a.a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
  t.strictSame(gathered, [], "04");
  t.end();
});

tap.todo(`05 - standalone semi in head CSS - surroundings`, (t) => {
  const gathered = [];
  ct(
    `<style>.a{b:c!important};
.b{text-align:left;}`,
    {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    }
  );
  t.strictSame(gathered, [], "05");
  t.end();
});
