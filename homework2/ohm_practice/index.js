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

function isNotThreeEndingInOO(s) {
    const grammar = ohm.grammar(`isNotThreeEndingInOO {
        noThreeoO = one end | two end | four end | oo end | mido end | endo end | "" end 
        one = letter
        two = letter letter
        four = letter letter letter letter+
        mido = letter "a".."n" letter | letter "p".."z" letter |letter "A".."N" letter | letter "P".."Z" letter 
        endo = letter letter "a".."n" | letter letter "p".."z" | letter letter "A".."N" | letter letter "P".."Z"
        oo = letter ~"oO" | letter ~"Oo" | letter ~"oo" | letter ~"OO"
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

function isNotDogDoorDenNoLookAround(s) {
    const grammar = ohm.grammar(`isNotDogDoorDenNoLookAround {
        dogDoorDen = one end | two end |  ddPlus end | dddPlus end | caps end | fourPlus end
        one = any
        two = any any
        ddPlus = char 
        char = any char | any dog | any door | any den
        den = "den"
        dog = "dog"
        door = "door"
        dddPlus = "dog" any+ | "door" any+ | "den" any+
        fourPlus = any any any noR any* | "a".."c" any any any any* | any noO any any any* | any any noO any any*
        caps = cap*
        cap  = "A".."Z"
        noE = "a".."d" | "f".."z"
        noN = "a".."m" | "o".."z"
        noO = "a".."n" | "p".."z"
        noG = "a".."f" | "h".."z"
        noR = "a".."q" | "s".."z"
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
    isNotThreeEndingInOO,
    isEightThroughTwentyNine,
    isAdaFloat,
    isMLComment,
    isNotDogDoorDenNoLookAround,
    isNotDogDoorDenWithLookAround
};
