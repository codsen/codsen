import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm";
import {
  det,
  mixer, // allCombinations
} from "../t-util/util";

tap.test(
  `01.01 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `text <a>text</a> text`, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.02 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`,
  (t) => {
    mixer({
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `text <a>text</a> text`, opt).res,
        "text <a>text</a> text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.03 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - closing tag without a slash`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `text <a>text<a> text`, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.04 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `text <error>text<error> text`, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.05 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips nonsense tags`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'text <sldkfj asdasd="lekjrtt" lgkdjfld="lndllkjfg">text<hgjkd> text',
          opt
        ).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.06 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips legit HTML`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, 'text <a href="#" style="display: block;">text</a> text', opt)
          .res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.07 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips non-ignored singleton tags`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `<hr>`, opt).res, "", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `01.08 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - HTML stripping disabled`,
  (t) => {
    mixer({
      stripHtml: 0,
      useXHTML: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, `<hr>`, opt).res, "<hr>", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `01.09 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - HTML stripping disabled`,
  (t) => {
    mixer({
      stripHtml: 0,
      useXHTML: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `<hr>`, opt).res,
        "<hr/>",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.10 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - custom ignored singleton tag`,
  (t) => {
    mixer({
      stripHtml: 1,
      useXHTML: 0,
      stripHtmlButIgnoreTags: ["hr"],
    }).forEach((opt, i) => {
      t.equal(
        det(t, 0, `<hr>`, opt).res,
        "<hr>",
        `opt #${i}:\n${JSON.stringify(opt, null, 4)}`
      );
    });
    t.end();
  }
);

tap.test(
  `01.11 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - removes slash`,
  (t) => {
    mixer({
      stripHtml: 1,
      useXHTML: 0,
      stripHtmlButIgnoreTags: ["hr"],
    }).forEach((opt, i) => {
      t.equal(
        det(t, 0, `<hr/>`, opt).res,
        "<hr>",
        `opt #${i}:\n${JSON.stringify(opt, null, 4)}`
      );
    });
    t.end();
  }
);

tap.test(
  `01.12 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - adds slash`,
  (t) => {
    mixer({
      useXHTML: 1,
      stripHtml: 1,
      stripHtmlButIgnoreTags: ["hr"],
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `<hr>`, opt).res,
        "<hr/>",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.13 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - keeps slash`,
  (t) => {
    mixer({
      useXHTML: 1,
      stripHtml: 1,
      stripHtmlButIgnoreTags: ["hr"],
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `<hr>`, opt).res,
        "<hr/>",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.14 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<div>b</div>c`, opt).res,
        "a b c",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.15 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<div>b</div>c`, opt).res,
        "a<div>b</div>c",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.16 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\u0000a\u0001<div>\u0002b\u0002</div>\u0004c\u0005`, opt)
          .res,
        "a<div>b</div>c",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.17 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      convertEntities: 1,
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `\u00A3a\u00A3<div>\u00A3b\u00A3</div>\u00A3c\u00A3`, opt)
          .res,
        "&pound;a&pound;<div>&pound;b&pound;</div>&pound;c&pound;",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.18 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: 0,
      }).res,
      "<div>"
    );
    t.end();
  }
);

tap.test(
  `01.19 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: 0,
      }).res,
      "<a>"
    );
    t.end();
  }
);

tap.test(
  `01.20 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: 0,
      }).res,
      '<a style="font-size: red;">'
    );
    t.end();
  }
);

tap.test(
  `01.21 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: 1,
      }).res,
      ""
    );
    t.end();
  }
);

tap.test(
  `01.22 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: 1,
      }).res,
      ""
    );
    t.end();
  }
);

tap.test(
  `01.23 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: 1,
      }).res,
      ""
    );
    t.end();
  }
);

tap.test(
  `01.24 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<script>var i = 0;</script>b`, opt).res,
        "a b",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.25 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `<script>var i = 0;</script>b`, opt).res,
        "b",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.26 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<script>var i = 0;</script>`, opt).res,
        "a",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.27 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `<script>var i = 0;</script>`, opt).res,
        "",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.28 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> tags with whitespace within closing tags`,
  (t) => {
    mixer({
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<script>var i = 0;</script        >b`, opt).res,
        "a b",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.29 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
  (t) => {
    mixer({
      removeLineBreaks: 0,
      removeWidows: 1,
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<script>var i = 0;</script        `, opt).res,
        "a",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.30 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
  (t) => {
    mixer({
      removeLineBreaks: 0,
      removeWidows: 1,
      stripHtml: 1,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a<script>var i = 0;</script`, opt).res,
        "a",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.31 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'test text is being <b class="test" id="br">set in bold</b> here',
          opt
        ).res,
        'test text is being <b class="test" id="br">set in bold</b> here',
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.32 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'test text is being < b class="test" >set in bold< /  b > here',
          opt
        ).res,
        'test text is being <b class="test">set in bold</b> here',
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.33 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `a <sup>c<sup/> d`, opt).res,
        "a <sup>c</sup> d",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.34 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being < B >set in bold< B /> here`, opt).res,
        "test text is being <b>set in bold</b> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.35 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <B>set in bold<B/> here`, opt).res,
        "test text is being <b>set in bold</b> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.36 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <B class="h">set in bold<B/> here`, opt)
          .res,
        `test text is being <b class="h">set in bold</b> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.37 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <i>set in italic</i> here`, opt).res,
        "test text is being <i>set in italic</i> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.38 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being < i >set in italic< /  i > here`, opt)
          .res,
        "test text is being <i>set in italic</i> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.39 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being < I >set in italic<   I /> here`, opt)
          .res,
        "test text is being <i>set in italic</i> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.40 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `test text is being <strong id="main">set in bold</ strong> here`,
          opt
        ).res,
        `test text is being <strong id="main">set in bold</strong> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.41 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `test text is being <strong id="main">set in bold<strong/> here`,
          opt
        ).res,
        `test text is being <strong id="main">set in bold</strong> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.42 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'test text is being < StRoNg >set in bold<StRoNg class="wrong1" / > here',
          opt
        ).res,
        `test text is being <strong>set in bold</strong class="wrong1"> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.43 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <em>set in emphasis</em> here`, opt).res,
        "test text is being <em>set in emphasis</em> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.44 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'test text is being <em id="main">set in emphasis<em/> here',
          opt
        ).res,
        `test text is being <em id="main">set in emphasis</em> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `01.45 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: 0,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `test text is being < eM >set in emphasis<  Em  / > here`,
          opt
        ).res,
        "test text is being <em>set in emphasis</em> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

