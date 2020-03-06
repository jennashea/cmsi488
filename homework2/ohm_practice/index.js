const ohm = require('ohm-js');

function isCanadianPostalCode(s) {
    const grammar = ohm.grammar(`CPC {
        c = "A".."Z" digit "A".."Z" " " digit "A".."Z" digit
    }`);
    return grammar.match(s).succeeded();
}

function isAdaFloat(s) {
    const grammar = ohm.grammar(`isAdaFloat {
        AdaNumLit   = basedLit | decimalLit
        decimalLit  = numeral ("." numeral)? (exponent)?
        basedLit    = numeral "#" basedNum ("." basedNum)? "#" (exponent)?
        numeral     = digit ("_"? digit)*
        basedNum    = hexDigit ("_"? hexDigit)*
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
        noThreeoO = one end | two end | four end | oO end | middleo end | endo end | "" end
        one = letter
        two = letter letter
        four = letter letter letter letter+
        middleo = letter "a".."n" letter | letter "p".."z" letter | letter "A".."N" letter | letter "P".."Z" letter
        endo = letter letter "a".."n" | letter letter "p".."z" | letter letter "A".."N" | letter letter "P".."Z"
        oO = letter ~"oO" | letter ~"Oo" | letter ~"oo" | letter ~"OO"
    }`);
    return grammar.match(s).succeeded();
}

function isDivisibleBy64(s){
    const grammar = ohm.grammar(`isDivisibleBy64 {
        value = min | "0"*
        min = ("0" | "1") min | "1000000" end
    }`)
    return grammar.match(s).succeeded();
}

function isEightThroughTwentyNine(s) {
    const grammar = ohm.grammar(`isEightThroughTwentyNine {
        value = ones | tens
        ones = "8" | "9"
        tens = ("1" | "2") digit
    }`);
    return grammar.match(s).succeeded();
}

function isMLComment(s) {
    const grammar = ohm.grammar(`isMLComment {
        ml = "(*" char
        char = digit char | space char | "*" char | "(" char | "*)" end
    }`);
    return grammar.match(s).succeeded();
}

function isNotDogDoorDenNoLookAround(s) {
    const grammar = ohm.grammar(`isNotDogDoorDenNoLookAround {
        dogDoorDen = one end | two end |  charsBeforeDDD end | charsAfterDDD end | caps end | charslengthFourPlus end
        one = any
        two = any any
        charsBeforeDDD = any charsBeforeDDD | any dog | any door | any den
        charsAfterDDD = "dog" any+ | "door" any+ | "den" any+
        charslengthFourPlus = any any any noR any* | "a".."c" any any any any* | any noO any any any* | any any noO any any*
        caps = cap*
        cap  = "A".."Z"
        noO = "a".."n" | "p".."z"
        noR = "a".."q" | "s".."z"
        den = "den"
        dog = "dog"
        door = "door"
    }`);
    return grammar.match(s).succeeded();
}

function isNotDogDoorDenWithLookAround(s) {
    const grammar = ohm.grammar(`isNotDogDoorDenWithLookAround {
        dogDoorDen = notDDD | dog | den | door
        dog = "dog" any+
        den = "den" any+
        door = "door" any+
        notDDD = ~"dog" ~"den" ~"door" any*
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
    isNotDogDoorDenWithLookAround,
    isDivisibleBy64
};
