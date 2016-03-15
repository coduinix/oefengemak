<!DOCTYPE html>
<html>
	<head>
		<title>Splits sommen</title>
		<link rel="stylesheet" href="css/general.css" type="text/css"/>
		<link type="text/css" href="css/redmond/jquery-ui-1.8.16.custom.css" rel="stylesheet" />
		
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.8.16.custom.min.js"></script>
		
		<script src="js/generator.js"></script>
		<script src="js/splitsen.js"></script>
		
		<script type="text/javascript">
		
			function appendBlock(selector, exercise, includeAnswer) {
				var renderedBlock = '<div class="exercise"><table cellspacing="0">';
				var topText = exercise.result;
				var leftText = exercise.lhs;
				var rightText = includeAnswer ? '<b>' + exercise.rhs + '</b>' : '&nbsp;';
				
				renderedBlock += '<tr><td class="splitTop" colspan="2">' + topText + '</td></tr>';
				renderedBlock += '<tr><td class="splitPart splitLeft">' + leftText + '</td><td class="splitPart splitRight">' + rightText + '</td></tr>';
				renderedBlock += '</table></div>';
				$(selector).append(renderedBlock);
			}
		
			function renderBlock(exercise) {
				appendBlock('#studentBlockHolder', exercise, false);
				appendBlock('#teacherBlockHolder', exercise, true);
			}
			
			function renderExercises(exercises) {
				var i;
				for (i = 0; i < exercises.length; i++) {
					renderBlock(exercises[i]);
				}
			}
			
			function generateExercises(nrs, exerciseCount) {
				var exercises = generateMixedExercises(nrs, exerciseCount, generateSplitsSommen);
				renderExercises(exercises);
			}
			
			
			$(document).ready(function() {
				$('#generate').button().click(function() {
					$('.box-container').empty();
					var nrs = new Array();
					$(':checkbox:checked').each(function (idx, cb) {
						nrs.push(parseInt(cb.value));
					});
					var exerciseCount = parseInt($('#exerciseCount').val());
					$('.form-title').text($('#formTitleInput').val());
					generateExercises(nrs, exerciseCount);
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
						<script type="text/javascript">
							var i;
							for (i = 0; i < 20; i++) {
								var nr = i+1;
								document.write("<input type='checkbox' value='" + nr + "'>" + nr + "</input><br/>");
							}
						</script>
					</div>
					<div class="">
						<label for="exerciseCount">Aantal sommen</label><br/>
						<input type="number" id="exerciseCount" value="20" min="1"/><br/>
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
						<div class="form-title">Titel oefenblad</div>
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
