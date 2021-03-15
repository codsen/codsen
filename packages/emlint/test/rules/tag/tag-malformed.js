import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// closing bracket missing
// -----------------------------------------------------------------------------

tap.test(`01 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div`;
  const fixed = `<div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "01.01");
  t.equal(messages.length, 1, "01.02");
  t.end();
});

tap.test(`02 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div></div`;
  const fixed = `<div></div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.equal(messages.length, 1, "02.02");
  t.end();
});

tap.test(`03 - attrs`, (t) => {
  const str = `<div class="z"`;
  const fixed = `<div class="z">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.equal(messages.length, 1, "03.02");
  t.end();
});

tap.test(`04 - attrs, trailing whitespace`, (t) => {
  const str = `<div class="z"   `;
  const fixed = `<div class="z">   `;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04.01");
  t.equal(messages.length, 1, "04.02");
  t.end();
});

tap.test(
  `05 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div<div>`;
    const fixed = `<div></div><div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "05.01");
    t.equal(messages.length, 1, "05.02");
    t.end();
  }
);

tap.test(
  `06 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div\n<div>`;
    const fixed = `<div></div>\n<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "06.01");
    t.equal(messages.length, 1, "06.02");
    t.end();
  }
);
