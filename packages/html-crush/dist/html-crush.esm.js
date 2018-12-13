import checkTypes from 'check-types-mini';
import isObj from 'lodash.isplainobject';
import applySlices from 'ranges-apply';
import Slices from 'ranges-push';
import { matchRightIncl } from 'string-match-left-right';
import expand from 'string-range-expander';

var name = "html-crush";
var version = "0.3.0";
var description = "Minifies HTML, accepts HTML, mixed with other sources";
var license = "MIT";
var engines = {
	node: ">=6",
	npm: ">=5",
	yarn: ">=1"
};
var repository = {
	type: "git",
	url: "https://bitbucket.org/codsen/html-crush.git"
};
var homepage = "https://bitbucket.org/codsen/html-crush/";
var author = {
	email: "roy@codsen.com",
	name: "Roy Revelt",
	url: "codsen.com"
};
var main = "dist/html-crush.cjs.js";
var module$1 = "dist/html-crush.esm.js";
var browser = "dist/html-crush.umd.js";
var scripts = {
	build: "rollup -c",
	coverage: "nyc report --reporter=text-lcov | coveralls",
	dev: "rollup -c --dev --silent",
	format: "./node_modules/.bin/eslint src/*.js test/*.js --fix",
	prepare: "npm run build",
	pretest: "npm run build",
	test: "./node_modules/.bin/eslint src/*.js test/*.js && nyc ava",
	version: "npm run build && git add ."
};
var ava = {
	compileEnhancements: false,
	require: [
		"esm"
	],
	verbose: true
};
var clinton = {
	rules: {
		xo: 0
	}
};
var esm = {
	"await": true,
	cjs: true
};
var husky = {
	hooks: {
		"pre-commit": "npm run format && npm test"
	}
};
var keywords = [
	"html",
	"minify",
	"parse",
	"no",
	"line",
	"breaks",
	"remove",
	"reduce",
	"size",
	"email",
	"templates",
	"tool",
	"utility"
];
var lect = {
	babelrc: {
		override: false,
		set: false
	},
	badges: {
		contributors: true,
		cov: true,
		deps: true,
		deps2d: true,
		dev: true,
		downloads: true,
		license: true,
		node: true,
		npm: true,
		overall: true,
		runkit: true,
		travis: true,
		vulnerabilities: true
	},
	contribution_types: [
		"Blogposts",
		"Bug reports",
		"Code",
		"Design",
		"Documentation",
		"Event Organizing",
		"Examples",
		"Financial",
		"Funding Finding",
		"Ideas, Planning, & Feedback",
		"Infrastructure (Hosting, Build-Tools, etc)",
		"Plugin/utility libraries",
		"Answering Questions",
		"Reviewed Pull Requests",
		"Talks",
		"Tests",
		"Tools",
		"Translation",
		"Tutorials",
		"Videos"
	],
	contributors: [
		{
			contribution: [
				"Code",
				"Documentation",
				"Tests"
			],
			username: "revelt"
		}
	],
	eslintrc: {
		add: [
		],
		remove: [
		]
	},
	files: {
		"delete": [
		],
		write_hard: [
			{
				contents: "",
				name: ""
			}
		],
		write_soft: [
			{
				contents: "",
				name: ""
			}
		]
	},
	header: {
		dontQuoteDescription: false,
		rightFloatedBadge: [
		]
	},
	licence: {
		extras: [
			""
		]
	},
	npmignore: {
		badFiles: [
		],
		badFolders: [
		],
		goodFiles: [
		],
		goodFolders: [
		]
	},
	various: {
		back_to_top: {
			enabled: true,
			label: ""
		},
		devDependencies: [
			"@babel/polyfill",
			"rollup-plugin-node-builtins",
			"rollup-plugin-json"
		],
		travisVersionsOverride: [
		]
	}
};
var nyc = {
	instrument: false,
	require: [
		"@babel/register"
	],
	sourceMap: false
};
var dependencies = {
	"check-types-mini": "^5.1.1",
	"lodash.isplainobject": "^4.0.6",
	"ranges-apply": "^2.8.1",
	"ranges-push": "^2.12.0",
	"string-match-left-right": "^3.5.0",
	"string-range-expander": "^1.5.0"
};
var devDependencies = {
	"@babel/core": "^7.2.0",
	"@babel/polyfill": "latest",
	"@babel/preset-env": "^7.2.0",
	"@babel/register": "^7.0.0",
	ava: "1.0.0-rc.2",
	"babel-plugin-istanbul": "^5.1.0",
	coveralls: "latest",
	eslint: "latest",
	"eslint-config-prettier": "latest",
	"eslint-plugin-ava": "latest",
	"eslint-plugin-import": "latest",
	"eslint-plugin-no-unsanitized": "latest",
	"eslint-plugin-no-wildcard-postmessage": "latest",
	"eslint-plugin-prettier": "latest",
	"eslint-plugin-scanjs-rules": "latest",
	husky: "^1.2.0",
	nyc: "latest",
	prettier: "latest",
	rollup: "latest",
	"rollup-plugin-babel": "^4.0.3",
	"rollup-plugin-cleanup": "^3.0.0",
	"rollup-plugin-commonjs": "^9.2.0",
	"rollup-plugin-json": "latest",
	"rollup-plugin-node-builtins": "latest",
	"rollup-plugin-node-resolve": "^4.0.0",
	"rollup-plugin-strip": "^1.2.0",
	"rollup-plugin-terser": "^3.0.0"
};
var pack = {
	name: name,
	version: version,
	description: description,
	license: license,
	engines: engines,
	repository: repository,
	homepage: homepage,
	author: author,
	main: main,
	module: module$1,
	browser: browser,
	scripts: scripts,
	ava: ava,
	clinton: clinton,
	esm: esm,
	husky: husky,
	keywords: keywords,
	lect: lect,
	nyc: nyc,
	dependencies: dependencies,
	devDependencies: devDependencies
};

