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
	var exerciseOne = {lhs: [1, 2], rhs: [5, 6], result: [8, 6], operator: '+'};
	var exerciseTwo = {lhs: [1, 2], rhs: [27, 28], result: [41, 28], operator: '+'};
	
	return [exerciseOne, exerciseTwo];
}