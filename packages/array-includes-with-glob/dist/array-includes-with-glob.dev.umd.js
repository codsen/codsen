/**
 * @name array-includes-with-glob
 * @fileoverview Like _.includes but with wildcards
 * @version 3.0.14
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/array-includes-with-glob/}
 */

(function (global, factory) {
typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
typeof define === 'function' && define.amd ? define(['exports'], factory) :
(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.arrayIncludesWithGlob = {}));
}(this, (function (exports) { 'use strict';

var escapeStringRegexp = string => {
	if (typeof string !== 'string') {
		throw new TypeError('Expected a string');
	}

	// Escape characters with special meaning either inside or outside character sets.
	// Use a simple backslash escape when it’s always valid, and a \unnnn escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
	return string
		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
		.replace(/-/g, '\\x2d');
};

const regexpCache = new Map();

function sanitizeArray(input, inputName) {
	if (!Array.isArray(input)) {
		switch (typeof input) {
			case 'string':
				input = [input];
				break;
			case 'undefined':
				input = [];
				break;
			default:
				throw new TypeError(`Expected '${inputName}' to be a string or an array, but got a type of '${typeof input}'`);
		}
	}

	return input.filter(string => {
		if (typeof string !== 'string') {
			if (typeof string === 'undefined') {
				return false;
			}

			throw new TypeError(`Expected '${inputName}' to be an array of strings, but found a type of '${typeof string}' in the array`);
		}

		return true;
	});
}

function makeRegexp(pattern, options) {
	options = {
		caseSensitive: false,
		...options
	};

	const cacheKey = pattern + JSON.stringify(options);

	if (regexpCache.has(cacheKey)) {
		return regexpCache.get(cacheKey);
	}

	const negated = pattern[0] === '!';

	if (negated) {
		pattern = pattern.slice(1);
	}

	pattern = escapeStringRegexp(pattern).replace(/\\\*/g, '[\\s\\S]*');

	const regexp = new RegExp(`^${pattern}$`, options.caseSensitive ? '' : 'i');
	regexp.negated = negated;
	regexpCache.set(cacheKey, regexp);

	return regexp;
}

var matcher = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return [];
	}

	const isFirstPatternNegated = patterns[0][0] === '!';

	patterns = patterns.map(pattern => makeRegexp(pattern, options));

	const result = [];

	for (const input of inputs) {
		// If first pattern is negated we include everything to match user expectation.
		let matches = isFirstPatternNegated;

		for (const pattern of patterns) {
			if (pattern.test(input)) {
				matches = !pattern.negated;
			}
		}

		if (matches) {
			result.push(input);
		}
	}

	return result;
};

var isMatch = (inputs, patterns, options) => {
	inputs = sanitizeArray(inputs, 'inputs');
	patterns = sanitizeArray(patterns, 'patterns');

	if (patterns.length === 0) {
		return false;
	}

	return inputs.some(input => {
		return patterns.every(pattern => {
			const regexp = makeRegexp(pattern, options);
			const matches = regexp.test(input);
			return regexp.negated ? !matches : matches;
		});
	});
};
matcher.isMatch = isMatch;

var version$1 = "3.0.14";

const version = version$1;
const defaults = {
    arrayVsArrayAllMustBeFound: "any",
    caseSensitive: true,
};
/**
 * Like _.includes but with wildcards
 */
function includesWithGlob(originalInput, stringToFind, originalOpts) {
    // maybe we can end prematurely:
    if (!originalInput.length || !stringToFind.length) {
        return false; // because nothing can be found in it
    }
    const opts = { ...defaults, ...originalOpts };
    const input = typeof originalInput === "string"
        ? [originalInput]
        : Array.from(originalInput);
    if (typeof stringToFind === "string") {
        return input.some((val) => matcher.isMatch(val, stringToFind, { caseSensitive: opts.caseSensitive }));
    }
    // array then.
    if (opts.arrayVsArrayAllMustBeFound === "any") {
        return stringToFind.some((stringToFindVal) => input.some((val) => matcher.isMatch(val, stringToFindVal, {
            caseSensitive: opts.caseSensitive,
        })));
    }
    return stringToFind.every((stringToFindVal) => input.some((val) => matcher.isMatch(val, stringToFindVal, {
        caseSensitive: opts.caseSensitive,
    })));
}

exports.defaults = defaults;
exports.includesWithGlob = includesWithGlob;
exports.version = version;

Object.defineProperty(exports, '__esModule', { value: true });

})));
