function gcd(a, b) {
	a = Math.abs(a);
	b = Math.abs(b);
	return b ? gcd(b, a%b) : a;
}

function lcd(a, b) { 
	a = Math.abs(a);
	b = Math.abs(b);
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
	var func = function(a,b) {return a+b;};
	return combine(fraction, otherFraction, func);
}

function subtract(fraction, otherFraction) {
	var func = function(a,b) {return a-b;};
	return combine(fraction, otherFraction, func);
}

function multiply(fraction, otherFraction) {
	var numerator = fraction.numerator * otherFraction.numerator;
	var denominator = fraction.denominator * otherFraction.denominator;
	return new Fraction(numerator, denominator);
}

function combine(fraction, otherFraction, func) {
	if (fraction.denominator == otherFraction.denominator) {
		var newNumerator = func(fraction.numerator, otherFraction.numerator);
		return new Fraction(newNumerator, fraction.denominator);
	} else {
		var newDenominator = lcd(fraction.denominator, otherFraction.denominator);
		var converted = fraction.convert(newDenominator);
		var otherConverted = otherFraction.convert(newDenominator);
		return combine(converted, otherConverted, func);
	}
}

function randomFraction(maxDenominator) {
	var denominator = randRange(2, maxDenominator);
	var numerator = randRange(1, denominator - 1);
	return new Fraction(numerator, denominator);
}

function generateFractionExercises(maxDenominator, count, combineFunc, operator) {
	var exercises = [];
	for (var i = 0; i < count; i++) {
		var lhs = randomFraction(maxDenominator);
		var rhs = randomFraction(maxDenominator);
		var result = combineFunc(lhs, rhs).reduce();
		exercises.push({lhs: lhs, rhs: rhs, result: result, operator: operator});
	}
	return exercises;
}

function generateAddFractions(maxDenominator, count) {
	return generateFractionExercises(maxDenominator, count, add, '+');
}

function generateSubtractFractions(maxDenominator, count) {
	return generateFractionExercises(maxDenominator, count, subtract, '-');
}

function generateMultiplyFractions(maxDenominator, count) {
	return generateFractionExercises(maxDenominator, count, multiply, 'x');
}