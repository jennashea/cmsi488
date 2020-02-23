const ohm = require('ohm-js');

function isCanadianPostalCode(s) {
    const grammar = ohm.grammar(`CPC {
        c = "A".."Z" digit "A".."Z" " " digit "A".."Z" digit
    }`);
    return grammar.match(s).succeeded();
}

function isAdaFloat(s) {
    const grammar = ohm.grammar(`isAdaFloat {
        AdaNumLit   = decimalLit | basedLit

        decimalLit  = numeral ("." numeral)? (exponent)?
        basedLit    = numeral "#" basedNum ("." basedNum)? "#" (exponent)?

        numeral     = digit ("_"? digit)*
        basedNum    = extendNum ("_"? extendNum)*
        extendNum   = hexDigit
        exponent    = ("E"|"e")("+"|"-")? numeral
    }`);
    return grammar.match(s).succeeded();
}

function isVisa(s) {
    const grammar = ohm.grammar(`isVisa {
        Visa = "4" d d d d d d d d d d d d d d d --fifteen
             | "4" d d d d d d d d d d d d --twelve
        d = digit
    }`);
    return grammar.match(s).succeeded();
}

function isMasterCard(s) {
    const grammar = ohm.grammar(`isMasterCard {
        Master = start d d d d d d d d d d d d d d
        start = "50" | "51" | "52" | "53" | "54" | "55"
        d = digit
    }`);
    return grammar.match(s).succeeded();
}

function isEightThroughTwentyNine(s) {
    const grammar = ohm.grammar(`isEightThroughTwentyNine {
        value = ones | tens
        ones = "8" | "9"
        tens = "1" digit | "2" digit
    }`);
    return grammar.match(s).succeeded();
}

module.exports = {
    isCanadianPostalCode,
    isVisa,
    isMasterCard,
    isEightThroughTwentyNine,
    isAdaFloat,
};
