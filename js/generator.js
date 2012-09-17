
function ExcerciseSet(nr, func) {
	this.nr = nr;
	this.func = func;
	this.exercises = new Array();
}

ExcerciseSet.prototype.initExercises = function () {
	this.exercises = this.func(this.nr);
	shuffleArray(this.exercises);
}

ExcerciseSet.prototype.pickValue = function () {
	if (this.exercises.length == 0) {
		this.initExercises();
	}
	var result = this.exercises.pop()
	return result;
};

function generateMixedExercises(nrs, exerciseCount) {
	var allExercises = generateAllExercises(nrs, exerciseCount);
	shuffleArray(allExercises);
	return allExercises;
}

function generateAllExercises(nrs, exerciseCount, func) {
	var setIdx = 0;
	var allExercises = new Array();
	var excerciseSets = new Array();
	for (var nr in nrs) {
		excerciseSets.push(new ExcerciseSet(nrs[nr], func));
	}
	shuffleArray(excerciseSets);
	var i;
	for (i = 0; i < exerciseCount; i++) {
		if (setIdx > excerciseSets.length - 1) {
			setIdx = 0;
		}
		var exercise = excerciseSets[setIdx].pickValue()
		allExercises[i] = exercise;
		setIdx++;
	}
	return allExercises;
}