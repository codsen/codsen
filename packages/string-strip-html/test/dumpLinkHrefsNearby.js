import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// api peculiarities
// -----------------------------------------------------------------------------

test("01 - null", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: null,
      },
    ).result,
    "Let's watch news this evening",
    "01.01",
  );
});

test("02 - undefined", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: undefined,
      },
    ).result,
    "Let's watch news this evening",
    "02.01",
  );
});

test("03 - {}", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: {},
      },
    ).result,
    "Let's watch news this evening",
    "03.01",
  );
});

test("04 - {}", () => {
  throws(
    () => {
      stripHtml(
        'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
        {
          dumpLinkHrefsNearby: true,
        },
      );
    },
    /THROW_ID_04/,
    "04.01",
  );
});

// opts.dumpLinkHrefsNearby
// -----------------------------------------------------------------------------

test("05 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
    ).result,
    "Let's watch news this evening",
    "05.01",
  );
});

test("06 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: false },
      },
    ).result,
    "Let's watch news this evening",
    "06.01",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { putOnNewLine: true },
      },
    ).result,
    "Let's watch news this evening",
    "06.02",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapHeads: "z" },
      },
    ).result,
    "Let's watch news this evening",
    "06.03",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapTails: "z" },
      },
    ).result,
    "Let's watch news this evening",
    "06.04",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapHeads: "|", wrapTails: "|" },
      },
    ).result,
    "Let's watch news this evening",
    "06.05",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: {
          putOnNewLine: true,
          wrapHeads: "|",
          wrapTails: "|",
        },
      },
    ).result,
    "Let's watch news this evening",
    "06.06",
  );
});

test("07 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: true },
      },
    ).result,
    "Let's watch news https://www.news.com/ this evening",
    "07.01",
  );
});

test("08 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@codsen.com" target="_blank">Roy</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Let's sell some juicy gossip to the Roy mailto:gossip@codsen.com right now!",
    "08.01",
  );
  equal(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@codsen.com" target="_blank">Roy</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true, wrapHeads: "|" } },
    ).result,
    "Let's sell some juicy gossip to the Roy |mailto:gossip@codsen.com right now!",
    "08.02",
  );
});

test("09 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Here\'s the <a href="mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Here's the chief editor's mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night email.",
    "09.01",
  );
});

test("10 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
    ).result,
    "Let's watch news this evening",
    "10.01",
  );
});

test("11 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: false },
      },
    ).result,
    "Let's watch news this evening",
    "11.01",
  );
});

test("12 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: true },
      },
    ).result,
    "Let's watch news https://www.news.com/ this evening",
    "12.01",
  );
});

test("13 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@codsen.com' target='_blank'>Roy</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Let's sell some juicy gossip to the Roy mailto:gossip@codsen.com right now!",
    "13.01",
  );
});

test("14 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Here's the <a href='mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Here's the chief editor's mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night email.",
    "14.01",
  );
});

test("15 - dirty code, HTML is chopped but href captured", () => {
  equal(
    stripHtml('Let\'s watch <a href="https://www.news.com/" targ').result,
    "Let's watch",
    "15.01",
  );
});

test("16 - dirty code, HTML is chopped but href captured", () => {
  equal(
    stripHtml('Let\'s watch <a href="https://www.news.com/" targ', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "Let's watch https://www.news.com/",
    "16.01",
  );
});

test("17 - linked image", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
    ).result,
    "a b",
    "17.01",
  );
});

test("18 - linked image, dumpLinkHrefsNearby=off", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      { dumpLinkHrefsNearby: { enabled: false } },
    ).result,
    "a b",
    "18.01",
  );
});

test("19 - linked image, dumpLinkHrefsNearby=on", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "a https://codsen.com b",
    "19.01",
  );
});

test("20 - .putOnNewLine, control", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
    ).result,
    "a b",
    "20.01",
  );
});

test("21 - .putOnNewLine, control", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: false, // <-------------   !
        },
      },
    ).result,
    "a https://codsen.com b",
    "21.01",
  );
});

test("22 - .putOnNewLine, control", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true, // <-------------   !
        },
      },
    ).result,
    "a\n\nhttps://codsen.com\n\nb",
    "22.01",
  );
});

test("23 - .putOnNewLine", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          putOnNewLine: true,
          wrapHeads: "[", // <-------------  !
          wrapTails: "]", // <-------------  !
        },
      },
    ).result,
    "a\n\n[https://codsen.com]\n\nb",
    "23.01",
  );
});

test("24 - wrapHeads/wrapTails - control", () => {
  equal(
    stripHtml('a<a href="https://codsen.com" target="_blank"><div>z</div></a>b')
      .result,
    "a z b",
    "24.01",
  );
});

test("25 - wrapHeads/wrapTails - default dump", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
        },
      },
    ).result,
    "a z https://codsen.com b",
    "25.01",
  );
});

test("26 - wrapHeads/wrapTails wrap heads only", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
        },
      },
    ).result,
    "a z [https://codsen.com b",
    "26.01",
  );
});

test("27 - wrapHeads/wrapTails wrap teads only", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapTails: "]",
        },
      },
    ).result,
    "a z https://codsen.com] b",
    "27.01",
  );
});

test("28 - wrapHeads/wrapTails wrap both", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      },
    ).result,
    "a z [https://codsen.com] b",
    "28.01",
  );
});