// ==============================
// 02. opts.stripHtmlButIgnoreTags
// ==============================

tap.test(
  `02.01 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - simple case`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`).res,
      "a z c",
      "11.01 - control"
    );
    t.end();
  }
);

tap.test(
  `02.02 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
      }).res,
      "a <a>z</a> c"
    );
    t.end();
  }
);

tap.test(
  `02.03 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
      }).res,
      "a <a>z</a> c"
    );
    t.end();
  }
);

tap.test(
  `02.04 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        removeWidows: false,
      }).res,
      "a <div> z </div> c"
    );
    t.end();
  }
);

tap.test(
  `02.05 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        removeWidows: false,
      }).res,
      "a <div> z </div> c"
    );
    t.end();
  }
);

tap.test(
  `02.06 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.07 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        removeWidows: false,
      }).res,
      "a z c"
    );
    t.end();
  }
);

tap.test(
  `02.08 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - control for stripHtml`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`).res,
      "a z c",
      "11.08 - control"
    );
    t.end();
  }
);

tap.test(
  `02.09 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - no ignores`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.10 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - no ignores`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a z c"
    );
    t.end();
  }
);

tap.test(
  `02.11 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.12 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <a>z</a> c"
    );
    t.end();
  }
);

tap.test(
  `02.13 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.14 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <a>z</a> c"
    );
    t.end();
  }
);

tap.test(
  `02.15 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.16 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div> z </div> c"
    );
    t.end();
  }
);

tap.test(
  `02.17 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.18 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div> z </div> c"
    );
    t.end();
  }
);

tap.test(
  `02.19 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.20 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.21 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c"
    );
    t.end();
  }
);

tap.test(
  `02.22 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a z c"
    );
    t.end();
  }
);

tap.test(
  `02.23 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: [],
        stripHtml: true,
      }).res,
      ""
    );
    t.end();
  }
);

tap.test(
  `02.24 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtml: true,
      }).res,
      "<sup>"
    );
    t.end();
  }
);

tap.test(
  `02.25 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: ["sup"],
        stripHtml: true,
      }).res,
      "<sup>"
    );
    t.end();
  }
);

tap.test(
  `02.26 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: true,
      }).res,
      ""
    );
    t.end();
  }
);

tap.test(
  `02.27 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["a", "b", "c"],
        stripHtml: true,
      }).res,
      "<a><b><c>"
    );
    t.end();
  }
);

tap.test(
  `02.28 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "b", "c"],
        stripHtml: true,
      }).res,
      "<sup> <b><c>"
    );
    t.end();
  }
);

tap.test(
  `02.29 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "a", "c"],
        stripHtml: true,
      }).res,
      "<sup><a> <c>"
    );
    t.end();
  }
);

tap.test(
  `02.30 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "a", "b"],
        stripHtml: true,
      }).res,
      "<sup><a><b>"
    );
    t.end();
  }
);

// 03. stripping off
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - ${`\u001b[${31}m${`opts.stripHtmlButIgnoreTags off`}\u001b[${39}m`} - widow removal is aware of surrounding html`,
  (t) => {
    const input = `<a b c d>`;
    // t.equal(
    //   det1(input, {
    //     removeWidows: 1,
    //     convertEntities: 0,
    //     replaceLineBreaks: 0,
    //     removeLineBreaks: 0,
    //     stripHtml: 0
    //   }).res,
    //   input,
    //   "03.01"
    // );
    mixer({
      removeWidows: 1,
      convertEntities: 0,
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, "03.01");
    });
    t.end();
  }
);

tap.test(
  `03.02 - ${`\u001b[${31}m${`opts.stripHtmlButIgnoreTags off`}\u001b[${39}m`} - widow removal is aware of surrounding html`,
  (t) => {
    const input = `<a w="1" x="y" z="x">\n<!--[if (gte mso 9)|(IE)]>\n<td a="b:c;" d="e" f="g">`;
    // t.equal(
    //   det1(input, {
    //     removeWidows: 1,
    //     convertEntities: 0,
    //     replaceLineBreaks: 0,
    //     removeLineBreaks: 0,
    //     stripHtml: 0
    //   }).res,
    //   input,
    //   "03.02"
    // );
    mixer({
      removeWidows: 1,
      convertEntities: 0,
      replaceLineBreaks: 0,
      removeLineBreaks: 0,
      stripHtml: 0,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, "03.02");
    });
    t.end();
  }
);
