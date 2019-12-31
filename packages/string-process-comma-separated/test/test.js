const t = require("tap");
const processCommaSeparated = require("../dist/string-process-comma-separated.cjs");

const rawnbsp = "\u00a0";

// helper functions
// -----------------------------------------------------------------------------

function helper(str, opts, gatheredChunks, gatheredErrors) {
  opts.cb = (idxFrom, idxTo) => {
    // console.log(
    //   `012 test/helper(): opts.cb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}`
    // );
    gatheredChunks.push([idxFrom, idxTo]);
  };
  opts.errCb = (ranges, message) => {
    // console.log(
    //   `018 test/helper(): opts.errCb called, idxFrom = ${idxFrom}, idxTo = ${idxTo}; errName = ${errName}`
    // );
    gatheredErrors.push({ ranges, message });
  };

  processCommaSeparated(str, opts);
}

// 01. edge cases - unusual, broken or strange inputs
// -----------------------------------------------------------------------------

t.test(
  `01.01 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - empty string`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      "",
      {
        from: null, // <-- implied to process the whole string
        to: null // <-- implied to process the whole string
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [], "01.01.01");
    t.match(gatheredErrors, [], "01.01.02");

    t.end();
  }
);

t.test(
  `01.02 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - empty string, empty opts`,
  t => {
    t.doesNotThrow(() => {
      processCommaSeparated("");
    });
    t.end();
  }
);

t.test(
  `01.03 - ${`\u001b[${36}m${`edge cases`}\u001b[${39}m`} - not a string`,
  t => {
    t.throws(() => {
      processCommaSeparated(true);
    }, /THROW_ID_01/);
    t.end();
  }
);

// 02. B.A.U
// -----------------------------------------------------------------------------

t.test(
  `02.01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - one chunk`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      "abc",
      {
        from: null, // <-- implied to process the whole string
        to: null // <-- implied to process the whole string
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[0, 3]], "02.01.01");
    t.match(gatheredErrors, [], "02.01.02");

    t.end();
  }
);

t.test(
  `02.02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - two chunks`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      "abc,def",
      {
        from: null, // <-- implied to process the whole string
        to: null // <-- implied to process the whole string
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [0, 3],
        [4, 7]
      ],
      "02.02.01"
    );
    t.match(gatheredErrors, [], "02.02.02");

    t.end();
  }
);

t.test(
  `02.03 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - space after comma, default`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows="50%, 50%">`,
      {
        from: 16,
        to: 24
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [16, 19],
        [21, 24]
      ],
      "02.03.01"
    );
    t.match(
      gatheredErrors,
      [{ ranges: [[20, 21]], message: "Remove whitespace." }],
      "02.03.02"
    );

    t.end();
  }
);

t.test(
  `02.04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - starts with separator, ends with separator`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows=".50%.50%.\t\t.">`,
      {
        from: 16,
        to: 28,
        separator: "."
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [17, 20],
        [21, 24]
      ],
      "02.04.01"
    );
    t.match(
      gatheredErrors,
      [
        { ranges: [[16, 17]], message: "Remove separator." },
        { ranges: [[25, 27]], message: "Remove whitespace." },
        { ranges: [[24, 25]], message: "Remove separator." },
        { ranges: [[27, 28]], message: "Remove separator." }
      ],
      "02.04.02"
    );

    t.end();
  }
);

t.test(
  `02.05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - starts with separator, ends with separator`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows=" ,,\t50% ,${rawnbsp} 50% ,\t\t,">`,
      {
        from: 16,
        to: 35,
        separator: ","
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [20, 23],
        [27, 30]
      ],
      "02.05.01"
    );
    t.match(
      gatheredErrors,
      [
        { ranges: [[16, 17]], message: "Remove whitespace." },
        { ranges: [[17, 18]], message: "Remove separator." },
        { ranges: [[18, 19]], message: "Remove separator." },
        { ranges: [[19, 20]], message: "Remove whitespace." },
        { ranges: [[23, 24]], message: "Remove whitespace." },
        { ranges: [[25, 27]], message: "Remove whitespace." },
        { ranges: [[30, 31]], message: "Remove whitespace." },
        { ranges: [[32, 34]], message: "Remove whitespace." },
        { ranges: [[31, 32]], message: "Remove separator." },
        { ranges: [[34, 35]], message: "Remove separator." }
      ],
      "02.05.02"
    );

    t.end();
  }
);

t.test(
  `02.06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, default`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows="50%,  50%">`,
      {
        from: 16,
        to: 25
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [16, 19],
        [22, 25]
      ],
      "02.06.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          message: "Remove whitespace.",
          ranges: [[20, 22]]
        }
      ],
      "02.06.02"
    );

    t.end();
  }
);

t.test(
  `02.07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, oneSpaceAfterCommaOK = true`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows="50%,  50%">`,
      {
        from: 16,
        to: 25,
        oneSpaceAfterCommaOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [16, 19],
        [22, 25]
      ],
      "02.07.01"
    );
    // not indexes 20-22 but 21-22 because of opts.oneSpaceAfterCommaOK
    t.match(
      gatheredErrors,
      [
        {
          message: "Remove whitespace.",
          ranges: [[21, 22]]
        }
      ],
      "02.07.02"
    );

    t.end();
  }
);

t.test(
  `02.08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - 2 spaces after comma, oneSpaceAfterCommaOK = true`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<FRAMESET rows="50%,\t\t50%">`,
      {
        from: 16,
        to: 25,
        oneSpaceAfterCommaOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [16, 19],
        [22, 25]
      ],
      "02.08.01"
    );
    // not indexes 20-22 but 21-22 because of opts.oneSpaceAfterCommaOK
    t.match(
      gatheredErrors,
      [
        {
          message: "Remove whitespace.",
          ranges: [[20, 22, " "]]
        }
      ],
      "02.08.02"
    );

    t.end();
  }
);

