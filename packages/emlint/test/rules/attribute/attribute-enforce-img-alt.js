import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util";

// the cases
// -----------------------------------------------------------------------------

tap.test(`01 - no attrs, tight, no slash`, (t) => {
  const str = `<img>`;
  const fixed = `<img alt="">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "01.01");
  t.equal(messages.length, 1, "01.02");
  t.end();
});

tap.test(`02 - no attrs, tight, with slash`, (t) => {
  const str = `<img/>`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "02.01");
  t.equal(messages.length, 1, "02.02");
  t.end();
});

tap.test(`03 - no attrs, space, no slash`, (t) => {
  const str = `<img >`;
  const fixed = `<img alt="" >`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "03.01");
  t.equal(messages.length, 1, "03.02");
  t.end();
});

tap.test(`04 - no attrs, space, with slash`, (t) => {
  const str = `<img />`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "04.01");
  t.equal(messages.length, 1, "04.02");
  t.end();
});

tap.test(`05 - no attrs, excessive space, no slash`, (t) => {
  const str = `<img   >`;
  const fixed = `<img alt="" >`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "05.01");
  t.equal(messages.length, 1, "05.02");
  t.end();
});

tap.test(`06 - no attrs, excessive space, no slash, combo #1`, (t) => {
  const str = `<img   >`;
  const fixed = `<img alt="">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
      "tag-space-before-closing-bracket": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "06.01");
  t.equal(messages.length, 2, "06.02");
  t.end();
});

tap.test(`07 - no attrs, excessive space, no slash, combo #2`, (t) => {
  const str = `<img   >`;
  const fixed = `<img alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
      "tag-space-before-closing-bracket": 2,
      "tag-void-slash": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "07.01");
  t.equal(messages.length, 3, "07.02");
  t.end();
});

tap.test(`08 - no attrs, excessive space, with slash`, (t) => {
  const str = `<img   />`;
  const fixed = `<img alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "08.01");
  t.equal(messages.length, 1, "08.02");
  t.end();
});

tap.test(`09 - attrs, tight, no slash`, (t) => {
  const str = `<img src="spacer.gif">`;
  const fixed = `<img src="spacer.gif" alt="">`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "09.01");
  t.match(
    messages,
    [
      {
        ruleId: "attribute-enforce-img-alt",
        severity: 2,
        idxFrom: 0,
        idxTo: 22,
        message: `Add an alt attribute.`,
        fix: {
          ranges: [[21, 21, ' alt=""']],
        },
      },
    ],
    "09.02"
  );
  t.equal(messages.length, 1, "09.03");
  t.end();
});

tap.test(`10 - attrs, tight, slash`, (t) => {
  const str = `<img src="spacer.gif"/>`;
  const fixed = `<img src="spacer.gif" alt=""/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "10.01");
  t.equal(messages.length, 1, "10.02");
  t.end();
});

tap.test(`11 - attrs, space, no slash`, (t) => {
  const str = `<img src="spacer.gif" >`;
  const fixed = `<img src="spacer.gif" alt="" >`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "11.01");
  t.equal(messages.length, 1, "11.02");
  t.end();
});

tap.test(`12 - attrs, space, with slash`, (t) => {
  const str = `<img src="spacer.gif" />`;
  const fixed = `<img src="spacer.gif" alt="" />`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), fixed, "12.01");
  t.equal(messages.length, 1, "12.02");
  t.end();
});

// ERRONEOUS

tap.test(`13 - does not touch all caps alt`, (t) => {
  const str = `<img ALT="zzz"/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "13.01");
  t.equal(messages.length, 0, "13.02");
  t.end();
});

// FALSE POSITIVES

tap.test(`14 - alt within ESP tag`, (t) => {
  const str = `<img{% if foo %} alt="zzz"{% endif %}/>`;
  const messages = verify(t, str, {
    rules: {
      "attribute-enforce-img-alt": 2,
    },
  });
  t.equal(applyFixes(str, messages), str, "14.01");
  t.equal(messages.length, 0, "14.02");
  t.end();
});
