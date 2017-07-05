<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page session="true" %>
<html>
<head>
	<title>Report</title>
	<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="<c:url value="/resources/css/treecmp.css"/>" type="text/css" />
	
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	<script src="http://d3js.org/d3.v3.min.js"></script>
	<script src="<c:url value="/resources/js/navigation.js"/>"></script>
	<script src="http://code.jquery.com/jquery-1.9.1.js"></script>
	<script src="<c:url value="/resources/js/jquery.tablesorter.js" />"></script>
	
	<script type="text/javascript">
		$(function() {
			$("#reportTable").tablesorter();
		});
	</script>
</head>
<body>
	<div class="container-fluid">
	<!-- NAVIGATION BAR -->
	<nav class="navbar navbar-default navbar-fixed-top">
		<div class="container-fluid">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle collapsed" 
				data-toggle="collapse" 
				data-target="#mainmenu" 
				aria-expanded="false">
					<span class="sr-only">Navigation switch</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">
					<img alt="TreeCmp" src="<c:url value="/resources/img/treecmp_logo.jpg"/>"/></img>
				</a>
			</div>
			
			<div class="collapse navbar-collapse" id="mainmenu">
				<ul class="nav navbar-nav">
					<li class="active"><a href="#">Main page</a></li>
					<li><a href="#">Results</a></li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li><a href="#"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span></a></li>
					<li><a href="#"><span class="glyphicon glyphicon glyphicon-info-sign" aria-hidden="true"></span></a></li>
				</ul>
			</div>
		</div>
	</nav>
	<!-- END OF NAVIGATION BAR -->
		<div class="form-group" >
			<p>${report}</p>
			<c:forEach var="metric" items="${metrics}">
				<c:out value="${metric}" />
				<br>
			</c:forEach>
		</div>
	</div>
	<!-- FOOTER -->
	<div class="row footer">
		<div class="col-xs-12 text-center">
			Gdansk University of Technology &copy; 2017
		</div>
	</div>
	<!-- END OF FOOTER -->
</body>

<script type="text/javascript">
	$(window).resize(function(){
	  if ($(window).width() >= 768){
	  	$("#reportTable").removeClass("table-condensed");  		  	
	  }
	  if ($(window).width() <= 768){
	  	$("#reportTable").addClass("table-condensed");
	  }
	});
</script>

</html>
