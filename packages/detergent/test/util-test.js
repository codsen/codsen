const t = require("tap");
const { opts } = require("../dist/detergent.cjs");
const {
  isLowercaseLetter,
  isUppercaseLetter,
  doConvertEntities,
  defaultOpts,
  isLetter
} = require("../dist/util.cjs");

// -----------------------------------------------------------------------------

t.test(
  "01 - isLowercaseLetter() - detects the case of the given character",
  t => {
    t.equal(isLowercaseLetter("a"), true, "01.01");
    t.equal(isLowercaseLetter("A"), false, "01.02");
    t.equal(isLowercaseLetter("1"), false, "01.03");
    t.equal(isLowercaseLetter("Д"), false, "01.04");
    t.equal(isLowercaseLetter("ж"), true, "01.05");
    t.end();
  }
);

t.test(
  "02 - isUppercaseLetter() - detects the case of the given character",
  t => {
    t.equal(isUppercaseLetter("a"), false, "02.01");
    t.equal(isUppercaseLetter("A"), true, "02.02");
    t.equal(isUppercaseLetter("1"), false, "02.03");
    t.equal(isUppercaseLetter("Д"), true, "02.04");
    t.equal(isUppercaseLetter("ж"), false, "02.05");
    t.end();
  }
);

t.test("03 - detects is the character a letter", t => {
  t.equal(isLetter("a"), true, "03.01");
  t.equal(isLetter("A"), true, "03.02");
  t.equal(isLetter(" "), false, "03.03");
  t.equal(isLetter(""), false, "03.04");
  t.equal(isLetter(1), false, "03.05");
  t.end();
});

t.test("04 - package exports the options object", t => {
  t.same(opts, defaultOpts, "04");
  t.end();
});

t.test("05 - doConvertEntities() - converts correctly", t => {
  t.equal(doConvertEntities("a"), "a", "05.01");
  t.equal(doConvertEntities("£"), "&pound;", "05.02");
  t.equal(doConvertEntities("'"), "&apos;", "05.03");
  t.end();
});
