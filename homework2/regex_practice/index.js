function isCanadianPostalCode(s) {
    return /[A-Z]\d[A-Z] \d[A-Z]\d/.test(s);
}

function isVisa(s) {
    return /^4(\d{15}|\d{12})$/.test(s);
}

function isMasterCard(s) {
    return /^5[1-5]\d{14}$/.test(s);
}

function isNotThreeEndingInOO(s) {
    return /(^$|.{3}(?<![oO]{2}))/.test(s);
}

function isDivisibleBy64(s) {
    return /^([01]*000000)$/.test(s);
}

function isEightThroughTwentyNine(s) {
    return /^[89]|[12]\d$/.test(s);
}

function isAdaFloat(s) {
    return /^\d(_?\d)*(\.\d(_?\d)*)?(([Ee]\+?\d(_?\d)*)|([Ee]\-\d(_?\d)*))?$/.test(s);
}
module.exports = {
    isCanadianPostalCode,
    isVisa,
    isMasterCard,
    isAdaFloat,
    isEightThroughTwentyNine,
    isNotThreeEndingInOO,
    isDivisibleBy64
};
