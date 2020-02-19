function isCanadianPostalCode(s) {
    return /[A-Z]\d[A-Z] \d[A-Z]\d/.test(s);
}
function isNotThreeEndingInOO(s) {
	return /(^$|.{3}(?<![oO]{2}))/.test(s);
}
function isEightThroughTwentyNine(s) {
    return /[89]|[12]\d/.test(s);
}
function isAdaFloat(s) {
    return  /\d(_?\d)*
            (\.\d(_?\d))?
            ((E+?(_?\d)*)|(E-(_?\d)))*/.test(s);
}
module.exports = {
    isCanadianPostalCode,
    isAdaFloat,
    isEightThroughTwentyNine,
    isNotThreeEndingInOO
};
