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

Fraction.prototype.add = function (otherFraction) {
	if (this.denominator == otherFraction.denominator) {
		return new Fraction(this.numerator + otherFraction.numerator, this.denominator);
	} else {
		var newDenominator = lcd(this.denominator, otherFraction.denominator);
		var converted = this.convert(newDenominator);
		var otherConverted = otherFraction.convert(newDenominator);
		return converted.add(otherConverted).reduce();
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
		var result = lhs.add(rhs);
		exercises.push({lhs: lhs, rhs: rhs, result: result, operator: '+'});
	}
	console.log(exercises);
	return exercises;
}