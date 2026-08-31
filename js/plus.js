function generatePlusSommen(min) {
	return nr => {
		const result = [];
		for (let i = min; i <= nr; i++) {
			const excercise = {lhs: i, rhs: (nr - i), result: nr};
			result.push(excercise);
		}
		return result;
	}
}