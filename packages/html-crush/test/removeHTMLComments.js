import tap from "tap";
import { crush as m } from "../dist/html-crush.esm";

// grouped tests
tap.todo(
  `01 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - does nothing`,
  (t) => {
    [
      `abc def`,
      `!--`,
      `-->`,
      `abd <!-- def`,
      `<!--<span>-->`,
      `<!--a-->`,
      `<!-->`,
      `<!--<!---->`,
      `<!--a b-->`,
      `<!-- tralala -->`,
    ].forEach((source) => {
      t.same(
        m(source, {
          removeHTMLComments: false,
        }).result,
        source,
        "01.01"
      );
    });
    t.end();
  }
);

tap.todo(
  `02 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment only`,
  (t) => {
    const source = `<!-- don't remove this -->`;

    // off
    t.same(
      m(source, {
        removeHTMLComments: false,
      }).result,
      source,
      "02.01"
    );

    // on
    t.same(
      m(source, {
        removeHTMLComments: true,
      }).result,
      "",
      "02.02"
    );

    t.end();
  }
);

tap.todo(
  `03 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - one html comment, surrounding whitespace`,
  (t) => {
    const source = `  <!-- don't remove this -->  `;

    // off
    t.same(
      m(source, {
        removeHTMLComments: false,
      }).result,
      source.trim(),
      "03.01"
    );

    // on
    t.same(
      m(source, {
        removeHTMLComments: true,
      }).result,
      "",
      "03.02"
    );

    t.end();
  }
);

tap.todo(
  `04 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - when line length limit is too tight`,
  (t) => {
    const source = `<a><!-- don't remove this --></a>`;

    // off
    t.same(
      m(source, {
        removeHTMLComments: false,
        lineLengthLimit: 2,
      }).result,
      `<a>
<!--
don't
remove
this
--></a>`,
      "04.01"
    );

    // on
    t.same(
      m(source, {
        removeHTMLComments: true,
        lineLengthLimit: 2,
      }).result,
      `<a>
</a>`,
      "04.02"
    );
    t.end();
  }
);

tap.todo(
  `05 - ${`\u001b[${33}m${`html comments`}\u001b[${39}m`} - commented tag`,
  (t) => {
    const source = `<!--<span>-->`;

    // off
    t.same(
      m(source, {
        removeHTMLComments: false,
      }).result,
      source,
      "05.01"
    );

    // on
    t.same(
      m(source, {
        removeHTMLComments: true,
      }).result,
      "",
      "05.02"
    );

    t.end();
  }
);
