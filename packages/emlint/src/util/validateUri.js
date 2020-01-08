// import processCommaSeparated from "string-process-comma-separated";
import checkForWhitespace from "./checkForWhitespace";
import splitByWhitespace from "./splitByWhitespace";
import isAbsoluteUri from "./isAbsoluteUri";
import isSingleSpace from "./isSingleSpace";
import isUrl from "is-url-superb";

function validateValue(str, opts, errorArr) {
  console.log(" ");
  console.log(
    `011 ${`\u001b[${32}m${`validateUri/validateValue() called`}\u001b[${39}m`}`
  );
  console.log(" ");
  const extractedValue = str.slice(opts.from, opts.to);
  console.log(
    `016 validateUri/validateValue(): ${`\u001b[${33}m${`extractedValue`}\u001b[${39}m`} = ${JSON.stringify(
      extractedValue,
      null,
      4
    )}`
  );
  console.log(
    `023 validateUri/validateValue(): ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );
  console.log(
    `030 validateUri/validateValue(): real range: [${opts.offset +
      opts.from}, ${opts.offset + opts.to}]`
  );

  if (!isUrl(extractedValue) || !isAbsoluteUri(extractedValue)) {
    console.log(
      `036 validateUri/validateValue(): ${`\u001b[${32}m${`PUSH`}\u001b[${39}m`} [[${opts.offset +
        opts.from}, ${opts.offset + opts.to}]]`
    );
    errorArr.push({
      idxFrom: opts.offset + opts.from,
      idxTo: opts.offset + opts.to,
      message: `Should be an URI.`,
      fix: null
    });
  }
}

function validateUri(str, originalOpts) {
  const defaults = {
    offset: 0,
    multipleOK: false,
    separator: "space", // or "comma"
    oneSpaceAfterCommaOK: false,
    leadingWhitespaceOK: false,
    trailingWhitespaceOK: false
  };
  const opts = Object.assign({}, defaults, originalOpts);
  console.log(
    `059 validateUri(): FINAL ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // checkForWhitespace() reports index range between the
  // first last non-whitespace character; nulls otherwise
  const { charStart, charEnd, errorArr } = checkForWhitespace(str, opts.offset);
  console.log(
    `070 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charStart`}\u001b[${39}m`} = ${charStart}`
  );
  console.log(
    `073 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`charEnd`}\u001b[${39}m`} = ${charEnd}`
  );
  console.log(
    `076 validateUri: from checkForWhitespace() received ${`\u001b[${33}m${`errorArr`}\u001b[${39}m`} = ${JSON.stringify(
      errorArr,
      null,
      4
    )}`
  );

  // now that we know where non-whitespace chars are, we can evaluate them

  if (Number.isInteger(charStart)) {
    if (opts.multipleOK) {
      // depends, is it comma or space-separated format
      if (opts.separator === "space") {
        console.log(`089 validateUri: use splitByWhitespace()`);
        splitByWhitespace(
          str,
          ([charFrom, charTo]) => {
            console.log(
              `094 validateUri: charFrom = ${charFrom}; charTo = ${charTo}`
            );
            const extractedName = str.slice(charFrom, charTo);
            console.log(
              `098 validateUri: ${`\u001b[${33}m${`extractedName`}\u001b[${39}m`} = ${JSON.stringify(
                extractedName,
                null,
                4
              )}`
            );
            validateValue(
              str,
              {
                from: charFrom,
                to: charTo,
                offset: opts.offset
              },
              errorArr
            );
          },
          ([whitespaceFrom, whitespaceTo]) =>
            isSingleSpace(
              str,
              {
                from: whitespaceFrom,
                to: whitespaceTo,
                offset: opts.offset
              },
              errorArr
            ),
          {
            from: charStart,
            to: charEnd
          }
        );
      } else {
        console.log(`130 validateUri: use processCommaSeparated()`);
        // TODO
        // tap "string-process-comma-separated"
      }
    } else {
      console.log(`135 validateUri: the whole attribute should be validated`);
      // we pass whole value to validateValue(), "cropping" the whitespace:
      validateValue(
        str,
        { from: charStart, to: charEnd, offset: opts.offset },
        errorArr
      );
    }
  }

  return errorArr;
}

export default validateUri;
