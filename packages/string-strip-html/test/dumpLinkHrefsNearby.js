// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { stripHtml } from "./util/noLog.js";

// api peculiarities
// -----------------------------------------------------------------------------

test("001 - null", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: null,
      },
    ).result,
    "Let's watch news this evening",
    "001.01",
  );
});

test("002 - undefined", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: undefined,
      },
    ).result,
    "Let's watch news this evening",
    "002.01",
  );
});

test("003 - {}", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: {},
      },
    ).result,
    "Let's watch news this evening",
    "003.01",
  );
});

test("004 - {}", () => {
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

test("005 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
    ).result,
    "Let's watch news this evening",
    "005.01",
  );
});

test("006 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: false },
      },
    ).result,
    "Let's watch news this evening",
    "006.01",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { putOnNewLine: true },
      },
    ).result,
    "Let's watch news this evening",
    "006.02",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapHeads: "z" },
      },
    ).result,
    "Let's watch news this evening",
    "006.03",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapTails: "z" },
      },
    ).result,
    "Let's watch news this evening",
    "006.04",
  );
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { wrapHeads: "|", wrapTails: "|" },
      },
    ).result,
    "Let's watch news this evening",
    "006.05",
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
    "006.06",
  );
});

test("007 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s watch <a href="https://www.news.com/" target="_blank">news</a> this evening',
      {
        dumpLinkHrefsNearby: { enabled: true },
      },
    ).result,
    "Let's watch news https://www.news.com/ this evening",
    "007.01",
  );
});

test("008 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@codsen.com" target="_blank">Roy</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Let's sell some juicy gossip to the Roy mailto:gossip@codsen.com right now!",
    "008.01",
  );
  equal(
    stripHtml(
      'Let\'s sell some juicy gossip to the <a href="mailto:gossip@codsen.com" target="_blank">Roy</a> right now!',
      { dumpLinkHrefsNearby: { enabled: true, wrapHeads: "|" } },
    ).result,
    "Let's sell some juicy gossip to the Roy |mailto:gossip@codsen.com right now!",
    "008.02",
  );
});

test("009 - clean code, double quotes", () => {
  equal(
    stripHtml(
      'Here\'s the <a href="mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night" target="_blank">chief editor\'s</a> email.',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Here's the chief editor's mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night email.",
    "009.01",
  );
});

test("010 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
    ).result,
    "Let's watch news this evening",
    "010.01",
  );
});

test("011 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: false },
      },
    ).result,
    "Let's watch news this evening",
    "011.01",
  );
});

test("012 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's watch <a href='https://www.news.com/' target='_blank'>news</a> this evening",
      {
        dumpLinkHrefsNearby: { enabled: true },
      },
    ).result,
    "Let's watch news https://www.news.com/ this evening",
    "012.01",
  );
});

test("013 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Let's sell some juicy gossip to the <a href='mailto:gossip@codsen.com' target='_blank'>Roy</a> right now!",
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Let's sell some juicy gossip to the Roy mailto:gossip@codsen.com right now!",
    "013.01",
  );
});

test("014 - clean code, single quotes", () => {
  equal(
    stripHtml(
      "Here's the <a href='mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night' target='_blank'>chief editor's</a> email.",
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "Here's the chief editor's mailto:bob@codsen.com?cc=gossip@codsen.com&subject=look%20what%20Kate%20did%20last%20night email.",
    "014.01",
  );
});

test("015 - dirty code, HTML is chopped but href captured", () => {
  equal(
    stripHtml('Let\'s watch <a href="https://www.news.com/" targ').result,
    "Let's watch",
    "015.01",
  );
});

test("016 - dirty code, HTML is chopped but href captured", () => {
  equal(
    stripHtml('Let\'s watch <a href="https://www.news.com/" targ', {
      dumpLinkHrefsNearby: { enabled: true },
    }).result,
    "Let's watch https://www.news.com/",
    "016.01",
  );
});

test("017 - linked image", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
    ).result,
    "a b",
    "017.01",
  );
});

test("018 - linked image, dumpLinkHrefsNearby=off", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      { dumpLinkHrefsNearby: { enabled: false } },
    ).result,
    "a b",
    "018.01",
  );
});

test("019 - linked image, dumpLinkHrefsNearby=on", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
      { dumpLinkHrefsNearby: { enabled: true } },
    ).result,
    "a https://codsen.com b",
    "019.01",
  );
});

test("020 - .putOnNewLine, control", () => {
  equal(
    stripHtml(
      'a <a href="https://codsen.com" target="_blank"><img src="http://404.codsen.com/spacer.gif" width="111" height="222" border="0" style="display:block;" alt="linked image"/></a> b',
    ).result,
    "a b",
    "020.01",
  );
});

test("021 - .putOnNewLine, control", () => {
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
    "021.01",
  );
});

test("022 - .putOnNewLine, control", () => {
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
    "022.01",
  );
});

test("023 - .putOnNewLine", () => {
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
    "023.01",
  );
});

test("024 - wrapHeads/wrapTails - control", () => {
  equal(
    stripHtml('a<a href="https://codsen.com" target="_blank"><div>z</div></a>b')
      .result,
    "a z b",
    "024.01",
  );
});

