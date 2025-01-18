import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

test(`01 - ${`\u001b[${33}m${"css line length limit"}\u001b[${39}m`} - basic`, () => {
  compare(
    ok,
    m(
      equal,
      `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
      {
        lineLengthLimit: 50,
        removeIndentations: true,
        removeLineBreaks: true,
      },
    ),
    {
      result: `<style>.aa{font-size:1px;line-height:1px;color:
#333333;display:inline-block;margin:0;padding:0;
text-decoration:none;}
</style>
<body>zzz
</body>`,
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.01",
  );
  compare(
    ok,
    m(
      equal,
      `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
      {
        lineLengthLimit: 50,
        removeIndentations: true,
        removeLineBreaks: false,
      },
    ),
    {
      result: `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.02",
  );
  compare(
    ok,
    m(
      equal,
      `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
      {
        lineLengthLimit: 50,
        removeIndentations: false,
        removeLineBreaks: false,
      },
    ),
    {
      result: `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
      applicableOpts: {
        removeHTMLComments: false,
        removeCSSComments: false,
      },
    },
    "01.03",
  );
});

test.run();
