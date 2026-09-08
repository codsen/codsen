import { runInNewContext } from "node:vm";
import { test } from "uvu";
import { equal, throws } from "uvu/assert";

import { defaults, splitEasy } from "../dist/csv-split-easy.esm.js";

test("01 - foreign literals and Object instances configure the delimiter", () => {
  const literal = runInNewContext('({ delimiter: ";" })');
  const constructed = runInNewContext(
    'Object.assign(new Object(), { delimiter: ";" })',
  );

  equal(splitEasy("name;value", literal), [["name", "value"]], "01.01");
  equal(splitEasy("name;value", constructed), [["name", "value"]], "01.02");
  equal(
    splitEasy("name;value", { delimiter: ";" }),
    [["name", "value"]],
    "01.03",
  );
});

test("02 - local and foreign null-prototype records remain valid options", () => {
  const local = Object.assign(Object.create(null), { delimiter: "|" });
  const foreign = runInNewContext(
    'Object.assign(Object.create(null), { delimiter: "|" })',
  );

  equal(splitEasy("name|value", local), [["name", "value"]], "02.01");
  equal(splitEasy("name|value", foreign), [["name", "value"]], "02.02");
});

test("03 - foreign numeric options forward both enabled and disabled values", () => {
  const retained = runInNewContext(`({
    delimiter: ";",
    removeThousandSeparatorsFromNumbers: false,
    padSingleDecimalPlaceNumbers: false,
    forceUKStyle: true
  })`);
  const disabled = runInNewContext(`({
    delimiter: ";",
    removeThousandSeparatorsFromNumbers: false,
    padSingleDecimalPlaceNumbers: false,
    forceUKStyle: false
  })`);
  const enabled = runInNewContext(`({
    delimiter: ";",
    removeThousandSeparatorsFromNumbers: true,
    padSingleDecimalPlaceNumbers: true,
    forceUKStyle: true
  })`);
  const input = 'item;"1 234,5";"0,5";"1 234,50"';

  equal(
    splitEasy(input, retained),
    [["item", "1 234.5", "0.5", "1 234.50"]],
    "03.01",
  );
  equal(
    splitEasy(input, disabled),
    [["item", "1 234,5", "0,5", "1 234,50"]],
    "03.02",
  );
  equal(
    splitEasy(input, enabled),
    [["item", "1234.50", "0.50", "1234.50"]],
    "03.03",
  );
});

test("04 - foreign options and defaults stay unchanged across calls", () => {
  const options = runInNewContext(`Object.freeze({
    delimiter: ";",
    removeThousandSeparatorsFromNumbers: false,
    padSingleDecimalPlaceNumbers: false,
    forceUKStyle: true
  })`);
  const originalDescriptors = Object.getOwnPropertyDescriptors(options);
  const originalPrototype = Object.getPrototypeOf(options);
  const originalDefaults = { ...defaults };
  const input = 'item;"1 234,5"';

  equal(splitEasy(input, options), [["item", "1 234.5"]], "04.01");
  equal(splitEasy('item,"1 234,5"'), [["item", "1234,50"]], "04.02");
  equal(splitEasy(input, options), [["item", "1 234.5"]], "04.03");
  equal(input, 'item;"1 234,5"', "04.04");
  equal(
    Object.getOwnPropertyDescriptors(options),
    originalDescriptors,
    "04.05",
  );
  equal(Object.getPrototypeOf(options) === originalPrototype, true, "04.06");
  equal(defaults, originalDefaults, "04.07");
});

test("05 - invalid local and foreign containers retain the ordered error", () => {
  for (const options of [
    [],
    new (class Options {})(),
    Object.create({ delimiter: ";" }),
    Object.create(Object.create(null)),
    runInNewContext("[]"),
    runInNewContext("new (class Options {})()"),
    runInNewContext('Object.create({ delimiter: ";" })'),
    runInNewContext("Object.create(Object.create(null))"),
  ]) {
    throws(
      () => splitEasy("name;value", options),
      /^csv-split-easy\/splitEasy\(\): \[THROW_ID_01\]/,
      "05.01",
    );
    throws(
      () => splitEasy(null, options),
      /^csv-split-easy\/splitEasy\(\): \[THROW_ID_01\]/,
      "05.02",
    );
  }
});

test("06 - falsy options and valid-record delimiter errors keep their policy", () => {
  for (const options of [undefined, null, false, 0, "", NaN]) {
    equal(splitEasy("a,b", options), [["a", "b"]], "06.01");
  }
  throws(
    () => splitEasy("a,b", runInNewContext('({ delimiter: "||" })')),
    /^csv-split-easy\/splitEasy\(\): \[THROW_ID_03\]/,
    "06.02",
  );
  throws(
    () => splitEasy(null, runInNewContext('({ delimiter: ";" })')),
    /^csv-split-easy\/splitEasy\(\): \[THROW_ID_02\]/,
    "06.03",
  );
});

test.run();
