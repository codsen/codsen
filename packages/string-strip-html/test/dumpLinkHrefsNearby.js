import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// api peculiarities
// -----------------------------------------------------------------------------

tap.test("01 - opts.dumpLinkHrefsNearby - null", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      {
        dumpLinkHrefsNearby: null,
      }
    ),
    { result: "Let's watch RT news this evening" },
    "01 - control, default behaviour"
  );
  t.end();
});

tap.test("02 - opts.dumpLinkHrefsNearby - undefined", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      {
        dumpLinkHrefsNearby: undefined,
      }
    ),
    { result: "Let's watch RT news this evening" },
    "02 - control, default behaviour"
  );
  t.end();
});

tap.test("03 - opts.dumpLinkHrefsNearby - {}", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      {
        dumpLinkHrefsNearby: {},
      }
    ),
    { result: "Let's watch RT news this evening" },
    "03 - control, default behaviour"
  );
  t.end();
});

tap.test("04 - opts.dumpLinkHrefsNearby - {}", (t) => {
  t.throws(
    () => {
      stripHtml(
        'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
        {
          dumpLinkHrefsNearby: true,
        }
      );
    },
    /THROW_ID_04/,
    "04"
  );
  t.end();
});

// opts.dumpLinkHrefsNearby
// -----------------------------------------------------------------------------

tap.test("05 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening'
    ),
    { result: "Let's watch RT news this evening" },
    "05 - control, default behaviour"
  );
  t.end();
});

tap.test("06 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: false },
      }
    ),
    { result: "Let's watch RT news this evening" },
    "06 - control, hardcoded default"
  );
  t.end();
});

tap.test("07 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.match(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: true },
      }
    ),
    { result: "Let's watch RT news https://www.rt.com/ this evening" },
    "07 - control, default behaviour"
  );
  t.end();
});

tap.test("08 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.match(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@thesun.co.uk" target="_blank">The Sun</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    {
      result:
        "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    },
    "08 - mailto links without customisation"
  );
  t.end();
});

tap.test("09 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.match(
    stripHtml(
      'Here\'s the <a href="mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    {
      result:
        "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    },
    "09 - mailto links with customisation"
  );
  t.end();
});

tap.test("10 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.match(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening"
    ),
    { result: "Let's watch RT news this evening" },
    "10 - control, default behaviour"
  );
  t.end();
});

tap.test("11 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.match(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: false },
      }
    ),
    { result: "Let's watch RT news this evening" },
    "11 - control, hardcoded default"
  );
  t.end();
});

tap.test("12 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.match(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: true },
      }
    ),
    { result: "Let's watch RT news https://www.rt.com/ this evening" },
    "12 - control, default behaviour"
  );
  t.end();
});

tap.test("13 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.match(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@thesun.co.uk' target='_blank'>The Sun</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    {
      result:
        "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    },
    "13 - mailto links without customisation"
  );
  t.end();
});

tap.test("14 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.match(
    stripHtml(
      "Here's the <a href='mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    {
      result:
        "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    },
    "14 - mailto links with customisation"
  );
  t.end();
});

tap.test(
  "15 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured",
  (t) => {
    t.match(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ'),
      { result: "Let's watch" },
      "15 - control, default behaviour"
    );
    t.end();
  }
);

tap.test(
  "16 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured",
  (t) => {
    t.match(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ', {
        dumpLinkHrefsNearby: { enabled: true },
      }),
      { result: "Let's watch https://www.rt.com/" },
      "16 - only href contents are left after stripping"
    );
    t.end();
  }
);

tap.test("17 - opts.dumpLinkHrefsNearby - linked image", (t) => {
  t.match(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    { result: "a b" },
    "17 - control, default"
  );
  t.end();
});

