<!DOCTYPE html>
<html>
	<head>
		<title>Tafel sommen</title>
		<link rel="stylesheet" href="css/general.css" type="text/css"/>
		<link type="text/css" href="css/redmond/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.8.16.custom.min.js"></script>
		
		<script src="js/generator.js"></script>
		<script src="js/tafels.js"></script>
		
		<script type="text/javascript">
			function renderRow(exercise, exerciseType, includeAnswer) {
				var cells = [exercise.lhs, exercise.rhs, exercise.result];
				var modIndex;
				
				switch (exerciseType) {
					case 'lhs' :
						modIndex = 0;
						break;
					case 'rhs' :
						modIndex = 1;
						break;
					case 'result' :
						modIndex = 2;
						break;
				}
				if (includeAnswer) {
					cells[modIndex] = '<b>' + cells[modIndex] + '</b>';
				} else {
					cells[modIndex] = '...';
				}
				return '<tr><td>' + cells[0] + '</td><td>x</td><td>' + cells[1] + '</td><td>=</td><td>' + cells[2] + '</td></tr>';
			}
		
			function appendBlock(selector, exercises, exerciseType, includeAnswer) {
				var renderedBlock = '<div class="box"><table>';
				for (var idx in exercises) {
					var exercise = exercises[idx];
					renderedBlock += renderRow(exercise, exerciseType, includeAnswer);
				}
				renderedBlock += '</table></div>';
				$(selector).append(renderedBlock);
			}
		
			function renderBlock(exercises, exerciseType) {
				appendBlock('#studentBlockHolder', exercises, exerciseType, false);
				appendBlock('#teacherBlockHolder', exercises, exerciseType, true);
			}
			
			function renderBlocks(exercises, perBlock, blockCount, exerciseType) {
				for (i = 0; i < blockCount; i++) {
					var blockExercises = exercises.splice(0, perBlock);
					renderBlock(blockExercises, exerciseType);
				}
			}
			
			function renderExercises(exercises, perBlock, lhsBlockCount, rhsBlockCount, resultBlockCount) {
				var start = 0;
				renderBlocks(exercises, perBlock, resultBlockCount, 'result');
				renderBlocks(exercises, perBlock, rhsBlockCount, 'rhs');
				renderBlocks(exercises, perBlock, lhsBlockCount, 'lhs');
			}
			
			function generateExercises(tables, perBlock, lhsBlockCount, rhsBlockCount, resultBlockCount) {
				var totalCount = perBlock * (lhsBlockCount + rhsBlockCount + resultBlockCount);
				var exercises = generateMixedExercises(tables, totalCount, generateTafelSommen);
				
				renderExercises(exercises, perBlock, lhsBlockCount, rhsBlockCount, resultBlockCount);
			}
			
			$(document).ready(function() {
				$('#generate').button().click(function() {
					$('.box-container').empty();
					var tables = new Array();
					$(':checkbox:checked').each(function (idx, cb) {
						tables.push(parseInt(cb.value));
					});
					var perBlock = parseInt($('#perBlock').val());
					var resultBlockCount = parseInt($('#resultBlockCount').val());
					var lhsBlockCount = parseInt($('#lhsBlockCount').val());
					var rhsBlockCount = parseInt($('#rhsBlockCount').val());
					$('.form-title').text($('#formTitleInput').val());
					generateExercises(tables, perBlock, lhsBlockCount, rhsBlockCount, resultBlockCount);
				});
			});
		</script>
	</head>
	<body>
		<%@include file='analyticstracking.jsp'%>
		<div class="wrap">
			<div class="config ui-widget noprint">
				<div class="ui-widget-header">Configuratie</div>
				<div class="form-input ui-widget-content">
					<div class="">
						<label for="formTitleInput">Titel formulier</label><br/>
						<input type="text" id="formTitleInput"/>
					</div>
					<div class="">
						<input type="checkbox" value="0">Tafel 0</input><br/>
						<input type="checkbox" value="1">Tafel 1</input><br/>
						<input type="checkbox" value="2">Tafel 2</input><br/>
						<input type="checkbox" value="3">Tafel 3</input><br/>
						<input type="checkbox" value="4">Tafel 4</input><br/>
						<input type="checkbox" value="5">Tafel 5</input><br/>
						<input type="checkbox" value="6">Tafel 6</input><br/>
						<input type="checkbox" value="7">Tafel 7</input><br/>
						<input type="checkbox" value="8">Tafel 8</input><br/>
						<input type="checkbox" value="9">Tafel 9</input><br/>
						<input type="checkbox" value="10">Tafel 10</input><br/>
					</div>
					<div class="">
						<label for="perBlock">Sommen per blok</label><br/>
						<input type="number" id="perBlock" value="5" min="1"/><br/>
						<label for="resultBlockCount">Aantal 6x5=...</label><br/>
						<input type="number" id="resultBlockCount" min="0" value="4"/><br/>
						<label for="lhsBlockCount">Aantal ...x5=30</label><br/>
						<input type="number" id="lhsBlockCount" min="0" value="4"/><br/>
						<label for="rhsBlockCount">Aantal 6x...=30</label><br/>
						<input type="number" id="rhsBlockCount" min="0" value="0"/><br/>
					</div>
				</div>
				<button id="generate">Genereer formulier</button>
			</div>
			<div class="form">
				<div class="page student">
					<div class="page-head">
						<div class="form-title">Formulier titel</div>
						<div class="name-input">
							<span>Naam:</span>
							<span class="name-placeholder">______________</span>
						</div>
					</div>
					<div id="studentBlockHolder" class="box-container student">
					</div>
				</div>
				<div class="page teacher">
					<div class="page-head">
						<div class="form-title" >Formulier titel</div>
						<div class="name-input">
							<span>Antwoordenvel</span>
						</div>
					</div>
					<div id="teacherBlockHolder" class="box-container teacher">
					</div>
				</div>
			</div>
		</div>
	</body>
</html>