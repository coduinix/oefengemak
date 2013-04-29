function gcd(a,b){
	return b ? gcd(b, a%b) : a;
};

function lcd(a, b) { 
	return ( a / gcd(a,b) ) * b; 
}

function reduce(numerator,denominator){
	gcd = gcd(numerator,denominator);
	return [numerator/gcd, denominator/gcd];
}