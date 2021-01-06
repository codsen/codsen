import tap from "tap";
import { alts } from "../dist/html-img-alt.esm";

// throws
// -----------------------------------------------------------------------------

tap.test("01 - throws if encounters img tag within img tag", (t) => {
  t.throws(() => {
    alts('zzz<img alt="  <img />zzz');
  }, /THROW_ID_02/g);
  t.end();
});

tap.test("02 - throws if input is not string", (t) => {
  t.throws(() => {
    alts(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alts();
  }, /THROW_ID_01/g);
  t.throws(() => {
    alts(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alts(111);
  }, /THROW_ID_01/g);
  t.throws(() => {
    alts(true);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("03 - throws if opts is not a plain object", (t) => {
  t.throws(() => {
    alts("zzz", ["aaa"]);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alts("zzz", null); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.02");
  t.doesNotThrow(() => {
    alts("zzz", undefined); // it can be falsey, - we'll interpret as hardcoded choice of NO opts.
  }, "03.03");
  t.throws(() => {
    alts("zzz", 1);
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    alts("zzz", {});
  }, "03.05");
  t.throws(() => {
    alts("zzz", { zzz: "yyy" }); // rogue keys - throws. WTF?
  }, /THROW_ID_03/g);
  t.end();
});
