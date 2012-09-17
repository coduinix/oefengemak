function shuffleArray(target)  {
	var temp = [];
	while (target.length) temp.push(target.splice(Math.random() * target.length, 1)[0]);
	while (temp.length) target.push(temp.pop());
	return target;
}