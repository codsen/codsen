import tap from "tap";
import is from "../dist/is-html-tag-opening.esm";

// API
// -----------------------------------------------------------------------------

tap.test(`01 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is();
  }, /THROW_ID_01/);
  t.end();
});

tap.test(`02 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is(true);
  }, /THROW_ID_01/);
  t.end();
});

tap.test(`03 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is({ a: 1 });
  }, /THROW_ID_01/);
  t.end();
});

tap.test(`04 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is("z", true);
  }, /THROW_ID_02/);
  t.end();
});

tap.test(`05 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is("z", false);
  }, /THROW_ID_02/);
  t.end();
});

tap.test(`06 - ${`\u001b[${32}m${`API`}\u001b[${39}m`} - throws`, (t) => {
  t.throws(() => {
    is("z", null);
  }, /THROW_ID_02/);
  t.end();
});
