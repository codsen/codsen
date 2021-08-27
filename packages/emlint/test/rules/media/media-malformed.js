import tap from "tap";
import { applyFixes, verify } from "../../../t-util/util.js";
// import { deepContains } from "ast-deep-contains");

// 01. no config
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - off`,
  (t) => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const messages = verify(t, str, {
      rules: {
        "media-malformed": 0,
      },
    });
    t.equal(applyFixes(str, messages), str, "01.01");
    t.strictSame(messages, [], "01.02");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - warn`,
  (t) => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const messages = verify(t, str, {
      rules: {
        "media-malformed": 1,
      },
    });
    t.equal(applyFixes(str, messages), str, "02.01");
    t.strictSame(messages, [], "02.02");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - correct - error`,
  (t) => {
    const str = `<style>
  @media screen and (color), projection and (color) {zzz}
</style>`;
    const messages = verify(t, str, {
      rules: {
        "media-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "03.01");
    t.strictSame(messages, [], "03.02");
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${`no config`}\u001b[${39}m`} - screeen`,
  (t) => {
    const str = `<style>
  @media screeen and (color), projection and (color) {zzz}
</style>`;
    const messages = verify(t, str, {
      rules: {
        "media-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "04.01");
    t.match(
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
    t.end();
  }
);

// 02. False positives
// -----------------------------------------------------------------------------

tap.test(
  `05 - ${`\u001b[${33}m${`false positives`}\u001b[${39}m`} - not media`,
  (t) => {
    const str = `<style>
  @supports screeen and (color), projection and (color) {zzz}
</style>`;
    const messages = verify(t, str, {
      rules: {
        "media-malformed": 2,
      },
    });
    t.equal(applyFixes(str, messages), str, "05.01");
    t.strictSame(messages, [], "05.02");
    t.end();
  }
);
