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
        visa = "4" d d d d d d d d d d d d d d d end --fifteen
             | "4" d d d d d d d d d d d d end --twelve
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

function isMLComment(s) {
    const grammar = ohm.grammar(`isMLComment {
        ml = "(*" char
        char = val 
        val = digit val | space val | "*" val | "(" val | term end
        term  = "*)"
    }`);
    return grammar.match(s).succeeded();
}

function isNotDogDoorDenWithLookAround(s) {
    const grammar = ohm.grammar(`isNotDogDoorDenWithLookAround {
        dogDoorDen = ddd | dog | den | door
        dog = "dog" any+
        den = "den" any+
        door = "door" any+
        ddd = ~"dog" ~"den" ~"door" any* 
    }`);
    return grammar.match(s).succeeded();
}


module.exports = {
    isCanadianPostalCode,
    isVisa,
    isMasterCard,
    isEightThroughTwentyNine,
    isAdaFloat,
    isMLComment,
    isNotDogDoorDenWithLookAround
};
