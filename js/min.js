function generateMinSommen(nr) {
	var i;
	var result = [];
	for (i = 0; i < nr; i++) {
		var excercise = {lhs: nr, rhs: i, result: (nr - i)};
		result.push(excercise);
	}
	return result;
}