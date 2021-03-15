import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// opening bracket missing
// -----------------------------------------------------------------------------

tap.test(`01 - opening bracket missing`, (t) => {
  const str = `<div>div class="x">`;
  const fixed = `<div><div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "01.01");
  t.equal(messages.length, 1, "01.02");
  t.end();
});

tap.test(`02 - tag - space - missing bracket`, (t) => {
  const str = `<div> div class="x">`;
  const fixed = `<div> <div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.equal(messages.length, 1, "02.02");
  t.end();
});

tap.test(`03 - tag - line break - missing bracket`, (t) => {
  const str = `<div>\n\ndiv class="x">`;
  const fixed = `<div>\n\n<div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.equal(messages.length, 1, "03.02");
  t.end();
});

// closing bracket missing
// -----------------------------------------------------------------------------

tap.test(`04 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div`;
  const fixed = `<div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04.01");
  t.equal(messages.length, 1, "04.02");
  t.end();
});

tap.test(`05 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div></div`;
  const fixed = `<div></div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05.01");
  t.equal(messages.length, 1, "05.02");
  t.end();
});

tap.test(`06 - attrs`, (t) => {
  const str = `<div class="z"`;
  const fixed = `<div class="z">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06.01");
  t.equal(messages.length, 1, "06.02");
  t.end();
});

tap.test(`07 - attrs, trailing whitespace`, (t) => {
  const str = `<div class="z"   `;
  const fixed = `<div class="z">   `;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07.01");
  t.equal(messages.length, 1, "07.02");
  t.end();
});

tap.test(
  `08 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div<div>`;
    const fixed = `<div></div><div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "08.01");
    t.equal(messages.length, 1, "08.02");
    t.end();
  }
);

tap.test(
  `09 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div\n<div>`;
    const fixed = `<div></div>\n<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "09.01");
    t.equal(messages.length, 1, "09.02");
    t.end();
  }
);
