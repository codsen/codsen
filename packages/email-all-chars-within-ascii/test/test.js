/* eslint no-tabs: 0 */

const t = require("tap");
const within = require("../dist/email-all-chars-within-ascii.cjs");

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01 - wrong/missing input = throw", (t) => {
  t.throws(() => {
    within();
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    within(true);
  }, /THROW_ID_01/g);

  t.end();
});

t.test("01.02 - wrong opts = throw", (t) => {
  t.throws(() => {
    within("aaaa", true); // not object but bool
  }, /THROW_ID_02/g);
  t.throws(() => {
    within("aaaa", 1); // not object but number
  }, /THROW_ID_02/g);
  t.doesNotThrow(() => {
    within("aaaa", undefined); // hardcoded "nothing" is ok!
  });
  t.doesNotThrow(() => {
    within("aaaa", null); // null fine too - that's hardcoded "nothing"
  });
  t.doesNotThrow(() => {
    within("aaaa", { messageOnly: false }); // no rogue keys.
  });

  t.end();
});

t.test("01.03 - 1000 chars line = throw", (t) => {
  t.throws(() => {
    // 1000 chars on 3rd line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
  }, /beyond 999/g);
  t.doesNotThrow(() => {
    // 1000 chars on 3rd line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      { checkLineLength: false }
    );
  });
  t.doesNotThrow(() => {
    // 999 chars line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
  });

  // opts.messageOnly
  t.throws(() => {
    // 1000 chars on 3rd line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      { messageOnly: true }
    );
  }, /beyond 999/g);
  t.doesNotThrow(() => {
    // 1000 chars on 3rd line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      { checkLineLength: false, messageOnly: true }
    );
  });
  t.doesNotThrow(() => {
    // 999 chars line
    within(
      "yyy\nzzz\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      { messageOnly: true }
    );
  });

  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use
// -----------------------------------------------------------------------------

t.test("02.00 - NULL control char (dec. 0) is not ok", (t) => {
  t.throws(() => {
    within("\u0000");
  }, /point is 0/g);
  t.throws(() => {
    within("\u0000", { messageOnly: true });
  }, /point is 0/g);
  t.end();
});

t.test("02.01 - SOH control char (dec. 1) is not ok", (t) => {
  t.throws(() => {
    within("\u0001");
  }, /point is 1/g);
  t.throws(() => {
    within("\u0001", { messageOnly: true });
  }, /point is 1/g);
  t.end();
});

t.test("02.02 - STX control char (dec. 2) is not ok", (t) => {
  t.throws(() => {
    within("\u0002");
  }, /point is 2/g);
  t.throws(() => {
    within("\u0002", { messageOnly: true });
  }, /point is 2/g);
  t.end();
});

t.test("02.03 - ETX control char (dec. 3) is not ok", (t) => {
  t.throws(() => {
    within("\u0003");
  }, /point is 3/g);
  t.end();
});

t.test("02.04 - EOT control char (dec. 4) is not ok", (t) => {
  t.throws(() => {
    within("\u0004");
  }, /point is 4/g);
  t.end();
});

t.test("02.05 - ENQ control char (dec. 5) is not ok", (t) => {
  t.throws(() => {
    within("\u0005");
  }, /point is 5/g);
  t.end();
});

t.test("02.06 - ACK control char (dec. 6) is not ok", (t) => {
  t.throws(() => {
    within("\u0006");
  }, /point is 6/g);
  t.end();
});

t.test("02.07 - BEL control char (dec. 7) is not ok", (t) => {
  t.throws(() => {
    within("\u0007");
  }, /point is 7/g);
  t.end();
});

t.test("02.08 - BS control char (dec. 8) is not ok", (t) => {
  t.throws(() => {
    within("\u0008");
  }, /point is 8/g);
  t.end();
});

t.test("02.09 - HT control char horizontal tabulation (dec. 9) is ok", (t) => {
  t.doesNotThrow(() => {
    within("\u0009");
  });
  t.doesNotThrow(() => {
    within("	");
  });
  t.end();
});

t.test("02.10 - LF new line control character (dec. 10) is ok", (t) => {
  t.doesNotThrow(() => {
    within("\u000A");
  });
  t.end();
});

t.test("02.11 - VT control char (dec. 11) is not ok", (t) => {
  t.throws(() => {
    within("\u000B");
  }, /point is 11/g);
  t.end();
});

t.test("02.12 - FF control char (dec. 12) is not ok", (t) => {
  t.throws(() => {
    within("\u000C");
  }, /point is 12/g);
  t.end();
});

t.test("02.13 - CR control char (dec. 13) is ok", (t) => {
  t.doesNotThrow(() => {
    within("\u000D");
  });
  t.end();
});

t.test("02.14 - SO control char (dec. 14) is not ok", (t) => {
  t.throws(() => {
    within("\u000E");
  }, /point is 14/g);
  t.end();
});

t.test("02.15 - SI control char (dec. 15) is not ok", (t) => {
  t.throws(() => {
    within("\u000F");
  }, /point is 15/g);
  t.end();
});

t.test("02.16 - DLE control char (dec. 16) is not ok", (t) => {
  t.throws(() => {
    within("\u0010");
  }, /point is 16/g);
  t.end();
});

