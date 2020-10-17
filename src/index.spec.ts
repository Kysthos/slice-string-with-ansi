import "mocha";
import { expect } from "chai";
import chalk, { Color, Modifiers } from "chalk";
import stripAnsi from "strip-ansi";
import ansiRegex from "ansi-regex";
import { Chance } from "chance";
import sliceAnsi from ".";

// by passing the seed, we're sure provided "random" data will always be the same
const chance = new Chance(12345);

// just an array of method names...
const chalkMethods = getChalkMethods();
/** Returns a random chalk method name */
const randomChalkMethod = (): typeof Color | typeof Modifiers =>
  chance.pickone(chalkMethods);

/** helper function wrapping each letter of provided string into some random ansi formatting */
const ansifyString = (str: string) => {
  let ansified = "";
  for (const l of str) ansified += chalk[randomChalkMethod()](l);
  return ansified;
};

/**
 * This function checks two things:
 * 1. if the sliced plain text (after stripping ansi chars) returned
 * by the tested function is the same as the text returned by the string `slice` method
 * 2. if the return values of `match` method called with the ansi regex are deep equal
 * @param withAnsi
 * @param plain
 * @param start
 * @param end
 */
const checkStrings = (
  withAnsi: string,
  plain: string,
  start?: number,
  end?: number
) => {
  // slice the ansi string
  const sliced = sliceAnsi(withAnsi, start, end);
  // check if plain text in the sliced string is as expected
  expect(stripAnsi(sliced)).to.equal(plain.slice(start, end));
  // check if the same ansi matches are returned before and after slicing
  expect(withAnsi.match(ansiRegex())).to.be.deep.equal(
    sliced.match(ansiRegex())
  );
};

describe("Testing function for slicing strings containing ansi characters.", () => {
  it("should handle example with github", () => {
    // example from ansi regex
    const withAnsi = "\u001B]8;;https://github.com\u0007click\u001B]8;;\u0007";
    const plain = stripAnsi(withAnsi);
    const start = -3;

    checkStrings(withAnsi, plain, start);
  });

  it("should slice strings with ansi correctly", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    // pick a random start and end
    const start = chance.integer({ min: 0, max: Math.floor(str.length / 2) });
    const end = chance.integer({ min: start + 1, max: str.length - 1 });

    checkStrings(ansified, str, start, end);
  });

  it("should slice strings with no ansi correctly", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });

    // pick a random start and end
    const start = chance.integer({ min: 0, max: Math.floor(str.length / 2) });
    const end = chance.integer({ min: start + 1, max: str.length - 1 });

    checkStrings(str, str, start, end);
  });

  it("should slice correctly when start argument wasn't provided", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    checkStrings(ansified, str);
  });

  it("should slice correctly when end argument wasn't provided", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    // pick a random start and end
    const start = chance.integer({ min: 0, max: Math.floor(str.length / 2) });

    checkStrings(ansified, str, start);
  });

  it("should handle negative arguments correctly", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    // pick a random start and end
    const start = chance.integer({
      min: -str.length,
      max: -Math.floor(str.length / 2),
    });
    const end = chance.integer({ min: start + 1, max: -1 });

    checkStrings(ansified, str, start, end);
  });

  it("should handle correctly non-integer arguments", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    // pick a random start and end
    const start = chance.floating({ min: 0, max: Math.floor(str.length / 2) });
    const end = chance.floating({ min: start + 1, max: str.length - 1 });

    checkStrings(ansified, str, start, end);
  });

  it("should handle correctly non-integer negative arguments", () => {
    // get random text
    const str = chance.paragraph({ sentences: 10 });
    // add ansi characters to the text
    const ansified = ansifyString(str);

    // pick a random start and end
    const start = -23.1;
    const end = -6.9;

    checkStrings(ansified, str, start, end);
  });

  it("should throw an error when first argument is not a string", () => {
    expect(() => sliceAnsi((9 as unknown) as string)).to.throw(TypeError);
    expect(() => sliceAnsi((undefined as unknown) as string)).to.throw(
      TypeError
    );
  });
});

/**
 * Wrapped in a function just not to have such a long
 * array at the top of the file...
 */
function getChalkMethods(): (typeof Color | typeof Modifiers)[] {
  return [
    "black",
    "red",
    "green",
    "yellow",
    "blue",
    "magenta",
    "cyan",
    "white",
    "gray",
    "grey",
    "blackBright",
    "redBright",
    "greenBright",
    "yellowBright",
    "blueBright",
    "magentaBright",
    "cyanBright",
    "whiteBright",
    "bgBlack",
    "bgRed",
    "bgGreen",
    "bgYellow",
    "bgBlue",
    "bgMagenta",
    "bgCyan",
    "bgWhite",
    "bgGray",
    "bgGrey",
    "bgBlackBright",
    "bgRedBright",
    "bgGreenBright",
    "bgYellowBright",
    "bgBlueBright",
    "bgMagentaBright",
    "bgCyanBright",
    "bgWhiteBright",
    "reset",
    "bold",
    "dim",
    "italic",
    "underline",
    "inverse",
    "hidden",
    "strikethrough",
    "visible",
  ];
}
