<!DOCTYPE html>
<html>
	<head>
		<title>Gelijknamige breuken</title>
		<link rel="stylesheet" href="css/general.css" type="text/css"/>
		<link type="text/css" href="css/redmond/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.8.16.custom.min.js"></script>
		
		<script src="js/generator.js"></script>
		<script src="js/breuken.js"></script>
		
		<style>
			.fraction .numerator {font-size: 80%; border-bottom: solid black 1px; text-align: center; padding-bottom: 1px;}
			.fraction .denominator {font-size: 80%; text-align: center;}
			.box>table>tbody>tr {vertical-align: middle;}
		</style>
		
		<script type="text/javascript">
			function renderRow(exercise, includeAnswer) {
				var cells = [exercise.lhs, exercise.operator, exercise.rhs, exercise.result];
				var answerIndex = 3;
				cells[0] = renderFraction(exercise.lhs);
				cells[2] = renderFraction(exercise.rhs);
				if (includeAnswer) {
					cells[answerIndex] = '<b>' + renderFraction(cells[answerIndex]) + '</b>';
				} else {
					cells[answerIndex] = '...';
				}
				return '<tr><td class="fraction">' + cells[0] + '</td><td>' + cells[1] + '</td><td class="fraction">' + cells[2] + '</td><td>=</td><td class="fraction">' + cells[3] + '</td></tr>';
			}
			
			function renderFraction(fraction) {
				var numerator = fraction.numerator;
				var denominator = fraction.denominator;
				
				var result = '<table border="0" cellspacing="0" cellpadding="0" align="center">';
				
				if (numerator == denominator)
					result += '<tr><td>1</td></tr>';
				else if (numerator == 0)
					result += '<tr><td>0</td></tr>';
				else if (Math.abs(numerator) > 0 && numerator > denominator) {
					var remainder = numerator % denominator;
					var wholeNumber = (numerator - remainder) / denominator;
					if (remainder > 0) {
						numerator = remainder;
						result += '<tr><td rowspan="2" style="padding-right: 0.3em;">' + wholeNumber + '</td><td class="numerator">' + numerator + '</td></tr><tr><td class="denominator">' + denominator + '</td></tr>';
					} else {
						result += '<tr><td style="padding-right: 0.3em;">' + wholeNumber + '</td></tr>';
					}
				} else {
					result += '<tr><td class="numerator">' + numerator + '</td></tr><tr><td class="denominator">' + denominator + '</td></tr>';
				}
				result += '</table>';
				return result;
			}
		
			function appendBlock(selector, exercises, includeAnswer) {
				var renderedBlock = '<div class="box"><table>';
				for (var idx in exercises) {
					var exercise = exercises[idx];
					renderedBlock += renderRow(exercise, includeAnswer);
				}
				renderedBlock += '</table></div>';
				$(selector).append(renderedBlock);
			}
		
			function renderBlock(exercises) {
				appendBlock('#studentBlockHolder', exercises, false);
				appendBlock('#teacherBlockHolder', exercises, true);
			}
			
			function renderBlocks(exercises, perBlock) {
				var blockCount = exercises.length / perBlock;
				for (i = 0; i < blockCount; i++) {
					var blockExercises = exercises.splice(0, perBlock);
					renderBlock(blockExercises);
				}
			}
			
			function generateExercises(maxFraction, perBlock, addBlockCount, subtractBlockCount, multiplyBlockCount) {
				var exercises = [];
				exercises = exercises.concat(generateAddFractions(maxFraction, perBlock * addBlockCount));
				exercises = exercises.concat(generateSubtractFractions(maxFraction, perBlock * subtractBlockCount));
				exercises = exercises.concat(generateMultiplyFractions(maxFraction, perBlock * subtractBlockCount));
				renderBlocks(exercises, perBlock);
			}
			
			$(document).ready(function() {
				$('#generate').button().click(function() {
					$('.box-container').empty();
					$('.form-title').text($('#formTitleInput').val());
					
					var maxFraction = $('#difficulty').val();
					var perBlock = parseInt($('#perBlock').val());
					var addBlockCount = parseInt($('#addBlockCount').val());
					var subtractBlockCount = parseInt($('#subtractBlockCount').val());
					var multiplyBlockCount = parseInt($('#multiplyBlockCount').val());
					
					generateExercises(maxFraction, perBlock, addBlockCount, subtractBlockCount, multiplyBlockCount);
				});
			});
		</script>
	</head>
	<body>
		<?php include "templates/analyticstracking.php"; ?>
		<div class="wrap">
			<div class="config ui-widget noprint">
				<div class="ui-widget-header">Opties</div>
				<div class="form-input ui-widget-content">
					<div class="">
						<label for="formTitleInput">Titel oefenblad</label><br/>
						<input type="text" id="formTitleInput"/>
					</div>
					<div class="">
						<select id="difficulty">
							<option value="10">Breuken t/m 10</option>
							<option value="50">Breuken t/m 50</option>
							<option value="100">Breuken t/m 100</option>
						</select>
					</div>
					<div class="">
						<label for="perBlock">Sommen per blok</label><br/>
						<input type="number" id="perBlock" value="5" min="1"/><br/>
						<label for="addBlockCount">Aantal optellen</label><br/>
						<input type="number" id="addBlockCount" min="0" value="4"/><br/>
						<label for="subtractBlockCount">Aantal aftrekken</label><br/>
						<input type="number" id="subtractBlockCount" min="0" value="4"/><br/>
						<label for="multiplyBlockCount">Aantal vermenigvuldigen</label><br/>
						<input type="number" id="multiplyBlockCount" min="0" value="4"/><br/>
					</div>
				</div>
				<button id="generate">Maak oefenblad</button>
			</div>
			<div class="form">
				<div class="page student">
					<div class="page-head">
						<div class="form-title">Titel oefenblad</div>
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
						<div class="form-title" >Titel oefenblad</div>
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