t.test("02.17 - DC1 control char (dec. 17) is not ok", (t) => {
  t.throws(() => {
    within("\u0011");
  }, /point is 17/g);
  t.end();
});

t.test("02.18 - DC2 control char (dec. 18) is not ok", (t) => {
  t.throws(() => {
    within("\u0012");
  }, /point is 18/g);
  t.end();
});

t.test("02.19 - DC3 control char (dec. 19) is not ok", (t) => {
  t.throws(() => {
    within("\u0013");
  }, /point is 19/g);
  t.end();
});

t.test("02.20 - DC4 control char (dec. 20) is not ok", (t) => {
  t.throws(() => {
    within("\u0014");
  }, /point is 20/g);
  t.end();
});

t.test("02.21 - NA control char (dec. 21) is not ok", (t) => {
  t.throws(() => {
    within("\u0015");
  }, /point is 21/g);
  t.end();
});

t.test("02.22 - SI control char (dec. 22) is not ok", (t) => {
  t.throws(() => {
    within("\u0016");
  }, /point is 22/g);
  t.end();
});

t.test("02.23 - EOTB control char (dec. 23) is not ok", (t) => {
  t.throws(() => {
    within("\u0017");
  }, /point is 23/g);
  t.end();
});

t.test("02.24 - CANCL control char (dec. 24) is not ok", (t) => {
  t.throws(() => {
    within("\u0018");
  }, /point is 24/g);
  t.end();
});

t.test("02.25 - EOM control char (dec. 25) is not ok", (t) => {
  t.throws(() => {
    within("\u0019");
  }, /point is 25/g);
  t.end();
});

t.test("02.26 - SUBS control char (dec. 26) is not ok", (t) => {
  t.throws(() => {
    within("\u001A");
  }, /point is 26/g);
  t.end();
});

t.test("02.27 - ESC control char (dec. 27) is not ok", (t) => {
  t.throws(() => {
    within("\u001B");
  }, /point is/g);
  t.end();
});

t.test("02.28 - IS4 control char (dec. 28) is not ok", (t) => {
  t.throws(() => {
    within("\u001C");
  }, /point is/g);
  t.end();
});

t.test("02.29 - IS3 control char (dec. 29) is not ok", (t) => {
  t.throws(() => {
    within("\u001D");
  }, /point is/g);
  t.end();
});

t.test("02.30 - IS2 control char (dec. 30) is not ok", (t) => {
  t.throws(() => {
    within("\u001E");
  }, /point is/g);
  t.end();
});

t.test("02.31 - IS1 control char (dec. 31) is not ok", (t) => {
  t.throws(() => {
    within("\u001F");
  }, /point is/g);
  t.end();
});

t.test("02.32 - space (dec. 32) is ok", (t) => {
  t.doesNotThrow(() => {
    within("\u0020");
  });
  t.end();
});

t.test("02.33 - delete (dec. 127) is not cool!", (t) => {
  t.throws(() => {
    within("\u007F");
  }, /point is/g);
  t.throws(() => {
    within("\u007F", { messageOnly: true });
  }, /point is/g);
  t.end();
});

// -----------------------------------------------------------------------------
// group 03. some code for kicks
// -----------------------------------------------------------------------------

t.test(
  "03.01 - some random HTML for fun - whole EMAILCOMB.COM website",
  (t) => {
    t.doesNotThrow(() => {
      within(`<!DOCTYPE html>
    <!--
     _______  __   __  _______  ___   ___            _______  _______  __   __  _______
    |       ||  |_|  ||   _   ||   | |   |          |       ||       ||  |_|  ||  _    |
    |    ___||       ||  |_|  ||   | |   |          |       ||   _   ||       || |_|   |
    |   |___ |       ||       ||   | |   |          |       ||  | |  ||       ||       |
    |    ___||       ||       ||   | |   |___       |      _||  |_|  ||       ||  _   |
    |   |___ | ||_|| ||   _   ||   | |       |      |     |_ |       || ||_|| || |_|   |
    |_______||_|   |_||__| |__||___| |_______|      |_______||_______||_|   |_||_______|

    This is a GUI for https://github.com/codsen/email-remove-unused-css
    Made by Roy @ Codsen Ltd (R)
    -->
    <html>
    <head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<title>EmailComb - Removes unused CSS from email</title>

	<link rel="stylesheet" href="styles/main.min.css">

	<meta property="og:title" content="EmailComb"/>
	<meta property="og:url" content="https://emailcomb.com"/>
	<meta property="og:image" content="https://emailcomb.com/emailcomb-screenshot.png"/>
	<meta property="og:site-name" content="EmailComb"/>
	<meta property="og:description" content="Removes the unused CSS from email templates."/>

	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="@revelto">
	<meta name="twitter:title" content="EmailComb">
	<meta name="twitter:description" content="Removes the unused CSS from email templates.">
	<meta name="twitter:creator" content="@revelto">
	<meta name="twitter:image:src" content="https://emailcomb.com/emailcomb-screenshot.png">

	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
	<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
	<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
	<link rel="manifest" href="/manifest.json">
	<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
	<meta name="theme-color" content="#ffffff">

    </head>
    <body>
    <div id="root">
    </div>
    </body>
    </html>
`);
    });
    t.end();
  }
);
