function generateSplitsSommen(nr) {
	var i;
	var result = new Array();
	for (i = 0; i < nr; i++) {
		var excercise = {lhs: i, rhs: (nr - i), result: nr};
		result.push(excercise);
	}
	return result;
}