// rule: tag-bad-self-closing
// -----------------------------------------------------------------------------

import tap from "tap";
import { Linter } from "../dist/emlint.esm";
import { applyFixes } from "../t-util/util";

// 1. all examples from Apple Safari Web Content Guide
//
// https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html#//apple_ref/doc/uid/TP40002051-CH3-SW4
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${`Apple Safari Web Content Guide`}\u001b[${39}m`} - no rules should be triggered`,
  (t) => {
    const exampleSnippets = [
      `<link rel="apple-touch-icon" href="/custom_icon.png"/>`,
      `<link rel="apple-touch-icon" href="touch-icon-iphone.png"/>`,
      `<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad.png"/>`,
      `<link rel="apple-touch-icon" sizes="180x180" href="touch-icon-iphone-retina.png"/>`,
      `<link rel="apple-touch-icon" sizes="167x167" href="touch-icon-ipad-retina.png"/>`,
      `<link rel="apple-touch-startup-image" href="/launch.png"/>`,
      `<meta name="apple-mobile-web-app-title" content="AppTitle"/>`,
      `<meta name="apple-mobile-web-app-capable" content="yes"/>`,
      `<meta name="apple-mobile-web-app-status-bar-style" content="black"/>`,
      `<a href="tel:1-408-555-5555">Call me</a>`,
    ];
    exampleSnippets.forEach((str) => {
      const linter = new Linter();
      const messages = linter.verify(str, {
        rules: {
          all: 2,
        },
      });
      t.same(messages, [], `01.01.01 - ${str}`);
      t.equal(applyFixes(str, messages), str, "01.01.02");
    });
    t.end();
  }
);
