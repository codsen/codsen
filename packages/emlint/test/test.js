import test from "ava";
import { emlint } from "../dist/emlint.esm";

// 00. Insurance
// -----------------------------------------------------------------------------

test(`00.01 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 1st input arg wrong`, t => {
  const error1 = t.throws(() => {
    emlint(true);
  });
  t.regex(error1.message, /THROW_ID_01/);
});

test(`00.02 - ${`\u001b[${33}m${`arg. validation`}\u001b[${39}m`} - 2nd input arg wrong`, t => {
  const error1 = t.throws(() => {
    emlint("a", true);
  });
  t.regex(error1.message, /THROW_ID_02/);
});

// 01. rule "space-after-opening-bracket"
// -----------------------------------------------------------------------------
test(`01.01 - ${`\u001b[${35}m${`space between tag name and opening bracket`}\u001b[${39}m`} - single space`, t => {
  const res = emlint("< table>").issues;
  // there's only one issue:
  t.is(res.length, 1, "01.01.01");
  t.is(res[0].name, "space-after-opening-bracket", "01.01.02");
  t.deepEqual(res[0].position, [[1, 2]], "01.01.03");
});
