import tap from "tap";
import alt from "../dist/html-img-alt.esm";

// throws
// -----------------------------------------------------------------------------

tap.test("01 - throws if encounters img tag within img tag", (t) => {
  t.throws(() => {
    alt('zzz<img alt="  <img />zzz');
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("02 - throws if input is not string", (t) => {
  t.throws(() => {
    alt(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt();
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(111);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alt(true);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("03 - throws if opts is not a plain object", (t) => {
  t.throws(() => {
    alt("zzz", ["aaa"]);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.02");
  t.doesNotThrow(() => {
    alt("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.03");
  t.throws(() => {
    alt("zzz", 1);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alt("zzz", {});
  }, "03.05");
  t.throws(() => {
    alt("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
  }, /THROW_ID_03/g);
  t.end();
});