tap.test(
  "18 - opts.dumpLinkHrefsNearby - linked image, dumpLinkHrefsNearby=off",
  (t) => {
    t.match(
      stripHtml(
        `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
        { dumpLinkHrefsNearby: { enabled: false } }
      ),
      { result: "a b" },
      "18 - control, hardcoded default"
    );
    t.end();
  }
);

tap.test(
  "19 - opts.dumpLinkHrefsNearby - linked image, dumpLinkHrefsNearby=on",
  (t) => {
    t.match(
      stripHtml(
        `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
        { dumpLinkHrefsNearby: { enabled: true } }
      ),
      { result: "a https://codsen.com b" },
      "19 - dumps href of a linked image"
    );
    t.end();
  }
);

tap.test("20 - opts.dumpLinkHrefsNearby - .putOnNewLine, control", (t) => {
  t.match(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    { result: "a b" },
    "20 - control, default, off"
  );
  t.end();
});

tap.test("21 - opts.dumpLinkHrefsNearby - .putOnNewLine, control", (t) => {
  t.match(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: false, // <-------------   !
        },
      }
    ),
    { result: "a https://codsen.com b" },
    "21 - dumpLinkHrefsNearby = on; putOnNewLine = off"
  );
  t.end();
});

tap.test("22 - opts.dumpLinkHrefsNearby - .putOnNewLine, control", (t) => {
  t.match(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true, // <-------------   !
        },
      }
    ),
    { result: "a\n\nhttps://codsen.com\n\nb" },
    "22 - dumpLinkHrefsNearby = on; putOnNewLine = on"
  );
  t.end();
});

tap.test("23 - opts.dumpLinkHrefsNearby - .putOnNewLine", (t) => {
  t.match(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true,
          wrapHeads: "[", // <-------------  !
          wrapTails: "]", // <-------------  !
        },
      }
    ),
    { result: "a\n\n[https://codsen.com]\n\nb" },
    "23 - dumpLinkHrefsNearby = on; putOnNewLine = on; wrapHeads = on; wrapTails = on;"
  );
  t.end();
});

tap.test(
  "24 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails - control",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`
      ),
      { result: "a z b" },
      "24 - control, default"
    );
    t.end();
  }
);

tap.test(
  "25 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails - default dump",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          dumpLinkHrefsNearby: {
            enabled: true,
          },
        }
      ),
      { result: "a z https://codsen.com b" },
      "25 - heads only"
    );
    t.end();
  }
);

tap.test(
  "26 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails wrap heads only",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapHeads: "[",
          },
        }
      ),
      { result: "a z [https://codsen.com b" },
      "26 - heads only"
    );
    t.end();
  }
);

tap.test(
  "27 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails wrap teads only",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapTails: "]",
          },
        }
      ),
      { result: "a z https://codsen.com] b" },
      "27 - tails only"
    );
    t.end();
  }
);

tap.test(
  "28 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails wrap both",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapHeads: "[",
            wrapTails: "]",
          },
        }
      ),
      { result: "a z [https://codsen.com] b" },
      "28 - tails only"
    );
    t.end();
  }
);

tap.test(
  "29 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails + ignoreTags",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          ignoreTags: "div",
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapHeads: "[",
            wrapTails: "]",
          },
        }
      ),
      { result: "a <div>z</div> [https://codsen.com] b" },
      "29 - ignore on a div only"
    );
    t.end();
  }
);

tap.test(
  "30 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails + ignoreTags",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          ignoreTags: "", // <--------- it's an empty string! Will be ignored.
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapHeads: "[",
            wrapTails: "]",
          },
        }
      ),
      { result: "a z [https://codsen.com] b" },
      "30 - ignore on a div only"
    );
    t.end();
  }
);

tap.test(
  "31 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails + stripTogetherWithTheirContents",
  (t) => {
    t.match(
      stripHtml(
        `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
        {
          stripTogetherWithTheirContents: "div",
          dumpLinkHrefsNearby: {
            enabled: true,
            wrapHeads: "[",
            wrapTails: "]",
          },
        }
      ),
      { result: "a [https://codsen.com] b" },
      "31 - whole div pair is removed"
    );
    t.end();
  }
);
