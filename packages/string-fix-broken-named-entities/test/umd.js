import tap from "tap";
import { fixEnt as fix } from "../dist/string-fix-broken-named-entities.umd";

tap.todo(`01`, (t) => {
  const gathered = [];
  const inp1 = `Pint & pie costs ~&Pound;4 in the pub these&nbspdays. When they&rsqo;ll open we don&rsquot know.`;
  const outp1 = [
    [18, 25, "&pound;"],
    [43, 48, "&nbsp;"],
    [63, 69, "&rsquo;"],
    [83, 89, "&rsquo;"],
  ];
  t.strictSame(fix(inp1), outp1, "01.01");
  t.strictSame(
    fix(inp1, {
      textAmpersandCatcherCb: (idx) => {
        gathered.push(idx);
      },
    }),
    outp1,
    "01.02"
  );
  t.strictSame(gathered, [5], "01.03");
  t.end();
});
