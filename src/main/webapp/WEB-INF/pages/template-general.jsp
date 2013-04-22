<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
	<head>
		<title>${param.title}</title>
		<link rel="stylesheet" href="css/home.css" type="text/css"/>
	</head>
	<body>
		<%@include file='analyticstracking.jsp'%>
		<div id="container">
			<div class="logo">
				<div class="logo-box">
					<a class="logo-img" href="/"><img src="images/logo.png" alt="Oefengemak"></a>
				</div>
			</div>
			<div id="header">
				<div id="quote"><p><nobr>Oefening baart kunst...</nobr></p></div>
				<div class="clearer" style="height: 75px;"></div>
				<div class="navigation">
					<div class="menu">
						<div class="menu-content">
							<div class="menu-start"></div>
							<ul>
								<li><a href="index.jsp">Home</a></li>
								<li><a href="about.jsp">Over Oefengemak</a></li>
								<li><a href="faq.jsp">Veel gestelde vragen</a></li>
							</ul>
							<div class="menu-end"></div>
						</div>
					</div>
				</div>
				<div class="clearer" style="height: 0px;"></div>
			</div>
			<div id="columns-container">
				<div id="content">
					<div id="content-wrapper">
						<div class="box">
							<h2>${param.titleShort}</h2>
							<div class="top-corners" style="display: block;"><div></div></div>
							<div class="box-content">
								<div class="box-content-2">
									<h1>${param.title}</h1>
									<br/>
									<jsp:include page="/WEB-INF/pages/${param.content}.jsp"/>
									<div class="box-bottom"></div>
								</div>
								<div class="bottom-corners"><div></div></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>