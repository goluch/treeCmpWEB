<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<%@taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@page session="true" %>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="<c:url value="/resources/css/phylo.io.style.css"/>" type="text/css" />
<link rel="stylesheet" href="<c:url value="/resources/css/simple-sidebar.css"/>" type="text/css" />

<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script src="<c:url value="/resources/js/circular-json.js"/>"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
<script src="<c:url value="/resources/js/bootstrap-treecmp.js"/>"></script>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script src="<c:url value="/resources/js/spin.min.js"/>"></script>
<script src="<c:url value="/resources/js/treecompare.js"/>"></script>
<script src="<c:url value="/resources/js/underscore.min.js"/>"></script>
<script src="<c:url value="/resources/js/drawtree.js"/>"></script>
<script src="http://code.jquery.com/jquery-2.1.4.js"></script>
<script type="text/javascript">
	$(document).ready(getTrees(${firstTreeId}, ${secondTreeId}, ${firstTreeId}, ${secondTreeId}));
</script>
<title>Report</title>
</head>
<body>
   <div id="myModal" class="modal fade">
        <div class="modal-dialog"> <div class="modal-content">
            <div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h5 class="modal-title">Link to share tree visualisation</h5></div>
            <div class="modal-body">
                <a href="" id="exportURLInSingle" ></a>
            </div>
        </div>
        </div>
        </div>
    </div>
    <div id="wrapper">
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <div id="sidebar-wrapper-wrapper">
                <ul class="sidebar-nav">
                	<input hidden type="text" class="treename" for="newickIn1File" id="newickIn1Label" rows="1" placeholder="Untitled"></input>
                	<input hidden type="text" class="treename" for="newickIn2File" id="newickIn2Label" rows="1" placeholder="Untitled"></input>
                    <li>
                        <a href="#" id="settings"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span> Settings</a>
                        <div id="settingsPanel">
                            <b class="noExtraMargin">Auto-Collapse Depth:</b>
                            <div class="extraMargin" id="autoCollapseButtons">
                                <button type="button" id="collapseDec" class="btn btn-primary collapseElem collapseButton">-</button>
                                <div id="collapseAmount" class="collapseElem">3</div>
                                <button type="button" id="collapseInc" class="btn btn-primary collapseElem collapseButton">+</button>
                            </div>
                            <b>Internal Labels:</b>
                            <form class="internalLabels">
                                <input type="radio" name="internalLabels" value="none" checked>None
                                <br>
                                <input type="radio" class="extraMargin" name="internalLabels" value="name">Branch Labels/Support
                                <br>
                                <input type="radio" class="extraMargin" name="internalLabels" value="length">Length
                                <br>
                                <input type="radio" class="extraMargin" name="internalLabels" value="similarity">Similarity
                            </form>
                            <b>Adjust Tree Style:</b>
                            <p>Line Thickness</p>
                            <input type="range" class="sizeAdjust extraMargin" id="lineThickness" min="1" max="10" value="3"></input>
                            <p>Node Size</p>
                            <input type="range" class="sizeAdjust extraMargin" id="nodeSize" min="0" max="10" value="3"></input>
                            <p>Font Size</p>
                            <input type="range" class="sizeAdjust extraMargin" id="fontSize" min="5" max="40" value="14"></input>
                            <br>
                            <input type="checkbox" id="useLengths" checked>Use Lengths</input>
                            <br>
                            <input type="checkbox" id="moveOnMouseOver" checked>
                            <div class="smallText">
                                <p>
                                    <br>Move To Best Corresponding Node on Highlight Click</p>
                            </div>
                            </input>
                            <input type="checkbox" id="selectMultipleSearch">Select multiple search results</input>
                            <br>
                        </div>
                    </li>
                    <li>
                        <a href="#" id="export"><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</a>
                    </li>
                    <li class="compareIn">
                        <a href="#" id="svgExport"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Export both trees</a>
                    </li>
                    <li>
                        <a href="manual.html"><span class="glyphicon glyphicon-question-sign" aria-hidden="true"></span> Help</a>
                    </li>
                </ul>
                <div class="footer" id="footer_div" style="text-align: center !important; background-color: #ddd; ">
                    <a href="http://lab.dessimoz.org"><span class="glyphicon glyphicon-copyright-mark" aria-hidden="true"></span> Dessimoz Lab</a>
                </div>
            </div>
        </div>
        <!-- /#sidebar-wrapper -->
        <!-- Page Content -->
        <div id="page-content-wrapper">
            <div id="placeholder">
            </div>
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->
</body>

<script type="text/javascript">

</script>

</html>
