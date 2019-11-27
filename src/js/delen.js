function generateDeelSommen(nr) {
	var result = new Array();
	var i;
	for (i = 0; i < 10; i++) {
		var idx = i+1;
		var exercise = {lhs: (nr * idx), rhs: nr, result: idx};
		result.push(exercise);
	}
	return result;
}