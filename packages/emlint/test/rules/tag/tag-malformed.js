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

tap.test(`04 - two tags, tight`, (t) => {
  const str = `<div class=""div class="x">`;
  const fixed = `<div class=""><div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04");
  t.end();
});

tap.test(`05 - two tags, spaced`, (t) => {
  const str = `<div class="" div class="x">`;
  const fixed = `<div class=""> <div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05");
  t.end();
});

tap.test(`06 - two tags, attr`, (t) => {
  const str = `<div class="z" div class="x">`;
  const fixed = `<div class="z"> <div class="x">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06");
  t.end();
});

tap.test(`07 - malformed closing tag, recognised`, (t) => {
  const str = `<div>some text /div>`;
  const fixed = `<div>some text </div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07");
  t.end();
});

tap.test(`08 - malformed closing tag, unrecognised`, (t) => {
  const str = `<div>some text /yo>`;
  const fixed = `<div>some text </yo>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08");
  t.end();
});

// closing bracket missing
// -----------------------------------------------------------------------------

tap.test(`09 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div`;
  const fixed = `<div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09.01");
  t.equal(messages.length, 1, "09.02");
  t.end();
});

tap.test(`10 - position of a missing bracket is on EOL`, (t) => {
  const str = `<div></div`;
  const fixed = `<div></div>`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "10.01");
  t.equal(messages.length, 1, "10.02");
  t.end();
});

tap.test(`11 - attrs`, (t) => {
  const str = `<div class="z"`;
  const fixed = `<div class="z">`;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "11.01");
  t.equal(messages.length, 1, "11.02");
  t.end();
});

tap.test(`12 - attrs, trailing whitespace`, (t) => {
  const str = `<div class="z"   `;
  const fixed = `<div class="z">   `;
  const messages = verify(t, str, {
    rules: {
      "tag-malformed": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12.01");
  t.equal(messages.length, 1, "12.02");
  t.end();
});

tap.test(
  `13 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div<div>`;
    const fixed = `<div></div><div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "13.01");
    t.equal(messages.length, 1, "13.02");
    t.end();
  }
);

tap.test(
  `14 - position of a missing bracket is on a new opening bracket`,
  (t) => {
    const str = `<div></div\n<div>`;
    const fixed = `<div></div>\n<div>`;
    const messages = verify(t, str, {
      rules: {
        "tag-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), fixed, "14.01");
    t.equal(messages.length, 1, "14.02");
    t.end();
  }
);
