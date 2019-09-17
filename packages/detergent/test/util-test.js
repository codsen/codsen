import test from "ava";
import { opts as exportedOptsObj } from "../dist/detergent.esm";
import {
  isLowercaseLetter,
  isUppercaseLetter,
  doConvertEntities,
  defaultOpts,
  isLetter
} from "../dist/util.esm";

// -----------------------------------------------------------------------------

test("01 - isLowercaseLetter() - detects the case of the given character", t => {
  t.is(isLowercaseLetter("a"), true, "01.01");
  t.is(isLowercaseLetter("A"), false, "01.02");
  t.is(isLowercaseLetter("1"), false, "01.03");
  t.is(isLowercaseLetter("Д"), false, "01.04");
  t.is(isLowercaseLetter("ж"), true, "01.05");
});

test("02 - isUppercaseLetter() - detects the case of the given character", t => {
  t.is(isUppercaseLetter("a"), false, "02.01");
  t.is(isUppercaseLetter("A"), true, "02.02");
  t.is(isUppercaseLetter("1"), false, "02.03");
  t.is(isUppercaseLetter("Д"), true, "02.04");
  t.is(isUppercaseLetter("ж"), false, "02.05");
});

test("03 - detects is the character a letter", t => {
  t.is(isLetter("a"), true, "03.01");
  t.is(isLetter("A"), true, "03.02");
  t.is(isLetter(" "), false, "03.03");
  t.is(isLetter(""), false, "03.04");
  t.is(isLetter(1), false, "03.05");
});

test("04 - package exports the options object", t => {
  t.deepEqual(exportedOptsObj, defaultOpts, "04");
});

test("05 - doConvertEntities() - converts correctly", t => {
  t.is(doConvertEntities("a"), "a", "05.01");
  t.is(doConvertEntities("£"), "&pound;", "05.02");
  t.is(doConvertEntities("'"), "&apos;", "05.03");
});