t.test(
  `02.09 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - with URL, offset`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<applet archive=",http://codsen.com, tralala , ">`,
      {
        from: 17,
        to: 46,
        oneSpaceAfterCommaOK: false
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [18, 35],
        [37, 44]
      ],
      "02.09.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          message: "Remove separator.",
          ranges: [[17, 18]]
        },
        {
          message: "Remove whitespace.",
          ranges: [[36, 37]]
        },
        {
          message: "Remove whitespace.",
          ranges: [[44, 45]]
        },
        {
          message: "Remove separator.",
          ranges: [[45, 46]]
        }
      ],
      "02.09.02"
    );

    t.end();
  }
);

t.test(
  `02.10 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - with URL, offset`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `,http://codsen.com, tralala ,`,
      {
        oneSpaceAfterCommaOK: false
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [1, 18],
        [20, 27]
      ],
      "02.10.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          message: "Remove separator.",
          ranges: [[0, 1]]
        },
        {
          message: "Remove whitespace.",
          ranges: [[19, 20]]
        },
        {
          message: "Remove whitespace.",
          ranges: [[27, 28]]
        },
        {
          message: "Remove separator.",
          ranges: [[28, 29]]
        }
      ],
      "02.10.02"
    );

    t.end();
  }
);

// 03. opts.leadingWhitespaceOK
// -----------------------------------------------------------------------------

t.test(
  `03.01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - from-to ranges`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept=" .jpg">`,
      {
        from: 15,
        to: 20,
        leadingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.01.01");
    t.match(gatheredErrors, [], "03.01.02");

    t.end();
  }
);

t.test(
  `03.02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - whole string`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      ` .jpg`,
      {
        leadingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[1, 5]], "03.02.01");
    t.match(gatheredErrors, [], "03.02.02");

    t.end();
  }
);

t.test(
  `03.03 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - whole string + offset`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      ` .jpg`,
      {
        leadingWhitespaceOK: true,
        offset: 15
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.03.01");
    t.match(gatheredErrors, [], "03.03.02");

    t.end();
  }
);

t.test(
  `03.04 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept=" .jpg ">`,
      {
        from: 15,
        to: 21,
        leadingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.04.01");
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[20, 21]],
          message: "Remove whitespace."
        }
      ],
      "03.04.02"
    );

    t.end();
  }
);

t.test(
  `03.05 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept=" .jpg ">`,
      {
        from: 15,
        to: 21,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.05.01");
    t.match(gatheredErrors, [], "03.05.02"); // <--- none

    t.end();
  }
);

t.test(
  `03.06 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept=" .jpg ">`,
      {
        from: 15,
        to: 21,
        trailingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.06.01");
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[15, 16]],
          message: "Remove whitespace."
        }
      ],
      "03.06.02"
    );

    t.end();
  }
);

t.test(
  `03.07 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept=" .jpg  ">`,
      {
        from: 15,
        to: 22,
        leadingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(gatheredChunks, [[16, 20]], "03.07.01");
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[20, 22]],
          message: "Remove whitespace."
        }
      ],
      "03.07.02"
    );

    t.end();
  }
);

t.test(
  `03.08 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - more complex`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    const offset = 17;
    helper(
      `,http://codsen.com, tralala , `,
      {
        offset,
        leadingWhitespaceOK: true,
        trailingWhitespaceOK: true,
        oneSpaceAfterCommaOK: false,
        innerWhitespaceAllowed: false
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [offset + 1, offset + 18],
        [offset + 20, offset + 27]
      ],
      "03.08.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[offset + 0, offset + 1]],
          message: "Remove separator."
        },
        {
          ranges: [[offset + 19, offset + 20]],
          message: "Remove whitespace."
        },
        {
          ranges: [[offset + 27, offset + 28]],
          message: "Remove whitespace."
        },
        {
          ranges: [[offset + 28, offset + 29]],
          message: "Remove separator."
        }
      ],
      "03.08.02"
    );

    t.end();
  }
);

// 04. opts.innerWhitespaceAllowed
// -----------------------------------------------------------------------------

t.test(
  `04.01 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept="abc,def ghi, jkl ">`,
      {
        from: 15,
        to: 32,
        truetrailingWhitespaceOK: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [15, 18],
        [19, 26],
        [28, 31]
      ],
      "04.01.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[22, 23]],
          message: "Bad whitespace."
        },
        {
          ranges: [[27, 28]],
          message: "Remove whitespace."
        }
      ],
      "04.01.02"
    );

    t.end();
  }
);

t.test(
  `04.02 - ${`\u001b[${33}m${`normal use`}\u001b[${39}m`} - trailing whitespace`,
  t => {
    const gatheredChunks = [];
    const gatheredErrors = [];
    helper(
      `<input accept="abc,def ghi, jkl ">`,
      {
        from: 15,
        to: 32,
        truetrailingWhitespaceOK: true,
        innerWhitespaceAllowed: true
      },
      gatheredChunks,
      gatheredErrors
    );

    t.match(
      gatheredChunks,
      [
        [15, 18],
        [19, 26],
        [28, 31]
      ],
      "04.02.01"
    );
    t.match(
      gatheredErrors,
      [
        {
          ranges: [[27, 28]],
          message: "Remove whitespace."
        }
      ],
      "04.02.02"
    );

    t.end();
  }
);
