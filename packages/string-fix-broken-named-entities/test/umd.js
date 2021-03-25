import tap from "tap";
import { fixEnt } from "../dist/string-fix-broken-named-entities.umd";

tap.test(`01`, (t) => {
  const inp1 = `Pint & pie costs ~&Pound;10 in the pub these&nbspdays. When they&rsqo;ll open we don&rsquot know.`;
  const outp1 = [
    [18, 25, "&pound;"],
    [44, 49, "&nbsp;"],
    [64, 70, "&rsquo;"],
    [84, 90, "&rsquo;"],
  ];
  t.strictSame(fixEnt(inp1), outp1, "01");
  t.end();
});
