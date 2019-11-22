// avanotonly

// rule: character-encode
// -----------------------------------------------------------------------------

import test from "ava";
import { Linter } from "../../../dist/emlint.esm";
import deepContains from "ast-deep-contains";
import { applyFixes } from "../../../t-util/util";

// 01. basic tests, no config
// -----------------------------------------------------------------------------

test(`01.01 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`, t => {
  const str = "fsdhkfdfgh kj ";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": 2
    }
  });
  t.deepEqual(messages, []);
  t.is(applyFixes(str, messages), str);
});

test(`01.02 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": 2
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&pound;100");
});

test(`01.03 - ${`\u001b[${36}m${`no config`}\u001b[${39}m`} - unencoded characters`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      all: 1
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&pound;100");
});

// 02. basic tests, no config
// -----------------------------------------------------------------------------

test(`02.01 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - named`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "named"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&pound;100");
});

test(`02.02 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - numeric`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "numeric"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#xA3;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&#xA3;100");
});

test(`02.03 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - missing`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&pound;100");
});

test(`02.04 - ${`\u001b[${32}m${`with config`}\u001b[${39}m`} - unrecognised`, t => {
  const str = "£100";
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "yo"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&pound;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&pound;100");
});

// 03. Email-unfriendly entities
// -----------------------------------------------------------------------------

test(`03.01 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`, t => {
  const str = "\u0424"; // &Fcy; or Ф
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": 1
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 1,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&#x424;");
});

test(`03.02 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`, t => {
  const str = "\u0424"; // &Fcy; or Ф
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "named"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&#x424;");
});

test(`03.03 - ${`\u001b[${33}m${`email-unfriendly`}\u001b[${39}m`} - email not-friendly named char`, t => {
  const str = "\u0424"; // &Fcy; or Ф
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "numeric"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x424;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&#x424;");
});

// 04. visible HTML-unfriendly characters within ASCII
// -----------------------------------------------------------------------------

test(`04.01 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into named`, t => {
  const str = `<>'"&`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "named"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&lt;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[1, 2, "&gt;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[3, 4, "&quot;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[4, 5, "&amp;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&lt;&gt;'&quot;&amp;");
});

test(`04.02 - ${`\u001b[${33}m${`HTML-unfriendly`}\u001b[${39}m`} - brackets and quotes into numeric`, t => {
  const str = `<>'"&`;
  const linter = new Linter();
  const messages = linter.verify(str, {
    rules: {
      "character-encode": [2, "numeric"]
    }
  });
  deepContains(
    messages,
    [
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 0,
        idxTo: 1,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[0, 1, "&#x3C;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 1,
        idxTo: 2,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[1, 2, "&#x3E;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 3,
        idxTo: 4,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[3, 4, "&#x22;"]]
        }
      },
      {
        ruleId: "character-encode",
        severity: 2,
        idxFrom: 4,
        idxTo: 5,
        line: 1,
        message: "Unencoded character.",
        fix: {
          ranges: [[4, 5, "&#x26;"]]
        }
      }
    ],
    t.is,
    t.fail
  );
  t.is(applyFixes(str, messages), "&#x3C;&#x3E;'&#x22;&#x26;");
});
