import tap from "tap";
// import { det as det1 } from "../dist/detergent.esm.js";
import { det, mixer } from "../t-util/util.js";

tap.test(
  `01 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - healthy tag pair`,
  (t) => {
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `text <a>text</a> text`, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      stripHtml: false,
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
  `02 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - closing tag without a slash`,
  (t) => {
    const input = `text <a>text<a> text`;
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, input, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - unrecognised tag`,
  (t) => {
    const input = `text <error>text<error> text`;
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, input, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips nonsense tags`,
  (t) => {
    const input =
      'text <sldkfj asdasd="lekjrtt" lgkdjfld="lndllkjfg">text<hgjkd> text';
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, input, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips legit HTML`,
  (t) => {
    const input = 'text <a href="#" style="display: block;">text</a> text';
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, input, opt).res,
        "text text text",
        JSON.stringify(opt, null, 4)
      );
    });
    mixer({
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips non-ignored singleton tags`,
  (t) => {
    const input = "<hr>";
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, "", JSON.stringify(opt, null, 4));
    });
    mixer({
      stripHtml: false,
      useXHTML: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    mixer({
      stripHtml: false,
      useXHTML: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, "<hr/>", JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - custom ignored singleton tag`,
  (t) => {
    mixer({
      stripHtml: true,
      useXHTML: false,
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
  `08 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - removes slash`,
  (t) => {
    mixer({
      stripHtml: true,
      useXHTML: false,
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
  `09 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - adds slash`,
  (t) => {
    mixer({
      useXHTML: true,
      stripHtml: true,
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
  `10 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - keeps slash`,
  (t) => {
    mixer({
      useXHTML: true,
      stripHtml: true,
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
  `11 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `12 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: false,
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
  `13 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      stripHtml: false,
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
  `14 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - opts.useXHTML - minimal case`,
  (t) => {
    mixer({
      convertEntities: true,
      stripHtml: false,
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
  `15 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: false,
      }).res,
      "<div>",
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: false,
      }).res,
      "<a>",
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: false,
      }).res,
      '<a style="font-size: red;">',
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, `<div>`, {
        stripHtml: true,
      }).res,
      "",
      "18"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag, lowercase`,
  (t) => {
    t.equal(
      det(t, 0, `<a>`, {
        stripHtml: true,
      }).res,
      "",
      "19"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag, uppercase`,
  (t) => {
    const input = `<A>`;
    mixer({
      stripHtml: true,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, "", JSON.stringify(opt, null, 4));
    });
    mixer({
      stripHtml: false,
    }).forEach((opt, n) => {
      t.equal(det(t, n, input, opt).res, input, JSON.stringify(opt, null, 4));
    });
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - single tag`,
  (t) => {
    t.equal(
      det(t, 0, '<a style="font-size: red;">', {
        stripHtml: true,
      }).res,
      "",
      "21"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `23 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `24 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `25 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - strips <script> tags incl. contents`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `26 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> tags with whitespace within closing tags`,
  (t) => {
    mixer({
      stripHtml: true,
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
  `27 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: true,
      stripHtml: true,
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
  `28 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - <script> sneaky case`,
  (t) => {
    mixer({
      removeLineBreaks: false,
      removeWidows: true,
      stripHtml: true,
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
  `29 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `30 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining b tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `31 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `32 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - tag pair's closing tag's slash is put on a wrong side`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being < b >set in bold< b /> here`, opt).res,
        "test text is being <b>set in bold</b> here",
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
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <B>set in bold<B/> here`, opt).res,
        "test text is being <B>set in bold</B> here",
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
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being <b class="h">set in bold<b/> here`, opt)
          .res,
        `test text is being <b class="h">set in bold</b> here`,
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `36 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `37 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining i tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(t, n, `test text is being < I >set in italic<   I /> here`, opt)
          .res,
        "test text is being <I>set in italic</I> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `39 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `40 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          'test text is being < StRoNg >set in bold<StRoNg class="z1" / > here',
          opt
        ).res,
        `test text is being <StRoNg>set in bold</StRoNg class="z1"> here`,
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
      removeWidows: false,
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
  `42 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
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
  `43 - ${`\u001b[${32}m${`strip HTML`}\u001b[${39}m`} - retaining strong tags by default`,
  (t) => {
    mixer({
      removeWidows: false,
    }).forEach((opt, n) => {
      t.equal(
        det(
          t,
          n,
          `test text is being < em >set in emphasis<  em  / > here`,
          opt
        ).res,
        "test text is being <em>set in emphasis</em> here",
        JSON.stringify(opt, null, 4)
      );
    });
    t.end();
  }
);

tap.test(`44 - widow removal is aware of surrounding html`, (t) => {
  const input = `<a b c d>`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, input, opt).res, input, "46.01");
  });
  t.end();
});

tap.test(`45 - widow removal is aware of surrounding html`, (t) => {
  const input = `<a w="1" x="y" z="x">\n<!--[if (gte mso 9)|(IE)]>\n<td a="b:c;" d="e" f="g">`;
  mixer({
    removeWidows: true,
    convertEntities: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
    stripHtml: false,
  }).forEach((opt, n) => {
    t.equal(det(t, n, input, opt).res, input, "47.01");
  });
  t.end();
});

tap.test(`46 - a JSX pattern`, (t) => {
  const input = `<A b>c</A>
</>< /></ >< / >`;
  mixer({
    stripHtml: true,
  }).forEach((opt, n) => {
    t.equal(det(t, n, input, opt).res, "c", "48.01");
  });
  mixer({
    stripHtml: false,
    replaceLineBreaks: false,
    removeLineBreaks: false,
  }).forEach((opt, n) => {
    t.equal(
      det(t, n, input, opt).res,
      `<A b>c</A>
</></></></>`,
      "48.02"
    );
  });
  t.end();
});
