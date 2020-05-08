import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm";
import {
  det,
  mixer, // allCombinations
} from "../t-util/util";

tap.test(
  `01 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`,
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
  `02 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`,
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
  `03 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - closing tag without a slash`,
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
  `04 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - unrecognised tag`,
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
  `05 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips nonsense tags`,
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
  `06 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips legit HTML`,
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
  `07 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips non-ignored singleton tags`,
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
  `08 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - HTML stripping disabled`,
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
  `09 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - HTML stripping disabled`,
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
  `10 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - custom ignored singleton tag`,
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
  `11 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - removes slash`,
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
  `12 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - adds slash`,
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
  `13 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - keeps slash`,
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
  `14 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
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
  `15 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
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
  `16 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
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
  `17 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
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
  `18 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: 0,
      }).res,
      "<div>",
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: 0,
      }).res,
      "<a>",
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: 0,
      }).res,
      '<a style="font-size: red;">',
      "20"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: 1,
      }).res,
      "",
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: 1,
      }).res,
      "",
      "22"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: 1,
      }).res,
      "",
      "23"
    );
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
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
  `25 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
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
  `26 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
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
  `27 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
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
  `28 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> tags with whitespace within closing tags`,
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
  `29 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
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
  `30 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
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
  `31 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
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
  `32 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
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
  `33 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
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
  `34 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
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
  `35 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
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
  `36 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
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
  `37 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
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
  `38 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
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
  `39 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
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
  `40 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `41 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `42 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `43 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `44 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `45 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
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
  `46 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - simple case`,
  (t) => {
    t.equal(det(t, 0, `a <div><a>z</a></div> c`).res, "a z c", "46 - control");
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
      }).res,
      "a <a>z</a> c",
      "47"
    );
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
      }).res,
      "a <a>z</a> c",
      "48"
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        removeWidows: false,
      }).res,
      "a <div> z </div> c",
      "49"
    );
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        removeWidows: false,
      }).res,
      "a <div> z </div> c",
      "50"
    );
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "51"
    );
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        removeWidows: false,
      }).res,
      "a z c",
      "52"
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - control for stripHtml`,
  (t) => {
    t.equal(det(t, 0, `a <div><a>z</a></div> c`).res, "a z c", "53 - control");
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - no ignores`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "54"
    );
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - no ignores`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a z c",
      "55"
    );
    t.end();
  }
);

tap.test(
  `56 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "56"
    );
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "a",
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <a>z</a> c",
      "57"
    );
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "58"
    );
    t.end();
  }
);

tap.test(
  `59 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <a>z</a> c",
      "59"
    );
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "60"
    );
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: "div",
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div> z </div> c",
      "61"
    );
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "62"
    );
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - single tag to ignore, given as string in an array`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["div"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div> z </div> c",
      "63"
    );
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "64"
    );
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - both tags ignored`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["a", "div"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "65"
    );
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        stripHtml: false,
        removeWidows: false,
      }).res,
      "a <div><a>z</a></div> c",
      "66"
    );
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - other tags ignored, not present in the input`,
  (t) => {
    t.equal(
      det(t, 0, `a <div><a>z</a></div> c`, {
        stripHtmlButIgnoreTags: ["article", "z"],
        stripHtml: true,
        removeWidows: false,
      }).res,
      "a z c",
      "67"
    );
    t.end();
  }
);

tap.test(
  `68 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: [],
        stripHtml: true,
      }).res,
      "",
      "68"
    );
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtml: true,
      }).res,
      "<sup>",
      "69"
    );
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: ["sup"],
        stripHtml: true,
      }).res,
      "<sup>",
      "70"
    );
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - one tag`,
  (t) => {
    t.equal(
      det(t, 0, `<sup>`, {
        stripHtmlButIgnoreTags: ["a"],
        stripHtml: true,
      }).res,
      "",
      "71"
    );
    t.end();
  }
);

tap.test(
  `72 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["a", "b", "c"],
        stripHtml: true,
      }).res,
      "<a><b><c>",
      "72"
    );
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "b", "c"],
        stripHtml: true,
      }).res,
      "<sup> <b><c>",
      "73"
    );
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "a", "c"],
        stripHtml: true,
      }).res,
      "<sup><a> <c>",
      "74"
    );
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${35}m${`opts.stripHtmlButIgnoreTags`}\u001b[${39}m`} + ${`\u001b[${33}m${`opts.stripHtml`}\u001b[${39}m`} - ad hoc - four tags`,
  (t) => {
    t.equal(
      det(t, 0, `<sup><a><b><c>`, {
        stripHtmlButIgnoreTags: ["sup", "a", "b"],
        stripHtml: true,
      }).res,
      "<sup><a><b>",
      "75"
    );
    t.end();
  }
);

// 03. stripping off
// -----------------------------------------------------------------------------

tap.test(
  `76 - ${`\u001b[${31}m${`opts.stripHtmlButIgnoreTags off`}\u001b[${39}m`} - widow removal is aware of surrounding html`,
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
  `77 - ${`\u001b[${31}m${`opts.stripHtmlButIgnoreTags off`}\u001b[${39}m`} - widow removal is aware of surrounding html`,
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