test("025 - wrapHeads/wrapTails - default dump", () => {
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
    "025.01",
  );
});

test("026 - wrapHeads/wrapTails wrap heads only", () => {
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
    "026.01",
  );
});

test("027 - wrapHeads/wrapTails wrap teads only", () => {
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
    "027.01",
  );
});

test("028 - wrapHeads/wrapTails wrap both", () => {
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
    "028.01",
  );
});

test("029 - wrapHeads/wrapTails + ignoreTags", () => {
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
    "029.01",
  );
});

test("030 - wrapHeads/wrapTails + ignoreTags", () => {
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
    "030.01",
  );
});

test("031 - wrapHeads/wrapTails + stripTogetherWithTheirContents", () => {
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
    "031.01",
  );
});

test("032 - ends with URL - enabled=true, putOnNewLine=false", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "click me https://example.com/",
    "032.01",
  );
});

test("033 - ends with URL - enabled=true, putOnNewLine=true", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "click me\n\nhttps://example.com/",
    "033.01",
  );
});

test("034 - ends with URL - disabled", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>', {
      dumpLinkHrefsNearby: { enabled: false },
    }).result,
    "click me",
    "034.01",
  );
});

test("035 - ends with URL - enabled=true, putOnNewLine=false", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>\n\n\n\t', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "click me https://example.com/",
    "035.01",
  );
});

test("036 - ends with URL - enabled=true, putOnNewLine=true", () => {
  equal(
    stripHtml('<a href="https://example.com/">click me</a>\n\n\n\t', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "click me\n\nhttps://example.com/",
    "036.01",
  );
});

test("037 - trailing dot + end", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "037.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "037.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com",
    "037.03",
  );
  equal(
    stripHtml('A <a href="https://codsen.com">link</a>!', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "A link https://codsen.com",
    "037.04",
  );
  equal(
    stripHtml('Is this a <a href="https://codsen.com">link</a>?', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Is this a link https://codsen.com",
    "037.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com",
    "037.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com",
    "037.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com",
    "037.08",
  );
  equal(
    stripHtml('A <a href="https://codsen.com">link</a>!', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "A link!\n\nhttps://codsen.com",
    "037.09",
  );
  equal(
    stripHtml('Is this a <a href="https://codsen.com">link</a>?', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Is this a link?\n\nhttps://codsen.com",
    "037.10",
  );
});

test("038 - trailing dot + new line", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.\nText.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\nText.",
    "038.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "038.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "038.03",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>!\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "038.04",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>?\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com\ntext.",
    "038.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>.\nText.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com\n\nText.",
    "038.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>,\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com\n\ntext.",
    "038.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>;\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com\n\ntext.",
    "038.08",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>!\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link!\n\nhttps://codsen.com\n\ntext.",
    "038.09",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>?\ntext.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link?\n\nhttps://codsen.com\n\ntext.",
    "038.10",
  );
});

test("039 - trailing dot + space + text", () => {
  // putOnNewLine=false
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>. Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "039.01",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>, text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com text.",
    "039.02",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>; text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com text.",
    "039.03",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>! Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "039.04",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>? Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: false },
    }).result,
    "Here's a link https://codsen.com Text.",
    "039.05",
  );
  // putOnNewLine=true
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>. Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link.\n\nhttps://codsen.com\n\nText.",
    "039.06",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>, text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link,\n\nhttps://codsen.com\n\ntext.",
    "039.07",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>; text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link;\n\nhttps://codsen.com\n\ntext.",
    "039.08",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>! Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link!\n\nhttps://codsen.com\n\nText.",
    "039.09",
  );
  equal(
    stripHtml('Here\'s a <a href="https://codsen.com">link</a>? Text.', {
      dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
    }).result,
    "Here's a link?\n\nhttps://codsen.com\n\nText.",
    "039.10",
  );
});

test("040 - html tag - in tandem with stripTogetherWithTheirContents, bug #54", () => {
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
    "040.01",
  );
  equal(
    stripHtml(source, {
      stripTogetherWithTheirContents: ["div"],
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "Show in plaintext\n\nLegit link? Click here url\nMore text",
    "040.02",
  );
});

test("041 - custom tag - in tandem with stripTogetherWithTheirContents, bug #54", () => {
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
    "041.01",
  );
  equal(
    stripHtml(source, {
      stripTogetherWithTheirContents: ["not-plaintext"],
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "Show in plaintext",
    "041.02",
  );
});

test("042 - in combo with broken case, missing opening bracket + double quote attribute", () => {
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
    "042.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "",
    "042.02",
  );
});

test("043", () => {
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
    "043.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "",
    "043.02",
  );
});

test("044", () => {
  let source = "<title>z</title>";

  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: false,
      },
    }).result,
    "z",
    "044.01",
  );
  equal(
    stripHtml(source, {
      dumpLinkHrefsNearby: {
        enabled: true,
      },
    }).result,
    "z",
    "044.02",
  );
});

test("045 - Empty href", () => {
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
    "045.01",
  );
});

test.run();