const isArr = Array.isArray;
const finalIndexesToDelete = new Slices({ limitToBeAddedWhitespace: true });
const { version: version$1 } = pack;
const defaults = {
  lineLengthLimit: 500,
  removeIndentations: true,
  removeLineBreaks: false,
  reportProgressFunc: null,
  breakToTheLeftOf: [
    "</td",
    "<html",
    "<head",
    "<meta",
    "<table",
    "<script",
    "</script",
    "<!DOCTYPE",
    "<style",
    "</style",
    "<title",
    "<body",
    "@media",
    "</html",
    "</body",
    "<!--[if",
    "<!--<![endif"
  ]
};
function isStr(something) {
  return typeof something === "string";
}
function existy(x) {
  return x != null;
}
function isLetter(something) {
  return (
    typeof something === "string" &&
    something.toUpperCase() !== something.toLowerCase()
  );
}
function crush(str, originalOpts) {
  const start = Date.now();
  if (!isStr(str)) {
    if (str === undefined) {
      throw new Error(
        "html-minify-noparse: [THROW_ID_01] the first input argument is completely missing! It should be given as string."
      );
    } else {
      throw new Error(
        `html-minify-noparse: [THROW_ID_02] the first input argument must be string! It was given as "${typeof str}", equal to:\n${JSON.stringify(
          str,
          null,
          4
        )}`
      );
    }
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new Error(
      `html-minify-noparse: [THROW_ID_03] the second input argument, options object, should be a plain object but it was given as type ${typeof originalOpts}, equal to ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  if (
    originalOpts &&
    isArr(originalOpts.breakToTheLeftOf) &&
    originalOpts.breakToTheLeftOf.length
  ) {
    for (let z = 0, len = originalOpts.breakToTheLeftOf.length; z < len; z++) {
      if (!isStr(originalOpts.breakToTheLeftOf[z])) {
        throw new TypeError(
          `html-minify-noparse: [THROW_ID_05] the opts.breakToTheLeftOf array contains non-string elements! For example, element at index ${z} is of a type "${typeof originalOpts
            .breakToTheLeftOf[z]}" and is equal to:\n${JSON.stringify(
            originalOpts.breakToTheLeftOf[z],
            null,
            4
          )}`
        );
      }
    }
  }
  const opts = Object.assign({}, defaults, originalOpts);
  checkTypes(opts, defaults, {
    msg: "html-minify-noparse: [THROW_ID_04*]",
    schema: {
      reportProgressFunc: ["false", "null", "function"],
      breakToTheLeftOf: ["false", "null", "array"]
    }
  });
  if (opts.breakToTheLeftOf === false || opts.breakToTheLeftOf === null) {
    opts.breakToTheLeftOf = [];
  }
  let breakToTheLeftOfFirstLetters = "";
  if (isArr(opts.breakToTheLeftOf) && opts.breakToTheLeftOf.length) {
    for (let i = 0, len = opts.breakToTheLeftOf.length; i < len; i++) {
      if (
        opts.breakToTheLeftOf[i].length &&
        !breakToTheLeftOfFirstLetters.includes(opts.breakToTheLeftOf[i][0])
      ) {
        breakToTheLeftOfFirstLetters += opts.breakToTheLeftOf[i][0];
      }
    }
  }
  let lastLinebreak = null;
  let whitespaceStartedAt = null;
  let nonWhitespaceCharMet = false;
  let countCharactersPerLine = 0;
  let withinStyleTag = false;
  let styleCommentStartedAt = null;
  let scriptStartedAt = null;
  let preStartedAt = null;
  let codeStartedAt = null;
  let doNothing = false;
  let stageFrom = null;
  let stageTo = null;
  let stageAdd = null;
  const CHARS_BREAK_ON_THE_RIGHT_OF_THEM = [">", "}", ";"];
  const CHARS_BREAK_ON_THE_LEFT_OF_THEM = ["<"];
  const DELETE_TIGHTLY_IF_ON_LEFT_IS = [">"];
  const DELETE_TIGHTLY_IF_ON_RIGHT_IS = ["<"];
  const set = ["{", "}", ",", ":", ";", "<", ">", "~", "+"];
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS = set;
  const DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS = set;
  let beginningOfAFile = true;
  const len = str.length;
  const midLen = Math.floor(len / 2);
  let currentPercentageDone;
  let lastPercentage = 0;
  if (len) {
    for (let i = 0; i < len; i++) {
      if (opts.reportProgressFunc) {
        if (len > 1000 && len < 2000) {
          if (i === midLen) {
            opts.reportProgressFunc(50);
          }
        } else if (len >= 2000) {
          currentPercentageDone = Math.floor((i / len) * 80);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      }
      if (
        !doNothing &&
        preStartedAt !== null &&
        codeStartedAt !== null &&
        i >= preStartedAt &&
        i >= codeStartedAt
      ) {
        doNothing = true;
      }
      if (
        !doNothing &&
        !withinStyleTag &&
        codeStartedAt !== null &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "c" &&
        str[i + 3] === "o" &&
        str[i + 4] === "d" &&
        str[i + 5] === "e" &&
        !isLetter(str[i + 6])
      ) {
        if (preStartedAt !== null && doNothing) {
          doNothing = false;
        }
        codeStartedAt = null;
      }
      if (
        !doNothing &&
        !withinStyleTag &&
        codeStartedAt === null &&
        str[i] === "<" &&
        str[i + 1] === "c" &&
        str[i + 2] === "o" &&
        str[i + 3] === "d" &&
        str[i + 4] === "e" &&
        !isLetter(str[i + 5])
      ) {
        if (str[i + 5] === ">") {
          codeStartedAt = i + 6;
        } else {
          for (let y = i + 5; y < len; y++) {
            if (str[y] === ">") {
              codeStartedAt = y + 1;
              i = y;
              break;
            }
          }
        }
      }
      if (
        !doNothing &&
        !withinStyleTag &&
        preStartedAt !== null &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "p" &&
        str[i + 3] === "r" &&
        str[i + 4] === "e" &&
        !isLetter(str[i + 5])
      ) {
        preStartedAt = null;
      }
      if (
        !doNothing &&
        !withinStyleTag &&
        preStartedAt === null &&
        str[i] === "<" &&
        str[i + 1] === "p" &&
        str[i + 2] === "r" &&
        str[i + 3] === "e" &&
        !isLetter(str[i + 4])
      ) {
        if (str[i + 4] === ">") {
          preStartedAt = i + 5;
        } else {
          for (let y = i + 4; y < len; y++) {
            if (str[y] === ">") {
              preStartedAt = y + 1;
              i = y;
              break;
            }
          }
        }
      }
      if (str[i] === ">" && str[i - 1] === "]" && str[i - 2] === "]") {
        if (doNothing) {
          doNothing = false;
          continue;
        }
      }
      if (
        !doNothing &&
        str[i] === "<" &&
        str[i + 1] === "!" &&
        str[i + 2] === "[" &&
        str[i + 3] === "C" &&
        str[i + 4] === "D" &&
        str[i + 5] === "A" &&
        str[i + 6] === "T" &&
        str[i + 7] === "A" &&
        str[i + 8] === "["
      ) {
        doNothing = true;
        whitespaceStartedAt = null;
      }
      if (
        scriptStartedAt !== null &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "s" &&
        str[i + 3] === "c" &&
        str[i + 4] === "r" &&
        str[i + 5] === "i" &&
        str[i + 6] === "p" &&
        str[i + 7] === "t" &&
        !isLetter(str[i + 8])
      ) {
        if (
          (opts.removeIndentations || opts.removeLineBreaks) &&
          i > 0 &&
          str[i - 1] &&
          !str[i - 1].trim().length
        ) {
          for (let y = i; y--; ) {
            if (str[y] === "\n" || str[y] === "\r" || str[y].trim().length) {
              if (y + 1 < i) {
                finalIndexesToDelete.push(y + 1, i);
              }
              break;
            }
          }
        }
        scriptStartedAt = null;
        doNothing = false;
        i += 8;
        continue;
      }
      if (
        !doNothing &&
        !withinStyleTag &&
        str[i] === "<" &&
        str[i + 1] === "s" &&
        str[i + 2] === "c" &&
        str[i + 3] === "r" &&
        str[i + 4] === "i" &&
        str[i + 5] === "p" &&
        str[i + 6] === "t" &&
        !isLetter(str[i + 7])
      ) {
        scriptStartedAt = i;
        doNothing = true;
        let whatToInsert = "";
        if (
          (opts.removeLineBreaks || opts.removeIndentations) &&
          whitespaceStartedAt !== null
        ) {
          if (whitespaceStartedAt > 0) {
            whatToInsert = "\n";
          }
          finalIndexesToDelete.push(whitespaceStartedAt, i, whatToInsert);
        }
        whitespaceStartedAt = null;
        lastLinebreak = null;
      }
      if (
        !doNothing &&
        withinStyleTag &&
        styleCommentStartedAt !== null &&
        str[i] === "*" &&
        str[i + 1] === "/"
      ) {
        [stageFrom, stageTo] = expand({
          str,
          from: styleCommentStartedAt,
          to: i + 2,
          ifLeftSideIncludesThisThenCropTightly:
            DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
          ifRightSideIncludesThisThenCropTightly:
            DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || ""
        });
        styleCommentStartedAt = null;
        if (stageFrom != null && str[stageTo] === undefined) {
          finalIndexesToDelete.push(stageFrom, stageTo);
        } else {
          countCharactersPerLine++;
          i++;
          continue;
        }
      }
      if (
        !doNothing &&
        withinStyleTag &&
        styleCommentStartedAt === null &&
        str[i] === "/" &&
        str[i + 1] === "*"
      ) {
        styleCommentStartedAt = i;
      }
      if (
        !doNothing &&
        withinStyleTag &&
        styleCommentStartedAt === null &&
        str[i] === "<" &&
        str[i + 1] === "/" &&
        str[i + 2] === "s" &&
        str[i + 3] === "t" &&
        str[i + 4] === "y" &&
        str[i + 5] === "l" &&
        str[i + 6] === "e" &&
        !isLetter(str[i + 7])
      ) {
        withinStyleTag = false;
      } else if (
        !doNothing &&
        !withinStyleTag &&
        styleCommentStartedAt === null &&
        str[i] === "<" &&
        str[i + 1] === "s" &&
        str[i + 2] === "t" &&
        str[i + 3] === "y" &&
        str[i + 4] === "l" &&
        str[i + 5] === "e" &&
        !isLetter(str[i + 6])
      ) {
        withinStyleTag = true;
      }
      if (!doNothing && !str[i].trim().length) {
        if (whitespaceStartedAt === null) {
          whitespaceStartedAt = i;
        }
      } else if (
        !doNothing &&
        !(withinStyleTag && styleCommentStartedAt !== null)
      ) {
        if (whitespaceStartedAt !== null) {
          if (opts.removeLineBreaks) {
            countCharactersPerLine++;
          }
          if (beginningOfAFile) {
            beginningOfAFile = false;
            finalIndexesToDelete.push(0, i);
          } else {
            if (opts.removeIndentations && !opts.removeLineBreaks) {
              if (
                !nonWhitespaceCharMet &&
                lastLinebreak !== null &&
                i > lastLinebreak
              ) {
                finalIndexesToDelete.push(lastLinebreak + 1, i);
              } else if (whitespaceStartedAt + 1 < i) {
                if (str[whitespaceStartedAt] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt + 1, i);
                } else if (str[i - 1] === " ") {
                  finalIndexesToDelete.push(whitespaceStartedAt, i - 1);
                } else {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, " ");
                }
              }
            }
            if (opts.removeLineBreaks) {
              if (
                breakToTheLeftOfFirstLetters.length &&
                breakToTheLeftOfFirstLetters.includes(str[i]) &&
                matchRightIncl(str, i, opts.breakToTheLeftOf)
              ) {
                if (!(str[i - 1] === "\n" && whitespaceStartedAt === i - 1)) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, "\n");
                }
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                whitespaceStartedAt = null;
                countCharactersPerLine = 1;
                continue;
              }
              let whatToAdd = " ";
              if (
                (str[whitespaceStartedAt - 1] &&
                  DELETE_TIGHTLY_IF_ON_LEFT_IS.includes(
                    str[whitespaceStartedAt - 1]
                  ) &&
                  DELETE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i])) ||
                (withinStyleTag &&
                  styleCommentStartedAt === null &&
                  (DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS.includes(
                    str[whitespaceStartedAt - 1]
                  ) ||
                    DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS.includes(str[i]))) ||
                (str[i] === "!" &&
                  str[i + 1] === "i" &&
                  str[i + 2] === "m" &&
                  str[i + 3] === "p" &&
                  str[i + 4] === "o" &&
                  str[i + 5] === "r" &&
                  str[i + 6] === "t" &&
                  str[i + 7] === "a" &&
                  str[i + 8] === "n" &&
                  str[i + 9] === "t")
              ) {
                whatToAdd = "";
              }
              if (whatToAdd && whatToAdd.length) {
                countCharactersPerLine++;
              }
              if (!opts.lineLengthLimit) {
                if (
                  !(
                    i === whitespaceStartedAt + 1 &&
                    str[whitespaceStartedAt] === " " &&
                    whatToAdd === " "
                  )
                ) {
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                }
              } else {
                if (
                  countCharactersPerLine >= opts.lineLengthLimit ||
                  !str[i + 1]
                ) {
                  if (
                    countCharactersPerLine > opts.lineLengthLimit ||
                    (countCharactersPerLine === opts.lineLengthLimit &&
                      str[i + 1] &&
                      str[i + 1].trim().length &&
                      !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
                      !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i + 1]))
                  ) {
                    whatToAdd = "\n";
                    countCharactersPerLine = 1;
                  }
                  finalIndexesToDelete.push(whitespaceStartedAt, i, whatToAdd);
                  stageFrom = null;
                  stageTo = null;
                  stageAdd = null;
                } else {
                  stageFrom = whitespaceStartedAt;
                  stageTo = i;
                  stageAdd = whatToAdd;
                }
              }
            }
          }
          whitespaceStartedAt = null;
          if (!nonWhitespaceCharMet) {
            nonWhitespaceCharMet = true;
          }
          continue;
        } else {
          if (beginningOfAFile) {
            beginningOfAFile = false;
          }
          if (opts.removeLineBreaks) {
            countCharactersPerLine++;
          }
        }
        if (!nonWhitespaceCharMet) {
          nonWhitespaceCharMet = true;
        }
      }
      if (
        !doNothing &&
        !beginningOfAFile &&
        i !== 0 &&
        opts.removeLineBreaks &&
        (opts.lineLengthLimit || breakToTheLeftOfFirstLetters.length)
      ) {
        if (
          breakToTheLeftOfFirstLetters.length &&
          matchRightIncl(str, i, opts.breakToTheLeftOf)
        ) {
          finalIndexesToDelete.push(i, i, "\n");
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
          countCharactersPerLine = 1;
          continue;
        } else if (
          opts.lineLengthLimit &&
          countCharactersPerLine <= opts.lineLengthLimit
        ) {
          if (
            CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) ||
            (str[i - 1] &&
              CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i - 1])) ||
            !str[i].trim().length ||
            !str[i + 1]
          ) {
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || (stageAdd && stageAdd.length))
            ) {
              let whatToAdd = stageAdd;
              if (
                str[i].trim().length &&
                str[i + 1] &&
                str[i + 1].trim().length &&
                countCharactersPerLine + (stageAdd ? stageAdd.length : 0) >
                  opts.lineLengthLimit
              ) {
                whatToAdd = "\n";
              }
              finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
            }
            if (
              str[i].trim().length &&
              (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i]) ||
                (str[i - 1] &&
                  CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i - 1])))
            ) {
              stageFrom = i;
              stageTo = i;
              stageAdd = null;
            } else {
              stageFrom = null;
              stageTo = null;
              stageAdd = null;
            }
          }
        } else if (opts.lineLengthLimit) {
          if (CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i])) {
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || (stageAdd && stageAdd.length))
            ) {
              const whatToAddLength =
                stageAdd && stageAdd.length ? stageAdd.length : 0;
              if (
                countCharactersPerLine -
                  (stageTo - stageFrom - whatToAddLength) -
                  1 >
                opts.lineLengthLimit
              ) ; else {
                finalIndexesToDelete.push(stageFrom, stageTo, stageAdd);
                stageFrom = null;
                stageTo = null;
                stageAdd = null;
                if (
                  countCharactersPerLine -
                    (stageTo - stageFrom - whatToAddLength) -
                    1 ===
                  opts.lineLengthLimit
                ) {
                  finalIndexesToDelete.push(i, i, "\n");
                  countCharactersPerLine = 0;
                }
              }
            } else {
              finalIndexesToDelete.push(i, i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (
            str[i - 1] &&
            CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i - 1])
          ) {
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || (stageAdd && stageAdd.length))
            ) ; else {
              finalIndexesToDelete.push(i, i, "\n");
              countCharactersPerLine = 0;
            }
          } else if (!str[i].trim().length) ; else if (!str[i + 1]) {
            if (
              stageFrom !== null &&
              stageTo !== null &&
              (stageFrom !== stageTo || (stageAdd && stageAdd.length))
            ) {
              finalIndexesToDelete.push(stageFrom, stageTo, "\n");
            }
          }
        }
      }
      if (
        !doNothing &&
        !beginningOfAFile &&
        opts.removeLineBreaks &&
        opts.lineLengthLimit &&
        countCharactersPerLine >= opts.lineLengthLimit &&
        stageFrom !== null &&
        stageTo !== null &&
        !CHARS_BREAK_ON_THE_RIGHT_OF_THEM.includes(str[i]) &&
        !CHARS_BREAK_ON_THE_LEFT_OF_THEM.includes(str[i])
      ) {
        if (
          !(
            countCharactersPerLine === opts.lineLengthLimit &&
            str[i + 1] &&
            !str[i + 1].trim().length
          )
        ) {
          let whatToAdd = "\n";
          if (
            str[i + 1] &&
            !str[i + 1].trim().length &&
            countCharactersPerLine === opts.lineLengthLimit
          ) {
            whatToAdd = stageAdd;
          }
          finalIndexesToDelete.push(stageFrom, stageTo, whatToAdd);
          countCharactersPerLine = i - stageTo;
          if (str[i].length) {
            countCharactersPerLine++;
          }
          stageFrom = null;
          stageTo = null;
          stageAdd = null;
        }
      }
      if (
        (!doNothing && str[i] === "\n") ||
        (str[i] === "\r" &&
          (!str[i + 1] || (str[i + 1] && str[i + 1] !== "\n")))
      ) {
        lastLinebreak = i;
        if (nonWhitespaceCharMet) {
          nonWhitespaceCharMet = false;
        }
        if (
          !opts.removeLineBreaks &&
          whitespaceStartedAt !== null &&
          whitespaceStartedAt < i &&
          str[i + 1] &&
          str[i + 1] !== "\r" &&
          str[i + 1] !== "\n"
        ) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
      if (!str[i + 1]) {
        if (withinStyleTag && styleCommentStartedAt !== null) {
          finalIndexesToDelete.push(
            ...expand({
              str,
              from: styleCommentStartedAt,
              to: i,
              ifLeftSideIncludesThisThenCropTightly:
                DELETE_IN_STYLE_TIGHTLY_IF_ON_LEFT_IS || "",
              ifRightSideIncludesThisThenCropTightly:
                DELETE_IN_STYLE_TIGHTLY_IF_ON_RIGHT_IS || ""
            })
          );
        } else if (whitespaceStartedAt && str[i] !== "\n" && str[i] !== "\r") {
          finalIndexesToDelete.push(whitespaceStartedAt, i + 1);
        } else if (
          whitespaceStartedAt &&
          ((str[i] === "\r" && str[i + 1] === "\n") || str[i] === "\n")
        ) {
          finalIndexesToDelete.push(whitespaceStartedAt, i);
        }
      }
    }
    if (finalIndexesToDelete.current()) {
      const res = applySlices(str, finalIndexesToDelete.current(), percDone => {
        if (opts.reportProgressFunc && len >= 2000) {
          currentPercentageDone = 80 + Math.floor(percDone / 5);
          if (currentPercentageDone !== lastPercentage) {
            lastPercentage = currentPercentageDone;
            opts.reportProgressFunc(currentPercentageDone);
          }
        }
      });
      const rangesCopy = Array.from(finalIndexesToDelete.current());
      finalIndexesToDelete.wipe();
      const resLen = res.length;
      return {
        log: {
          timeTakenInMiliseconds: Date.now() - start,
          originalLength: len,
          cleanedLength: resLen,
          bytesSaved: Math.max(len - resLen, 0),
          percentageReducedOfOriginal: len
            ? Math.round((Math.max(len - resLen, 0) * 100) / len)
            : 0
        },
        ranges: rangesCopy,
        result: res
      };
    }
  }
  return {
    log: {
      timeTakenInMiliseconds: Date.now() - start,
      originalLength: len,
      cleanedLength: len,
      bytesSaved: 0,
      percentageReducedOfOriginal: 0
    },
    ranges: [],
    result: str
  };
}

export { crush, defaults, version$1 as version };
