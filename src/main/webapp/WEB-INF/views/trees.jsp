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
    <link rel="stylesheet" href="<c:url value="/resources/css/font-awesome.min.css"/>" type="text/css" />
    <link rel="stylesheet" href="<c:url value="/resources/css/ol.css"/>" type="text/css" />
    <link rel="stylesheet" href="<c:url value="/resources/css/trees.css"/>" type="text/css" />

    <%--<script src="<c:url value="/resources/js/bootstrap-treecmp.js"/>"></script>--%>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <%--<script src="http://code.jquery.com/jquery-2.1.4.js"></script>--%>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script src="http://d3js.org/d3.v3.min.js"></script>

    <script src="<c:url value="/resources/js/drawtree.js"/>"></script>
    <script src="<c:url value="/resources/js/treecompare.js"/>"></script>
    <script src="<c:url value="/resources/js/underscore.min.js"/>"></script>
    <script src="<c:url value="/resources/js/spin.min.js"/>"></script>
    <script src="<c:url value="/resources/js/circular-json.js"/>"></script>
    <script src="<c:url value="/resources/js/canvas-toBlob.js"/>"></script>
    <script src="<c:url value="/resources/js/FileSaver.min.js"/>"></script>
    <script src="https://use.fontawesome.com/28dcb2432d.js"></script>

    <style>
        .extraMargin + span:after {
            content: "\000A";
            white-space: pre;
        }

        .modal-container {
            z-index: 3;
            right: 50px;
            top: 75px;
            position: absolute;
            padding: 5px 20px 15px 20px;
            width: 180px;
            height: 60px;
            border-radius: 8px;
            display: none;

        }
    </style>

    <title>Report</title>
