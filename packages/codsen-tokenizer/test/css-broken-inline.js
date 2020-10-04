import tap from "tap";
import ct from "../dist/codsen-tokenizer.esm";

// errors within inline css
// -----------------------------------------------------------------------------

tap.todo(
  `01 - ${`\u001b[${36}m${`rule`}\u001b[${39}m`} - semi missing between two rules`,
  (t) => {
    const gathered = [];
    ct(`<div style="float:left color:red">z</div>`, {
      tagCb: (obj) => {
        gathered.push(obj);
      },
    });
    t.strictSame(gathered, [], "01");
    t.end();
  }
);
