<!DOCTYPE html>
<html lang="nl">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php echo "${title}"?></title>
		<link rel="stylesheet" href="css/bootstrap.min.css">
		<link rel="stylesheet" href="css/bootstrap-theme.min.css">
		<style>
		     body {
		       padding-top: 60px; /* 60px to make the container go all the way to the bottom of the topbar */
		     }
	    </style>
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body>
		<?php include "analyticstracking.php"; ?>
				
		<div class="navbar navbar-default navbar-fixed-top" role="navigation">
			<div class="container">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="index.php">Oefengemak.nl</a>
				</div>
				<div class="navbar-collapse collapse">
					<ul class="nav navbar-nav">
						<li class=''><a href="index.php">Home</a></li>
						<li class="dropdown">
							<a class="dropdown-toggle" data-toggle="dropdown" href="#">Sommen<span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li class=''><a href="splitsen.php">Splitsen</a></li>
								<li class=''><a href="tafels.php">Tafels</a></li>
								<li class=''><a href="delen.php">Delen</a></li>
							</ul>
						</li>
						<li class=''><a href="about.php">Over oefengemak</a></li>
						<li class=''><a href="faq.php">Veel gestelde vragen</a></li>
					</ul>
				</div>
			</div>
		</div>
		
		<?php require "" . $content . ".php"?>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
	</body>
</html>
