import tap from "tap";
import stripHtml from "../dist/string-strip-html.esm";

// opts.dumpLinkHrefsNearby
// -----------------------------------------------------------------------------

tap.test("01 - opts.dumpLinkHrefsNearby - clean code, double quotes", (t) => {
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening'
    ),
    "Let's watch RT news this evening",
    "01.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "01.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      'Let\'s watch <a href="https://www.rt.com/" target="_blank">RT news</a> this evening',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "01.03 - control, default behaviour"
  );
  t.same(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@thesun.co.uk" target="_blank">The Sun</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "01.04 - mailto links without customisation"
  );
  t.same(
    stripHtml(
      'Here\'s the <a href="mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "01.05 - mailto links with customisation"
  );
  t.end();
});

tap.test("02 - opts.dumpLinkHrefsNearby - clean code, single quotes", (t) => {
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening"
    ),
    "Let's watch RT news this evening",
    "02.01 - control, default behaviour"
  );
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "Let's watch RT news this evening",
    "02.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      "Let's watch <a href='https://www.rt.com/' target='_blank'>RT news</a> this evening",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's watch RT news https://www.rt.com/ this evening",
    "02.03 - control, default behaviour"
  );
  t.same(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@thesun.co.uk' target='_blank'>The Sun</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Let's sell some juicy gossip to the The Sun mailto:gossip@thesun.co.uk right now!",
    "02.04 - mailto links without customisation"
  );
  t.same(
    stripHtml(
      "Here's the <a href='mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "Here's the chief editor's mailto:bob@thesun.co.uk?cc=gossip@thesun.co.uk&subject=look%20what%20Kate%20did%20last%20night email.",
    "02.05 - mailto links with customisation"
  );
  t.end();
});

tap.test(
  "03 - opts.dumpLinkHrefsNearby - dirty code, HTML is chopped but href captured",
  (t) => {
    t.same(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ'),
      "Let's watch",
      "03.01 - control, default behaviour"
    );
    t.same(
      stripHtml('Let\'s watch <a href="https://www.rt.com/" targ', {
        dumpLinkHrefsNearby: { enabled: true },
      }),
      "Let's watch https://www.rt.com/",
      "03.02 - only href contents are left after stripping"
    );
    t.end();
  }
);

tap.test("04 - opts.dumpLinkHrefsNearby - linked image", (t) => {
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "04.01 - control, default"
  );
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: false } }
    ),
    "a b",
    "04.02 - control, hardcoded default"
  );
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      { dumpLinkHrefsNearby: { enabled: true } }
    ),
    "a https://codsen.com b",
    "04.03 - dumps href of a linked image"
  );
  t.end();
});

tap.test("05 - opts.dumpLinkHrefsNearby - .putOnNewLine", (t) => {
  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`
    ),
    "a b",
    "05.01 - control, default, off"
  );

  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: false, // <-------------   !
        },
      }
    ),
    "a https://codsen.com b",
    "05.02 - dumpLinkHrefsNearby = on; putOnNewLine = off"
  );

  // control
  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true, // <-------------   !
        },
      }
    ),
    "a\n\nhttps://codsen.com\n\nb",
    "05.03 - dumpLinkHrefsNearby = on; putOnNewLine = on"
  );

  t.same(
    stripHtml(
      `a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true,
          wrapHeads: "[", // <------------   !
          wrapTails: "]", // <-------------   !
        },
      }
    ),
    "a\n\n[https://codsen.com]\n\nb",
    "05.04 - dumpLinkHrefsNearby = on; putOnNewLine = on; wrapHeads = on; wrapTails = on;"
  );
  t.end();
});

tap.test("06 - opts.dumpLinkHrefsNearby - wrapHeads/wrapTails", (t) => {
  // control
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`
    ),
    "a z b",
    "06.01 - control, default"
  );

  // default dump
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
        },
      }
    ),
    "a z https://codsen.com b",
    "06.02 - heads only"
  );

  // wrap heads only
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
        },
      }
    ),
    "a z [https://codsen.com b",
    "06.03 - heads only"
  );

  // wrap heads only
  t.same(
    stripHtml(
      `a<a href="https://codsen.com" target="_blank"><div>z</div></a>b`,
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapTails: "]",
        },
      }
    ),
    "a z https://codsen.com] b",
    "06.04 - tails only"
  );

  // wrap heads only
  t.same(
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
    "a z [https://codsen.com] b",
    "06.05 - tails only"
  );

  // + ignoreTags
  t.same(
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
    "a <div>z</div> [https://codsen.com] b",
    "06.06 - ignore on a div only"
  );

  // + ignoreTags
  t.same(
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
    "a z [https://codsen.com] b",
    "06.07 - ignore on a div only"
  );

  // + stripTogetherWithTheirContents
  t.same(
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
    "a [https://codsen.com] b",
    "06.08 - whole div pair is removed"
  );
  t.end();
});
