declare type Callback = (cbObj: {
  tag: {
    attributes: [string?][];
    lastClosingBracketAt: number;
    lastOpeningBracketAt: number;
    slashPresent: number;
    leftOuterWhitespace: number;
    onlyPlausible: boolean;
    nameStarts: number;
    nameContainsLetters: boolean;
    nameEnds: number;
    name: string;
  };
  deleteFrom: number;
  deleteTo: number;
  insert: string;
  rangesArr: [number, number, (string | null)?][];
  proposedReturn: [number, number, (string | null)?][];
}) => void;

declare namespace stringStripHtml {
  interface Options {
    /**
    Ignore any tags upon request.
    @default []
    */
    readonly ignoreTags?: string[];

    /**
    Only strip these tags.
    @default []
    */
    readonly onlyStripTags?: string[];

    /**
    Strip tag pairs along with contents in-between.
    @default ['script', 'style', 'xml']
    */
    readonly stripTogetherWithTheirContents?: string[];

    /**
    Should we skip recursive HTML decoding (will decode multiple-times encoded source).
    @default false
    */
    skipHtmlDecoding?: boolean;

    /**
    Should we trim only strings from the outer edges of the input string.
    By default any whitespace, including non-breaking spaces will be trimmed.
    @default false
    */
    trimOnlySpaces?: boolean;

    /**
    It is used to activate text version generation functionality.
    @default false | plain object
    */
    dumpLinkHrefsNearby?:
      | false
      | null
      | {
          enabled?: boolean;
          putOnNewLine?: boolean;
          wrapHeads?: string;
          wrapTails?: string;
        };

    /**
    Callback function to granularly control the output of a program.
    @default false
    */
    cb?: false | null | Callback;
  }

  interface Output {
    log: { timeTakenInMilliseconds: number };
    result: string;
    ranges: null | readonly [number, number, (string | null)?][];
    allTagLocations: readonly [number, number][];
    filteredTagLocations: readonly [number, number][];
  }
}

declare const stringStripHtml: {
  /**
  Strips HTML tags from strings. No parser, accepts mixed sources.

  @param input - String to strip HTML tags from
  @param options (optional) - Options bag, a plain object
  @returns plain object

  */
  (inputs: string, options?: stringStripHtml.Options): stringStripHtml.Output;
};

export = stringStripHtml;