test("29 - wrapHeads/wrapTails + ignoreTags", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        ignoreTags: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      },
    ).result,
    "a<div>z</div> [https://codsen.com] b",
    "29.01",
  );
});

test("30 - wrapHeads/wrapTails + ignoreTags", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        ignoreTags: "", // <--------- it's an empty string! Will be ignored.
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      },
    ).result,
    "a z [https://codsen.com] b",
    "30.01",
  );
});

test("31 - wrapHeads/wrapTails + stripTogetherWithTheirContents", () => {
  equal(
    stripHtml(
      'a<a href="https://codsen.com" target="_blank"><div>z</div></a>b',
      {
        stripTogetherWithTheirContents: "div",
        dumpLinkHrefsNearby: {
          enabled: true,
          wrapHeads: "[",
          wrapTails: "]",
        },
      },
    ).result,
    "a [https://codsen.com] b",
    "31.01",
  );
});

test("32 - ends with URL - enabled=true, putOnNewLine=false", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "click me https://example.com/",
    "32.01",
  );
});

test("33 - ends with URL - enabled=true, putOnNewLine=true", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "click me\n\nhttps://example.com/",
    "33.01",
  );
});

test("34 - ends with URL - disabled", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: false },
    }).result,
    "click me",
    "34.01",
  );
});

test("35 - ends with URL - enabled=true, putOnNewLine=false", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>\n\n\n\t', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "click me https://example.com/",
    "35.01",
  );
});

test("36 - ends with URL - enabled=true, putOnNewLine=true", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>\n\n\n\t', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "click me\n\nhttps://example.com/",
    "36.01",
  );
});

test("37 - trailing dot + end", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "37.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "37.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "37.03",
  );
  equal(
    stripHtml('A <a href="https://codsen.com">link</a>!', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "A link https://codsen.com",
    "37.04",
  );
  equal(
    stripHtml('Is this a <a href="https://codsen.com">link</a>?', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Is this a link https://codsen.com",
    "37.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com",
    "37.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com",
    "37.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com",
    "37.08",
  );
  equal(
    stripHtml('A <a href="https://codsen.com">link</a>!', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "A link!\n\nhttps://codsen.com",
    "37.09",
  );
  equal(
    stripHtml('Is this a <a href="https://codsen.com">link</a>?', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Is this a link?\n\nhttps://codsen.com",
    "37.10",
  );
});

test("38 - trailing dot + new line", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.\nText.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\nText.",
    "38.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "38.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "38.03",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>!\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "38.04",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>?\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "38.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.\nText.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com\n\nText.",
    "38.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com\n\ntext.",
    "38.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com\n\ntext.",
    "38.08",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>!\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link!\n\nhttps://codsen.com\n\ntext.",
    "38.09",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>?\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link?\n\nhttps://codsen.com\n\ntext.",
    "38.10",
  );
});

test("39 - trailing dot + space + text", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>. Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "39.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>, text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com text.",
    "39.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>; text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com text.",
    "39.03",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>! Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "39.04",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>? Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "39.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>. Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com\n\nText.",
    "39.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>, text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com\n\ntext.",
    "39.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>; text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com\n\ntext.",
    "39.08",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>! Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link!\n\nhttps://codsen.com\n\nText.",
    "39.09",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>? Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link?\n\nhttps://codsen.com\n\nText.",
    "39.10",
  );
});

test("40 - html tag - in tandem with stripTogetherWithTheirContents, bug #54", () => {
  let source = `
  Show in plaintext
  <div>
    <p>No images? <a href="url">Click here</a>.</p>
  </div>
  <p>Legit link? <a href="url">Click here</a>.</p>
  <p>More text</p>
`;

  equal(
    stripHtml(source, { stripTogetherWithTheirContents: ["div"] }).result,
    "Show in plaintext\n\nLegit link? Click here.\nMore text",
    "40.01",
  );
  equal(
    stripHtml(source, {
      stripTogetherWithTheirContents: ["div"],
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "Show in plaintext\n\nLegit link? Click here url\nMore text",
    "40.02",
  );
});

test("41 - custom tag - in tandem with stripTogetherWithTheirContents, bug #54", () => {
  let source = `
  Show in plaintext
  <not-plaintext>
    <p>No images? <a href="url">Click here</a>.</p>
  </not-plaintext>
`;

  equal(
    stripHtml(source, { stripTogetherWithTheirContents: ["not-plaintext"] })
      .result,
    "Show in plaintext",
    "41.01",
  );
  equal(
    stripHtml(source, {
      stripTogetherWithTheirContents: ["not-plaintext"],
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "Show in plaintext",
    "41.02",
  );
});

test("42 - in combo with broken case, missing opening bracket + double quote attribute", () => {
  let source = `<!DOCTYPE html>
  html lang="en">
<head>`;

  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: false,
      },
    }).result,
    "",
    "42.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "",
    "42.02",
  );
});

test("43", () => {
  let source = `<a>
  html lang="en">
<head>`;

  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: false,
      },
    }).result,
    "",
    "43.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "",
    "43.02",
  );
});

test("44", () => {
  let source = "<title>z</title>";

  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: false,
      },
    }).result,
    "z",
    "44.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "z",
    "44.02",
  );
});

test("45 - Empty href", () => {
  let source = `
  <div>
    <p>Empty href
      <a href="">Click here</a>
    </p>
  </div>
  `;

  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "Empty href\nClick here",
    "45.01",
  );
});

test.run();
