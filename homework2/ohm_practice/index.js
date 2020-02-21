const ohm = require('ohm-js');

function isCanadianPostalCode(s) {
    const grammar = ohm.grammar(` CPC {
        c = "A".."Z" digit "A".."Z" " " digit "A".."Z" digit
    }`);
    return grammar.match(s).succeeded();
}

function isAdaFloat(s) {
    const grammar = ohm.grammar(` isAdaFloat {
        AdaNumLit   = decimalLit | basedLit
        decimalLit  = numeral ("."numeral)? (exponent)?
        basedLit    = numeral "#" basedNum ("."basedNum)? "#" (exponent)?
        numeral     = digit ("_"? digit)*
        basedNum    = hexDigit+ ("_"? hexDigit+)*
        exponent    = (("E"|"e")("+"|"-")? numeral)?
    }`);
    return grammar.match(s).succeeded();
}

module.exports = {
    isCanadianPostalCode,
    isAdaFloat,
};