</head>
<body>

    <div id="myModal" class="modal fade">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                    <h5 class="modal-title">Link to share tree visualisation</h5>
                </div>
                <div class="modal-body">
                    <a href="" id="exportURLInSingle"></a>
                </div>
            </div>
        </div>
    </div>

    <nav class="navbar navbar-default navbar-fixed-top">
        <div class="">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                        aria-expanded="false" aria-controls="navbar">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>

                <div class="row" style="width: 300px">
                    <a class="navbar-brand" href="/www/index.html" style="padding-left: 20px;margin-right: 5px; padding-top: 2px">
                        <!-- always show the brand name -->
                        <span class="navbar-brand"
                              style="font-size:x-large; font-weight: bold; margin-top: -3px">Phylo.io</span>
                    </a>
                </div>
            </div>

            <!-- menu navigation bar -->
            <div id="navbar" class="navbar-collapse collapse list-inline">
                <ul class="nav navbar-nav navbar-right list-inline" style="margin-right: 60px">
                    <li class="dropdown" id="action">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="#" id="export"><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Share</a></li>
                            <li><a href="#" id="svgExport"><span class="glyphicon glyphicon-save" aria-hidden="true"></span> Export both trees</a></li>
                        </ul>
                    </li>
                    <li><a href="http://phylo.io/manual.html" class="homelinks">Help</a></li>
                    <li><a href="about.html" class="homelinks">About</a></li>
                </ul>
            </div>
            <!-- END menu navigation bar -->
        </div>
    </nav>

    <div id="wrapper">
        <!-- Sidebar -->
        <div id="sidebar-wrapper">
            <div id="menu-toggle">
                <i class="fa fa-2x fa-arrow-circle-left" id="collapse-sidebar-span" style="color: #e7e7e7; padding-top: 2px; padding-left: 2px;"></i>
            </div>
            <div id="sidebar-wrapper-wrapper">
                <ul class="sidebar-nav">
                    <div id="mode-buttons" class="btn-group btn-group-justified" role="group">
                        <div class="btn-group" role="group">
                            <button type="button" id="compare-btn" class="btn btn-default active">Compare</button>
                        </div>
                    </div>
                    <li>
                        <a href="#" id="settings" style="line-height: 25px; text-decoration: none;"><i style="vertical-align: middle; text-align: center; margin: 0;"
                                                                                                       class="fa fa-pencil-square-o"
                                                                                                       aria-hidden="true"></i>
                            Settings&nbsp;
                        </a>
                        <div id="settingsPanel">
                            <div class="row" style="line-height: 30px;">
                                <div class="col-sm-7">
                                    <label class="settingsLabel" style="vertical-align: middle;">Auto-Collapse Depth:</label>
                                </div>
                                <div class="col-sm-5 pull-right">
                                    <div id="autoCollapseButtons">
                                        <button type="button" id="collapseDec"
                                                class="btn btn-default btn-xs collapseButton">
                                            <i style="margin-left: 2px; vertical-align: middle;" class="fa fa-minus"
                                               aria-hidden="true"></i>
                                        </button>
                                        <span id="collapseAmount" class="collapseElem">3</span>
                                        <button type="button" id="collapseInc" class="btn btn-default btn-xs collapseButton">
                                            <i class="fa fa-plus" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <label class="settingsLabel">Internal Labels:</label>
                            <form class="internalLabels" id="labelForm" style="padding-bottom: 10px">
                                <div class="radio">
                                    <label class="settingsCheckboxLabel">
                                        <input type="radio" name="internalLabels" value="none" id="internalLabelsNone"
                                               checked>None
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel">
                                        <input type="radio" name="internalLabels" value="name">Branch
                                        Labels/Support
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel">
                                        <input type="radio" name="internalLabels" value="length">Length
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="similarity"
                                               id="internalLabelsSimilarity">Similarity
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="species"
                                               id="internalLabelsSpecies">Species
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="duplication"
                                               id="internalLabelsDuplication">Duplication/speciation
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="ECNumber"
                                               id="internalLabelsECNumber">EC Number
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="taxonomyID"
                                               id="internalLabelsTaxonomyID">NCBI Taxonomy ID
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="likelihood"
                                               id="internalLabelsLikelihood">Parent branch log value
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="orthologous"
                                               id="internalLabelsOrthologous">Display orthology
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="superorthologous"
                                               id="internalLabelsSuperorthologous">Display super orthology
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="subtree"
                                               id="internalLabelsSubtree">Subtree
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="collapseThis"
                                               id="internalLabelsCollapseThis">Collapsed nodes
                                    </label>
                                </div>
                                <div class="radio">
                                    <label class="settingsCheckboxLabel opt">
                                        <input type="radio" name="internalLabels" value="color" id="internalLabelsColor">NHX
                                        colorscheme
                                    </label>
                                </div>
                            </form>
                            <label class="settingsLabel">Adjust Tree Style:</label>
                            <label class="settingsCheckboxLabel" style="padding-left: 10px; padding-top: 10px;">Line
                                Thickness</label>
                            <input type="range" class="sizeAdjust" id="lineThickness" min="1" max="10" value="3">
                            <label class="settingsCheckboxLabel" style="padding-left: 10px; padding-top: 10px;">Node
                                Size</label>
                            <input type="range" class="sizeAdjust" id="nodeSize" min="0" max="10" value="3">
                            <label class="settingsCheckboxLabel" style="padding-left: 10px; padding-top: 10px;">Font
                                Size</label>
                            <input type="range" class="sizeAdjust" id="fontSize" min="5" max="40" value="14">
                            <div class="checkbox">
                                <label class="settingsCheckboxLabel"><input type="checkbox" id="useLengths" checked>Use
                                    Lengths</label>
                            </div>
                            <div class="checkbox">
                                <label class="settingsCheckboxLabel"><input type="checkbox" id="alignTipLabels">Align tip labels </label>
                            </div>
                            <div class="checkbox">
                                <label class="settingsCheckboxLabel"><input type="checkbox" id="mirrorRightTree">Mirror right tree </label>
                            </div>
                            <div class="checkbox">
                                <label class="settingsCheckboxLabel"><input type="checkbox" id="moveOnMouseOver" checked>Move
                                    To Best Corresponding Node on Highlight Click</label>
                            </div>
                            <div class="checkbox">
                                <label class="settingsCheckboxLabel"><input type="checkbox" id="selectMultipleSearch">Select
                                    multiple search results</label>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div id="renderErrorMessage"></div>
                        <!-- Centered btn + link group within the div -->
                    </li>
                </ul>
                <div class="footer" id="footer_div">
                </div>
            </div>
        </div>
        <!-- /#sidebar-wrapper -->
        <!-- Page Content -->
        <div class="modal-container" id="spinner-container" style=""><span
                style="position: relative; margin: 20px 10px 0 0; float: right;">Calculating...</span></div>
        <div id="page-content-wrapper">
            <div id="placeholder">
            </div>
        </div>
        <!-- /#page-content-wrapper -->
        <div id="colorScale"></div>
    </div>
    <!-- /#wrapper -->

    <script type="text/javascript">
        $(document).ready(getTrees(${firstTreeId}, ${secondTreeId}, ${firstTreeId}, ${secondTreeId}));
    </script>

</html>
