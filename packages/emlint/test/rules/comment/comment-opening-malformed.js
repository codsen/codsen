const t = require("tap");
const { Linter } = require("../../../dist/emlint.cjs");
const { applyFixes } = require("../../../t-util/util");

// 01. type="simple"
// -----------------------------------------------------------------------------

t.todo("01.");

// 02. type="only"
// -----------------------------------------------------------------------------

// 03. type="not"
// -----------------------------------------------------------------------------

t.todo(
  `03.01 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part of the opening is missing`,
  t => {
    // should be <!--[if !mso><!-->
    const str = `<!--[if !mso]>
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.01.01");
    t.match(messages, [], "03.01.02");
    t.end();
  }
);

t.todo(
  `03.02 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing square closing bracket`,
  t => {
    const str = `<!--[if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.02.01");
    t.match(messages, [], "03.02.02");
    t.end();
  }
);

t.todo(
  `03.03 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - excessive whitespace`,
  t => {
    const str = `<!--  [if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.03.01");
    t.match(messages, [], "03.03.02");
    t.end();
  }
);

t.todo(
  `03.04 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - missing dash`,
  t => {
    const str = `<!-[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.04.01");
    t.match(messages, [], "03.04.02");
    t.end();
  }
);

t.todo(
  `03.05 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - second part's dash is missing`,
  t => {
    const str = `<!--[if !mso]><!->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
<img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.05.01");
    t.match(messages, [], "03.05.02");
    t.end();
  }
);

t.todo(
  `03.06 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rogue character`,
  t => {
    const str = `<!--[if !mso]><!--z>
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.06.01");
    t.match(messages, [], "03.06.02");
    t.end();
  }
);

t.todo(
  `03.07 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - whitespace between opening parts`,
  t => {
    const str = `<!--[if !mso]>\n\n<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const fixed = `<!--[if !mso]><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), fixed, "03.07.01");
    t.match(messages, [], "03.07.02");
    t.end();
  }
);

t.todo(
  `03.08 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - first part missing`,
  t => {
    const str = `<!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.08.01");
    t.match(messages, [], "03.08.02");
    t.end();
  }
);

t.todo(
  `03.09 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - rounded brackets`,
  t => {
    const str = `<!--(if !mso)><!-->
      <img src="gif"/>
      <!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.09.01");
    t.match(messages, [], "03.09.02");
    t.end();
  }
);

t.todo(
  `03.10 - ${`\u001b[${35}m${`type: not`}\u001b[${39}m`} - no brackets`,
  t => {
    const str = `<!--if !mso><!-->
  <img src="gif"/>
<!--<![endif]-->`;
    const linter = new Linter();
    const messages = linter.verify(str, {
      rules: {
        "comment-closing-malformed": 2
      }
    });
    t.equal(applyFixes(str, messages), str, "03.10.01");
    t.match(messages, [], "03.10.02");
    t.end();
  }
);
