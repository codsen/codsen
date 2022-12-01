import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { createRequire } from "module";

import { cleanChangelogs as c } from "../dist/lerna-clean-changelogs.esm.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

test(`01 - missing 1st arg`, () => {
  throws(() => {
    c();
  }, /THROW_ID_01/g);

  throws(() => {
    c(undefined);
  }, /THROW_ID_01/g);
});

test(`02 - 1st arg of a wrong type`, () => {
  throws(() => {
    c(1);
  }, /THROW_ID_02/g);

  throws(() => {
    c(true);
  }, /THROW_ID_02/g);

  throws(() => {
    c([]);
  }, /THROW_ID_02/g);

  throws(() => {
    c(null);
  }, /THROW_ID_02/g);

  throws(() => {
    c({});
  }, /THROW_ID_02/g);
});

test(`03 - 1st arg is empty string`, () => {
  equal(
    c(""),
    {
      res: "",
      version,
    },
    "03.01"
  );
});

test.run();
