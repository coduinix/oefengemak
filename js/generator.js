function shuffleArray(target)  {
	var temp = [];
	while (target.length) temp.push(target.splice(Math.random() * target.length, 1)[0]);
	while (temp.length) target.push(temp.pop());
	return target;
}

function TableSet(nr) {
	this.nr = nr;
	this.exercises = new Array();
}

TableSet.prototype.initExercises = function () {
	var i;
	for (i = 0; i < 10; i++) {
		var idx = i+1;
		var exercise = {lhs: idx, rhs: this.nr, result: (idx * this.nr)};
		this.exercises[i] = exercise;
	}
	shuffleArray(this.exercises);
}

TableSet.prototype.pickValue = function () {
	if (this.exercises.length == 0) {
		this.initExercises();
	}
	var result = this.exercises.pop()
	return result;
};

function generateMixedExercises(tables, exerciseCount) {
	var allExercises = generateAllExercises(tables, exerciseCount);
	shuffleArray(allExercises);
	return allExercises;
}

function generateAllExercises(tables, exerciseCount) {
	var tableIdx = 0;
	var allExercises = new Array();
	var tableSets = new Array();
	for (var t in tables) {
		tableSets.push(new TableSet(tables[t]));
	}
	var i;
	for (i = 0; i < exerciseCount; i++) {
		if (tableIdx > tableSets.length - 1) {
			tableIdx = 0;
		}
		var exercise = tableSets[tableIdx].pickValue()
		allExercises[i] = exercise;
		tableIdx++;
	}
	return allExercises;
}