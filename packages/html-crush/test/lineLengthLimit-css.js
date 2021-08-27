import tap from "tap";
import { m } from "./util/util.js";

tap.test(
  `01 - ${`\u001b[${33}m${`css line length limit`}\u001b[${39}m`} - basic`,
  (t) => {
    t.match(
      m(
        t,
        `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
        {
          lineLengthLimit: 50,
          removeIndentations: true,
          removeLineBreaks: true,
        }
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
      "01.01"
    );
    t.match(
      m(
        t,
        `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
        {
          lineLengthLimit: 50,
          removeIndentations: true,
          removeLineBreaks: false,
        }
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
      "01.02"
    );
    t.match(
      m(
        t,
        `<style>
.aa { font-size:1px; line-height:1px; color: #333333; display: inline-block; margin: 0; padding: 0; text-decoration: none; }
</style><body>zzz</body>`,
        {
          lineLengthLimit: 50,
          removeIndentations: false,
          removeLineBreaks: false,
        }
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
      "01.03"
    );
    t.end();
  }
);
