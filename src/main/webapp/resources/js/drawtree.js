function drawTrees(newickIn1, newickIn2, nameTree1, nameTree2) {

    //new ui

    // Ensures that the acknowledgment footer is correctly placed in the sidebar
    (function () {
        var div_footer = $("#footer_div");
        var divdiv = $("#sidebar-wrapper-wrapper");
        div_footer.width(divdiv.width());

    })();

    var spinnerOpts = {
        lines: 13 // The number of lines to draw
        ,
        length: 28 // The length of each line
        ,
        width: 14 // The line thickness
        ,
        radius: 42 // The radius of the inner circle
        ,
        scale: 0.20 // Scales overall size of the spinner
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
        left: '10%' // Left position relative to parent
        ,
        shadow: true // Whether to render a shadow
        ,
        hwaccel: true // Whether to use hardware acceleration
        ,
        position: 'relative' // Element positioning
    };

    var spinner = new Spinner(spinnerOpts);
    //var spinnerTarget = document.getElementById("page-content-wrapper");
    var spinnerTarget = document.getElementById("spinner-container");

    var gistID = $(location).attr('hash').split(/\s*[#-]\s*/); //get gist id from url
    var treecomp = TreeCompare().init({
        scaleColor: "black",
        loadingCallback: function () {
            $('#spinner-container').show();
            spinner.spin(spinnerTarget);
        },
        loadedCallback: function () {
            $('#spinner-container').hide();
            spinner.stop();
        },
        enableRerootFixedButtons: $("#rerootFixedButtons").val(),
        enableSwapFixedButtons: $("#swapFixedButtons").val(),
        lineThickness: $("#lineThickness").val(),
        nodeSize: $("#nodeSize").val(),
        fontSize: $("#fontSize").val(),
        useLengths: $("#useLengths").is(":checked"),
        alignTipLabels: $("#alignTipLabels").is(":checked"),
        mirrorRightTree: $("#mirrorRightTree").is(":checked"),
        selectMultipleSearch: $("#selectMultipleSearch").is(":checked"),
        comparisonMetric: $("input[name=comparisonMetric]:checked").val(),
        moveOnClick: $("#moveOnMouseOver").is(":checked"),
        clickAction: $("input[name=clickAction]:checked").val(),
        autoCollapse: $("#collapseAmount").html()
    });

    /* Download name */
    var update_download_fn = function (canvasId, labelId) {
        download_fn = document.getElementById(labelId).value;
        download_fn = (download_fn === '') ? "PhyloIO_Tree" : download_fn;
        document.getElementById('downloadButtons' + canvasId).getElementsByTagName('a')[0].download = download_fn;
    };

    // hide optional settings by default
    $('.opt').parent().hide();

    hideOptionalSettings();

    var mode = $("#mode-buttons .active").attr('id');
    if (mode === "view-btn") {
        $("#compareIn").removeClass("active");
        $("#fileLabel").text("Untitled");

        $(".compareIn").css({
            "display": "none"
        });
        $("#newickInputs").css({
            "padding-bottom": "0px"
        });

        $("#cmp-trees-params").css({
            "display": "none"
        });
        $("#view-tree-params").css({
            "display": "block"
        });
        $("#action").css(
            {"display": "none"}
        );
    }
    /*
     /
     /    LOAD PAGE FROM GIST
     /
     */
    if (gistID.length === 2) { //view mode

        $("#compare-btn").removeClass("active");
        $("#view-btn").addClass("active");
        $(".compareIn").css({
            "display": "none"
        });
        $("#newickInputs").css({
            "padding-bottom": "0px"
        });

        var tree1 = treecomp.addTreeGistURL(gistID[1]);
        $("#page-content-wrapper").empty();
        $("#page-content-wrapper").html('<div class="container-fluid vis-container" id="vis-container1"></div><div class="vis-scale" id="vis-scale1"></div>');
        treecomp.viewTree(tree1.name, "vis-container1", "vis-scale1");
        $("#newickInSingle").val(tree1.nwk);

        $("#colorScale").empty();
        $("#action").css({"display": "none"});

    } else if (gistID.length === 3) { //compare mode

        $("#view-btn").removeClass("active");
        $("#compare-btn").addClass("active");
        $("#newickInputs").css({
            "padding-bottom": "25px"
        });
        $(".compareIn").css({
            "display": "block"
        });
        var tree1 = treecomp.addTreeGistURL(gistID[1]);
        var tree2 = treecomp.addTreeGistURL(gistID[2]);

        $("#page-content-wrapper").empty();

        $("#page-content-wrapper").html('<div class="container-fluid vis-container-2" id="vis-container1"></div><div class="container-fluid vis-container-2" id="vis-container2"></div>');
        treecomp.compareTrees(tree1.name, "vis-container1", tree2.name, "vis-container2", "vis-scale1", "vis-scale2");
        $("#newickIn1").val(tree1.nwk);
        $("#newickIn2").val(tree2.nwk);

        $("#colorScale").empty();
        treecomp.renderColorScale("colorScale");

        $("#action").css({"display": "block"});
    } //end of gist id part

    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");

        var div_footer = $("#footer_div");
        var newWidth, sideBarWidth = 420;
        var colorScaleWidth = 75;

        if ($("#collapse-sidebar-span").hasClass("fa fa-2x fa-arrow-circle-left")) {
            $("#collapse-sidebar-span").removeClass("fa fa-2x fa-arrow-circle-left");
            $("#collapse-sidebar-span").addClass("fa fa-2x fa-arrow-circle-right");
            newWidth = 30;
            $('#sidebar-nav').hide();
        }
        else {
            $("#collapse-sidebar-span").removeClass("fa fa-2x fa-arrow-circle-right");
            $("#collapse-sidebar-span").addClass("fa fa-2x fa-arrow-circle-left");
            $('#sidebar-nav').show();
        }
        var position = $("#wrapper").width() / 2 + sideBarWidth / 2 - colorScaleWidth / 3;
        $('#colorScale').css("left", position + "px");

        div_footer.width(newWidth);
    });


    /*
     /
     /    VIEW MODE: active windows in sidebar
     /
     */
    $("#best_corresponding_tree").hide();

    $("#view-btn").click(function (e) {

        if ($(window).height() < 550) {
            $("#sidebar-wrapper").css({
                "overflow-y": "scroll"
            });
        }

        $("#colorScale").empty();
        $("#action").css({"display": "none"});

        $("#page-content-wrapper").html('<div id="placeholder"><div id="arrow"></div><div id="text"><p>1. Choose view for a single tree, Compare for two trees</p><p>2. Add your trees into the text boxes in newick format</p><p>3. Click "Render"</p></div></div>');
        $("#newickInSingle").val('');
        $("#compare-btn").removeClass("active");
        $("#view-btn").addClass("active");
        $(".compareIn").css({
            "display": "none"
        });
        $("#best_corresponding_tree").hide();
        $("#newickInputs").css({
            "padding-bottom": "0px"
        });
        $("#cmp-trees-params").css({
            "display": "none"
        });
        $("#view-tree-params").css({
            "display": "block"
        });
        $("#renderErrorMessage").empty();

        treecomp.changeCanvasSettings({
            enableFixedButtons: false
        });

        if (settingsShown) {
            showHideSettingsPanel("hide");
        }
    });

    /*
     /
     /    COMPARE MODE: active windows in sidebar
     /    Changed from method to active code
     /
     */
    if ($(window).height() < 750) {
        $("#sidebar-wrapper").css({
            "overflow-y": "scroll"
        });
    }

    treecomp.changeCanvasSettings({
        enableFixedButtons: true
    });
    if (settingsShown) {
        showHideSettingsPanel("hide");
    }

    /*------
     /
     /    RENDER BUTTON
     /    Changed from method to active code
     /
     ------*/

    $("#renderErrorMessage").empty();
    hideOptionalSettings();
    $("#menu-toggle").click();

    try {
        //$("#page-content-wrapper").empty();
        $("#page-content-wrapper").html('<div class="container-fluid vis-container-2" id="vis-container1"></div><div class="container-fluid vis-container-2" id="vis-container2"></div>');
        var tree1 = treecomp.addTree(newickIn1, nameTree1, "left");
        var tree2 = treecomp.addTree(newickIn2, nameTree2, "right");
        treecomp.changeCanvasSettings({
            autoCollapse: tree1.data.autoCollapseDepth
        })
        var collapseText = tree1.data.autoCollapseDepth === null ? "OFF" : tree1.data.autoCollapseDepth.toString();
        $("#collapseAmount").html(collapseText);
        //TODO: change this

        treecomp.compareTrees(tree1.name, "vis-container1", tree2.name, "vis-container2", "vis-scale1", "vis-scale2");
        treecomp.undo("undoBtn");

        $("#colorScale").empty();
        treecomp.renderColorScale("colorScale");

        $("#action").css({"display": "block"});
    } catch (e) {
        if (e === "TooLittle)") {
            $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Tree file not correct: too little ")"</div>')).hide().slideDown(300);
        } else if (e === "TooLittle(") {
            $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Tree file not correct: too little "("</div>')).hide().slideDown(300);
        } else if (e === "NoTree") {
            $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Please add tree</div>')).hide().slideDown(300);
        } else if (e === "") {
            $("#renderErrorMessage").append($('<div class="alert alert-danger" role="alert">Empty</div>')).hide().slideDown(300);
        }
    }

    /*------
     /
     /    SETTINGS
     /
     ------*/
    function hideOptionalSettings() {
        var v = $("label.opt");
        $(v).each(function (i) {
            ($(this).hide().next().hide())
        });
    }


    var settingsShown = false;

    $("#settings").click(function (e) {
        if (settingsShown) {
            showHideSettingsPanel("hide");
        }
        else {
            showHideSettingsPanel("show");
        }
    });

    function showHideSettingsPanel(mode) {
        if (mode == "show") {
            $("#settingsPanel").slideDown(300);
            settingsShown = true;
            $("#sidebar-wrapper").css({
                "overflow-y": "scroll"
            });
        } else if (mode == "hide") {
            $("#settingsPanel").slideUp(300, function () {
                settingsShown = false;
                $(this).css({
                    "display": "none"
                });

                //$("#sidebar-wrapper").css({
                //    "overflow-y": "hidden"
                //});
            });
        } else {
            console.log("You should not be able to see this!!!!");
        }
    }
    
}

function getTrees(firstTreeId, secondTreeId) {
	$.ajax({
		headers: { 
	        'Accept': 'application/json',
	        'Content-Type': 'application/json' 
	    },
		url: "/TreeCmp/trees",
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