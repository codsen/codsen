import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../../../ops/helpers/shallow-compare.js";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - off`, () => {
  let str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
  let messages = verify(not, str, {
    rules: {
      "media-malformed": 0,
    },
  });
  equal(applyFixes(str, messages), str, "01.01");
  equal(messages, [], "01.02");
});

test(`02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - warn`, () => {
  let str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
  let messages = verify(not, str, {
    rules: {
      "media-malformed": 1,
    },
  });
  equal(applyFixes(str, messages), str, "02.01");
  equal(messages, [], "02.02");
});

test(`03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - error`, () => {
  let str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
  let messages = verify(not, str, {
    rules: {
      "media-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "03.01");
  equal(messages, [], "03.02");
});

test(`04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - screeen`, () => {
  let str = `<style>
  @media screeen and (color), projection and (color) {zzz}
</style>`;
  let messages = verify(not, str, {
    rules: {
      "media-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "04.01");
  compare(
    ok,
    messages,
    [
      {
        ruleId: "media-malformed",
        severity: 2,
        idxFrom: 17,
        idxTo: 24,
        message: `Unrecognised "screeen".`,
        fix: null,
      },
    ],
    "04.02"
  );
});

// 02. False positives
// -----------------------------------------------------------------------------

test(`05 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - not media`, () => {
  let str = `<style>
  @supports screeen and (color), projection and (color) {zzz}
</style>`;
  let messages = verify(not, str, {
    rules: {
      "media-malformed": 2,
    },
  });
  equal(applyFixes(str, messages), str, "05.01");
  equal(messages, [], "05.02");
});

test.run();
