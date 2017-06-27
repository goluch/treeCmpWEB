function drawTrees(newickTree1, newickTree2, nameTree1, nameTree2) {
	
    // Ensures that the acknowledgment footer is correctly placed in the sidebar
    (function () {
        var div_footer = $("#footer_div");
        var divdiv = $("#sidebar-wrapper-wrapper");
        var divwindow = $(window);
        divdiv.height(divwindow.height()-div_footer.height()+100);
        div_footer.width(divdiv.width());

    })();

    var totalTrees = 0;
    var addingTree = false;	
    var spinnerOpts = {
            lines: 13 // The number of lines to draw
            ,
            length: 28 // The length of each line
            ,
            width: 14 // The line thickness
            ,
            radius: 42 // The radius of the inner circle
            ,
            scale: 1 // Scales overall size of the spinner
            ,
            corners: 1 // Corner roundness (0..1)
            ,
            color: '#000' // #rgb or #rrggbb or array of colors
            ,
            opacity: 0.25 // Opacity of the lines
            ,
            rotate: 0 // The rotation offset
            ,
            direction: 1 // 1: clockwise, -1: counterclockwise
            ,
            speed: 1 // Rounds per second
            ,
            trail: 60 // Afterglow percentage
            ,
            fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
            ,
            zIndex: 2e9 // The z-index (defaults to 2000000000)
            ,
            className: 'spinner' // The CSS class to assign to the spinner
            ,
            top: '50%' // Top position relative to parent
            ,
            left: '50%' // Left position relative to parent
            ,
            shadow: true // Whether to render a shadow
            ,
            hwaccel: true // Whether to use hardware acceleration
            ,
            position: 'absolute' // Element positioning
        };
    var spinner = new Spinner(spinnerOpts);
    var spinnerTarget = document.getElementById("page-content-wrapper");
    var gistID = $(location).attr('hash').split("#"); //get gist id from url
    var treecomp = TreeCompare.init({
        scaleColor: "white",
        loadingCallback: function() {
            spinner.spin(spinnerTarget);
        },
        loadedCallback: function() {
            spinner.stop();
        },
        enableRerootFixedButtons: $("#rerootFixedButtons").val(),
        enableSwapFixedButtons: $("#swapFixedButtons").val(),
        lineThickness: $("#lineThickness").val(),
        nodeSize: $("#nodeSize").val(),
        fontSize: $("#fontSize").val(),
        useLengths: $("#useLengths").is(":checked"),
        selectMultipleSearch: $("#selectMultipleSearch").is(":checked"),
        comparisonMetric: $("input[name=comparisonMetric]:checked").val(),
        moveOnClick: $("#moveOnMouseOver").is(":checked"),
        clickAction: $("input[name=clickAction]:checked").val(),
        autoCollapse: $("#collapseAmount").html()
    });
    $(".singleIn").css({
        "display": "none"
    });
    $("#newickInputs").css({
        "padding-bottom": "25px"
    });
    $(".compareIn").css({
        "display": "block"
    });
    var tree1 = treecomp.addTree(newickTree1, nameTree1);
    var tree2 = treecomp.addTree(newickTree2, nameTree2);
    $("#page-content-wrapper").html('<div class="container-fluid vis-container-2" id="vis-container1"></div><div class="container-fluid vis-container-2" id="vis-container2"></div><div class="vis-scale-2" id="vis-scale1"></div><div class="vis-scale-2" id="vis-scale2"></div>');
    treecomp.compareTrees(tree1.name, "vis-container1", tree2.name, "vis-container2", "vis-scale1", "vis-scale2");

    /*
     /
     /    VIEW MODE: active windows in sidebar
     /
     */
    $("#best_corresponding_tree").hide();
    $("#view-btn").click(function(e) {
        $("#page-content-wrapper").html('<div id="placeholder"><div id="arrow"></div><div id="text"><p>1. Choose view for a single tree, Compare for two trees</p><p>2. Add your trees into the text boxes in newick format</p><p>3. Click "Render"</p></div></div>');
        $("#newickInSingle").val('');
        $("#newickInSingleLabel").val('');

        $("#colorScale").empty();
        $("#compare-btn").removeClass("active");
        $("#view-btn").addClass("active");
        $(".compareIn").css({
            "display": "none"
        });
        $("#best_corresponding_tree").hide();
        $("#newickInputs").css({
            "padding-bottom": "0px"
        });
        $(".singleIn").css({
            "display": "block"
        });
        $("#renderErrorMessage").empty();

        treecomp.changeSettings({
            enableFixedButtons: false
        })
    });


    /*------------
    /
    /    COLLAPSING BY LEVEL BUTTON
    /
    ------------*/
    $("#collapseInc").click(function(e) {
        var amountText = $("#collapseAmount").html();
        var amount = 0;
        var maxAmount = treecomp.getMaxAutoCollapse();
        if (amountText !== "OFF") {
            amount = parseInt(amountText);
            amount += 1;
            if (amount == maxAmount){
                $("#collapseAmount").html("OFF");
            }else {
                $("#collapseAmount").html(amount.toString());
            }
        } else {
            amount = 0;
            $("#collapseAmount").html("0");
        }
        treecomp.changeAutoCollapseDepth(amount);

    });

    $("#collapseDec").click(function(e) {
        var amountText = $("#collapseAmount").html();
        var amount = 0;
        var maxAmount = treecomp.getMaxAutoCollapse();

        if (amountText !== "0") {
            if (amountText === "OFF"){
                amount = maxAmount;
            } else {
                amount = parseInt(amountText);
            }
            amount -= 1;
            if (amount < 0) {
                amount = null;
                $("#collapseAmount").html("OFF");
            } else {
                $("#collapseAmount").html(amount.toString());
            }
        } else {
            amount = null;
            $("#collapseAmount").html("OFF");
        }

        treecomp.changeAutoCollapseDepth(amount);
    });

    $("#clearButton").click(function(e) {
        $("#renderErrorMessage").empty();
        var mode = $("#mode-buttons .active").attr('id');
        if (mode === "compare-btn") {
            $("#page-content-wrapper").html('<div id="placeholder"><div id="arrow"></div><div id="text"><p>1. Choose view for a single tree, Compare for two trees</p><p>2. Add your trees into the text boxes in newick format</p><p>3. Click "Render"</p></div></div>');
            $("#newickIn1").val('');
            $("#newickIn2").val('');
            $("#newickIn1Label").val('');
            $("#newickIn2Label").val('');
            $("#colorScale").empty();
        } else if (mode === "view-btn"){
            $("#page-content-wrapper").html('<div id="placeholder"><div id="arrow"></div><div id="text"><p>1. Choose view for a single tree, Compare for two trees</p><p>2. Add your trees into the text boxes in newick format</p><p>3. Click "Render"</p></div></div>');
            $("#newickInSingle").val('');
            $("#newickInSingleLabel").val('');
        }

    });

    /*------
     /
     /    SHARE BUTTON
     /
     ------*/
    $("#export").click(function(e) {
        //console.log("where");
        var mode = $("#mode-buttons .active").attr('id');
        if (mode === "compare-btn") {
            try {
                var exportURLGist = treecomp.exportTree(true);
                $("#exportURLInSingle").attr('href', exportURLGist);
                $("#exportURLInSingle").html(exportURLGist);
                $('#myModal').modal('show');
            } catch (e) {
                $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Nothing to share</div>')).hide().slideDown(300);
            }
        } else if (mode === "view-btn"){
            try{
                var exportURLGist = treecomp.exportTree(false);
                $("#exportURLInSingle").attr('href', exportURLGist);
                $("#exportURLInSingle").html(exportURLGist);
                $('#myModal').modal('show');
            } catch (e) {
                $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Nothing to share</div>')).hide().slideDown(300);
            }

        }
    });

    /*------
     /
     /    SVG export button
     /
     ------*/
    $("#svgExport").click(function(e) {
        //console.log("thats where");
        // Copy left tree
        var svg1 = document.getElementById('vis-container1').getElementsByTagName('svg')[0].cloneNode(true);
        var svg2 = document.getElementById('vis-container2').getElementsByTagName('svg')[0].cloneNode(true);

        // Double the width on svg1
        var l_w = parseInt(svg1.getAttribute('width')),
                r_w = parseInt(svg2.getAttribute('width'));
        svg1.setAttribute('width', (l_w + r_w));

        // Add right tree into left tree's svg
        var g = document.createElement('g');
        g.setAttribute('transform', 'translate(' + l_w + ',0)');
        g.appendChild(svg2.childNodes[0]);
        svg1.appendChild(g);

        // Create the download button
        var download = document.createElement('a');
        download.setAttribute('href-lang', 'image/svg+xml');
        download.setAttribute('href', 'data:image/svg+xml;base64,\n' + btoa(svg1.outerHTML));
        isCompared = (document.getElementById('vis-container1').className.split(' ').indexOf('vis-container') === (-1))
        if (isCompared) {
            download_fn = document.getElementById("newickIn1Label").value +
                    "-with-" +
                    document.getElementById("newickIn2Label").value;

        } else {
            download_fn = document.getElementById("newickInSingleLabel").value;
        }
        download_fn = (download_fn === '' || download_fn === "-with-") ? "side-by-side" : download_fn;
        download.setAttribute("download", download_fn);
        download.click();
    });

    /*------
     /
     /    SETTINGS
     /
     ------*/
    var settingsShown = false;

    $("#settings").click(function(e) {
        if (!settingsShown) {
            $("#settingsPanel").slideDown(300);
            settingsShown = true;
        } else {
            $("#settingsPanel").slideUp(300, function() {
                settingsShown = false;
                $(this).css({
                    "display": "none"
                });
            });
        }
    });


    $(".sizeAdjust").change(function() {
        treecomp.changeSettings({
            lineThickness: $("#lineThickness").val(),
            nodeSize: $("#nodeSize").val(),
            fontSize: $("#fontSize").val()

        });
    });

    $("#useLengths").on("click", function() {
        treecomp.changeSettings({
            useLengths: $("#useLengths").is(":checked")
        });
    });
    $("input[name=comparisonMetric]:radio").on("change", function() {
        treecomp.changeSettings({
            comparisonMetric: $("input[name=comparisonMetric]:checked").val()
        })
    });

    $("#moveOnMouseOver").on("click", function() {
        treecomp.changeSettings({
            moveOnClick: $("#moveOnMouseOver").is(":checked")
        })
    });

    $("#selectMultipleSearch").on("click", function() {
        treecomp.changeSettings({
            selectMultipleSearch: $("#selectMultipleSearch").is(":checked")
        })
    });


    $("input[name=internalLabels]:radio").on("change", function() {
        treecomp.changeSettings({
            internalLabels: $("input[name=internalLabels]:checked").val()
        });
    });
    
}

function getTrees(firstTreeId, secondTreeId) {
	$.ajax({
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		url: "/TreeCmpGUI/trees",
		type: 'POST',
		dataType: 'json',
		data: "{\"firstTreeId\" : \""+ firstTreeId +"\", \"secondTreeId\" : \""+ secondTreeId +"\"}",
		success: function(data) {
			drawTrees(data.firstTreeNewick, data.secondTreeNewick);
			extendTrees();
		},
		error: function() {
			alert("something went wrong :(");
		}
	});
}

function extendTrees() {
	var svgs = $("svg");
	$(svgs[0]).width(700);
	$(svgs[1]).width(700);
}

function clear(divId)
{
    document.getElementById(divId).innerHTML = "";
}