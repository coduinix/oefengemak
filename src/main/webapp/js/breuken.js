function gcd(a, b){
	return b ? gcd(b, a%b) : a;
};

function lcd(a, b) { 
	return ( a / gcd(a,b) ) * b; 
}

function Fraction(numerator, denominator) {
	this.numerator = numerator;
	this.denominator = denominator;
}

Fraction.prototype.reduce = function() {
	gcd = gcd(numerator, denominator);
	return new Fraction(numerator / gcd, denominator / gcd);
}

function generateAddFractions(maxFraction, count) {
	var exerciseOne = {lhs: new Fraction(1, 2), rhs: new Fraction(5, 6), result: new Fraction(8, 6), operator: '+'};
	var exerciseTwo = {lhs: new Fraction(1, 2), rhs: new Fraction(27, 28), result: new Fraction(41, 28), operator: '+'};
	
	return [exerciseOne, exerciseTwo];
}