// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { compare } from "../../../ops/helpers/shallow-compare.js";
import { m } from "./util/util.js";

test(`01 - css line length limit - basic`, () => {
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
