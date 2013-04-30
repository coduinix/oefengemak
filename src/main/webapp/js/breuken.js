function gcd(a, b) {
	return b ? gcd(b, a%b) : a;
}

function lcd(a, b) { 
	return ( a / gcd(a,b) ) * b; 
}

function Fraction(numerator, denominator) {
	this.numerator = numerator;
	this.denominator = denominator;
}

Fraction.prototype.reduce = function() {
	var factor = gcd(this.numerator, this.denominator);
	return new Fraction(this.numerator / factor, this.denominator / factor);
}

Fraction.prototype.convert = function(newDenominator) {
	var factor = newDenominator / this.denominator;
	return new Fraction(this.numerator * factor, this.denominator * factor);
}

function add(fraction, otherFraction) {
	var sum = function(a,b) {return a+b;};
	return combine(fraction, otherFraction, sum);
}

function combine(fraction, otherFraction, func) {
	if (fraction.denominator == otherFraction.denominator) {
		var newNumerator = func(fraction.numerator, otherFraction.numerator);
		return new Fraction(newNumerator, fraction.denominator);
	} else {
		var newDenominator = lcd(fraction.denominator, otherFraction.denominator);
		var converted = fraction.convert(newDenominator);
		var otherConverted = otherFraction.convert(newDenominator);
		return combine(converted, otherConverted, func).reduce();
	}
}

function randomFraction(maxDenominator) {
	var denominator = randRange(2, maxDenominator);
	var numerator = randRange(1, denominator - 1);
	return new Fraction(numerator, denominator);
}

function generateAddFractions(maxFraction, count) {
	var exercises = [];
	var maxDenominator = maxFraction;
	for (var i = 0; i < count; i++) {
		var lhs = randomFraction(maxDenominator);
		var rhs = randomFraction(maxDenominator);
		var result = add(lhs, rhs);
		exercises.push({lhs: lhs, rhs: rhs, result: result, operator: '+'});
	}
	console.log(exercises);
	return exercises;
}