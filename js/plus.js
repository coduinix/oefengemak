function generatePlusSommen(nr) {
	var i;
	var result = [];
	for (i = 0; i < nr; i++) {
		var excercise = {lhs: i, rhs: (nr - i), result: nr};
		result.push(excercise);
	}
	return result;
}