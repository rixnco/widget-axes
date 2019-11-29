/* global cprequire_test macro chilipeppr THREE $ requirejs cprequire cpdefine chilipeppr */
// Test this element. This code is auto-removed by the chilipeppr.load()
cprequire_test(["inline:com-chilipeppr-widget-xyz"], function (xyz) {
    console.log("test running of " + xyz.id);
    //sp.init("192.168.1.7");
    //xyz.initAs3dPrinting();
    xyz.init();
    xyz.showBody("com-chilipeppr-widget-xyz");
    xyz.currentUnits = 'mm'

    // load the WCS widget to left
    //$('body').css('margin-left', '80px');
    var wrapDiv = $('<div class="testdiv" style="margin-left:80px;position:relative;">');

    $('#com-chilipeppr-widget-xyz').wrap(wrapDiv);

    // test out planner resume/pause
    var testPauseResume = function () {
        setTimeout(function () {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerpause', "");
        }, 5000);
        setTimeout(function () {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerresume', "");
        }, 10000);
        setTimeout(function () {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerpause', "");
        }, 15000);
        setTimeout(function () {
            chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/plannerresume', "");
        }, 20000);
    };

    var testAxesValUpdates = function () {
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: 0.005,
                y: 10.46,
                z: 0.304,
                a: 0,
                type: "work",
                mpo: {
                    x: 0.005,
                    y: 10.46,
                    z: 0.304,
                    a: 0,
                    type: "machine"
                }
            });
        }, 1000);
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: 192,
                y: 0.028,
                z: 0.01,
                a: 0,
                type: "work"
            });
        }, 2000);
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: -3288.73,
                y: -0,
                z: 1.12,
                a: null,
                type: "work"
            });
        }, 3000);

        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: 940.5744,
                y: null,
                z: 1.12,
                a: null,
                type: "work"
            });
        }, 4000);
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: 0.574,
                y: 32.424,
                z: -3.424,
                a: null,
                type: "work"
            });
        }, 5000);
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/axes", {
                x: null,
                y: 132.424,
                z: -3.424,
                a: null,
                type: "work"
            });
        }, 5000);
    };

    // test units change
    var testUnitsChange = function () {

        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/units", "inch");
        }, 1000);
        setTimeout(function () {
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/units", "mm");
        }, 5000);
    };

    // test units change
    var testCoordsChange = function () {

        setTimeout(function () {
            var c = {
                coord: "G54",
                coordNum: 54
            };
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/coords", c);
        }, 1000);
        setTimeout(function () {
            var c = {
                coord: "G55",
                coordNum: 55
            };
            chilipeppr.publish("/com-chilipeppr-interface-cnccontroller/coords", c);
        }, 5000);
    };

    //testPauseResume();
    testAxesValUpdates();
    //testUnitsChange();
    testCoordsChange();

    /*
    setTimeout(function() {
        
        console.log("setting up alternate keystrokes");
        $('#com-chilipeppr-widget-xyz-ftr').keydown(function(evt) {
            var e = $.Event('keydown');
            
            if (evt.which == 50) {
                // the #2 key
                // mimic down arrow being pressed
                e.which= 40;
            } else if (evt.which == 56) {
                // the #8 key
                // mimic up arrow being pressed
                e.which= 38; // enter
            }
            
            console.log("artificial event:", e);
            if (e.which > 0) {
                evt.preventDefault();
                // fire off fake event as if key was pressed down
                $('#com-chilipeppr-widget-xyz-ftr').trigger(e);
                return false;
            }
        });
        
    }, 5000);
    */
    $('body').css("padding", "20px");

} /*end_test*/ );

cpdefine("inline:com-chilipeppr-widget-xyz", ["chilipeppr_ready", "jquerycookie"], function () {
    return {
        id: "com-chilipeppr-widget-xyz",
        url: "(auto fill by runme.js)",       // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)",   // The standalone working widget so can view it working by itself
        name: "Widget / XYZ Axes v2",
        desc: "The Axes widget shows the XYZA values of the axes of your CNC controller. It also enables you to jog, home, change units, and change Work Coordinate Systems.",
        publish: {},
        subscribe: {},
        foreignPublish: {
            '/com-chilipeppr-widget-serialport/send': "We publish to the serial port Gcode jog commands"
        },
        foreignSubscribe: {
            "/com-chilipeppr-interface-cnccontroller/axes": "We want X,Y,Z,A,MX,MY,MZ,MA axis updates.",
                "/com-chilipeppr-interface-cnccontroller/coords": "Track which is active: G54, G55, etc.",
                "/com-chilipeppr-interface-cnccontroller/plannerpause": "We need to know when to pause sending jog cmds.",
                "/com-chilipeppr-interface-cnccontroller/plannerresume": "We need to know when to resume jog cmds.",
                "/com-chilipeppr-interface-cnccontroller/units": "Deprecated. Not listening to this anymore. See next.",
                '/com-chilipeppr-widget-3dviewer/unitsChanged': "Listenting to see if the 3D Viewer is telling us that the user Gcode is in a specific coordinate and then just assuming we will only be sent axes coordinate updates in that unit. Not using /com-chilipeppr-interface-cnccontroller/units anymore."
        },
        init: function () {

            // Do UI setup
            this.initBody();
            this.btnSetup();
            this.menuSetup();
            this.jogSetup();
            
            this.pencilSetup();

            this.forkSetup();
            this.toolbarSetup();

            // Subscribe to the signal published from the specific controller implementing the generic interface
            // for CNC controllers that normalizes the XYZ Axis updates so we don't have to worry about
            // the specific implementation
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/axes", this, this.updateAxesFromStatus);

            // Update units if we get a notification published to us
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/units", this, this.updateUnitsFromStatus);
            chilipeppr.subscribe('/com-chilipeppr-widget-3dviewer/unitsChanged', this, this.updateUnitsFromStatus);
            // in case we didn't get loaded fast enough, thus we never got the /unitsChanged event from the 3d viewer, we better double check here and fire off a request just to cover all our bases
            chilipeppr.subscribe('/com-chilipeppr-widget-3dviewer/recvUnits', this, this.updateUnitsFromStatus);
            chilipeppr.publish('/com-chilipeppr-widget-3dviewer/requestUnits', "");

            // Subscribe to the generic interface signals of plannerresume/plannerpause so we know when to slow
            // down on our sending of gcode commands when jogging. 
            // If a different controller is implemented, they can send on these signals
            // and abstract away the specific hardware details from us so this widget is reusable
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/plannerpause", this, this.onPlannerPause);
            chilipeppr.subscribe("/com-chilipeppr-interface-cnccontroller/plannerresume", this, this.onPlannerResume);

            // subscribe to the CNC controller broadcasting what
            // layer system we're in
            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/coords', this.onCoordsUpdate.bind(this));

            chilipeppr.subscribe('/com-chilipeppr-interface-cnccontroller/distance', this.onDistanceUpdate.bind(this));

            

            // setup onconnect pubsub event
            /*
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/ws/onconnect", this, function (msg) {
                console.log("got onconnect so will query for status");
            });
            */

            // setup recv pubsub event
            // this is when we receive data in a per line format from the serial port
            /*
            chilipeppr.subscribe("/com-chilipeppr-widget-serialport/recvline", this, function (msg) {
                this.onRecvCmd(msg);
            });
            */


            // setup DOM elements for the Axes in the UI
            this.setupAxes();

            // setup controller specific init items
            //this.initControllerSpecific();

            // setup cookie based UI settings
            this.setupUiFromCookie();
            // this.setupTouchArea();
            // this.setupShowHideTouchBtn();
            this.setupShowHideWcsBtn();
            var that = this;
            console.log(this.name + " done loading.");
        },
        pencilSetup: function() {
            // add mouseover events to DRO numbers
            //$('#com-chilipeppr-widget-xyz-x').mouseover(this.pencilOnMouseover.bind(this));
            //$('#com-chilipeppr-widget-xyz-x').mouseout(this.pencilOnMouseout.bind(this));
            $('#com-chilipeppr-widget-xyz-x').hover(this.pencilOnMouseover.bind(this), this.pencilOnMouseout.bind(this));
            $('#com-chilipeppr-widget-xyz-y').hover(this.pencilOnMouseover.bind(this), this.pencilOnMouseout.bind(this));
            $('#com-chilipeppr-widget-xyz-z').hover(this.pencilOnMouseover.bind(this), this.pencilOnMouseout.bind(this));
            $('#com-chilipeppr-widget-xyz-a').hover(this.pencilOnMouseover.bind(this), this.pencilOnMouseout.bind(this));
        },
        pencilOnMouseover: function(evt) {
            console.log("got pencilOnMouseover. evt:", evt);
            var tgtEl = $(evt.currentTarget);
            var btn = $('<button class="btn btn-xs btn-default xyz-pencil"><span class="glyphicon glyphicon-pencil"></span></button>');
            btn.click(this.pencilClick.bind(this));
            tgtEl.find('.com-chilipeppr-xyz-pos-well').prepend(btn);
            
            // attach descriptive popoover
            btn.popover({
                animation: true,
                delay: 500,
                placement: "auto",
                container: "body",
                trigger: "hover",
                title: "Enter a new coordinate",
                content: "Move to a new coordinate in this axis by modifying the value and hitting the enter key."
            });
        },
        pencilOnMouseout: function(evt) {
            console.log("got pencilOnMouseout. evt:", evt);
            var tgtEl = $(evt.currentTarget);
            this.pencilHide(tgtEl);
        },
        pencilClick: function(evt) {
            console.log("got pencilClick. evt:", evt);
            var tgtEl = $(evt.currentTarget);
            
            var txt = $('<input type="number" class="form-control xyz-number" placeholder="Enter New Coord">');
            txt.keyup(this.pencilKeypress.bind(this));
            var posEl = tgtEl.parents('.com-chilipeppr-xyz-pos-well');
            console.log("lastCoords:", this.lastCoords, "lastVal:", this.lastVal);
            var val = this.lastVal[posEl.data('axis')];
            txt.val(val);
            posEl.prepend(txt);
            txt.focus();
            
            // hide popover
            posEl.find('button').popover('hide');
        },
        pencilCtr: 0,
        pencilKeypress: function(evt) {
            console.log("got pencilKeypress. evt:", evt);
            var tgtEl = $(evt.currentTarget);
            var posEl = tgtEl.parents('.com-chilipeppr-xyz-pos-well');
            var axis = posEl.data('axis').toUpperCase();
            console.log("axis:", axis);
            
            // see if return key
            if (evt.keyCode == 13) {
                console.log("enter key hit");
                
                // send gcode
                var gcode = "G90 G0 " + axis + tgtEl.val();
                console.log("about to send gcode:", gcode);
                chilipeppr.publish('/com-chilipeppr-widget-serialport/jsonSend', {
                    D: gcode, 
                    Id:"axes" + this.pencilCtr++
                });
                
                this.pencilHide(tgtEl.parents('.com-chilipeppr-xyz-pos-well'));
            } else if (evt.keyCode == 27) {
                console.log("ESC key hit");
                this.pencilHide(tgtEl.parents('.com-chilipeppr-xyz-pos-well'));
            }
            
            
        },
        pencilHide: function(tgtEl) {
        		console.log("pencilHide");
        		// hide popover
          tgtEl.find('button').popover('hide');
            //tgtEl.popover('hide');
            tgtEl.find('.xyz-pencil').remove();
            tgtEl.find('.xyz-number').remove();
        },
        initAs3dPrinting: function () {
            // by default we'll show the A/B/C axes
            $('#com-chilipeppr-widget-xyz-a').removeClass("hidden");
            $('#com-chilipeppr-widget-xyz-b').removeClass("hidden");
            // change labels
            $('#com-chilipeppr-widget-xyz-a .com-chilipeppr-xyz-label').text("E0");
            $('#com-chilipeppr-widget-xyz-b .com-chilipeppr-xyz-label').text("E1");
            // change units
            $('#com-chilipeppr-widget-xyz-a .com-chilipeppr-xyz-dim').text("mm");
            $('#com-chilipeppr-widget-xyz-b .com-chilipeppr-xyz-dim').text("mm");

        },
        setupShowHideWcsBtn: function () {

            var btnEl = $("#com-chilipeppr-widget-xyz .btnToggleShowWcs");
            btnEl.click(this.toggleWcs.bind(this));
            btnEl.popover();
            chilipeppr.load(
                "#com-chilipeppr-widgetholder-wcs", 
                //"http://fiddle.jshell.net/Danal/4ete4691/show/light/",
                "http://raw.githubusercontent.com/rixnco/widget-wcs/master/auto-generated-widget.html",
                function () {
                cprequire(["inline:com-chilipeppr-widget-wcs"], function (wcs) {
                    console.log("test running of " + wcs.id);
                    wcs.init();
                });
            });
        },
        toggleWcs: function (evt) {
            $("#com-chilipeppr-widget-xyz .btnToggleShowWcs").popover('hide');
            var wcsEl = $('#com-chilipeppr-widgetholder-wcs');
            if (wcsEl.hasClass("hidden")) {
                wcsEl.removeClass("hidden");
                $('#com-chilipeppr-widget-xyz .btnToggleShowWcs').addClass("active");
            } else {
                wcsEl.addClass("hidden");
                $('#com-chilipeppr-widget-xyz .btnToggleShowWcs').removeClass("active");

            }
        },
        setupShowHideTouchBtn: function () {
            $("#com-chilipeppr-widget-xyz .btnToggleShowTouchJog").popover();
            //$( window ).resize(this.showHideTouchBtn.bind(this));
            this.showHideTouchBtn();
            $(window).resize(this.showHideTouchBtn.bind(this));
        },
        showHideTouchBtn: function () {
            //console.log("should we show or hide the touch btn");
            var btnEl = $("#com-chilipeppr-widget-xyz .btnShowTouchJog");
            var btnParentWidth = btnEl.parent().parent().width();
            var widgetWidth = $("#com-chilipeppr-widget-xyz").width();
            console.log("btnParentWidth:", btnParentWidth, "widgetWidth:", widgetWidth);
            //console.log("btnEl:", btnEl, "parent:", btnEl.parent(), "btnEl.parent().width()", btnEl.parent().width(), "btnEl.parent().parent().width()", btnEl.parent().parent().width());
            //console.log("btnEl.parent().parent().width()", btnEl.parent().parent().width(), "btnEl.parent().parent().width()", btnEl.parent().parent().parent().parent().width());
            if (btnParentWidth > widgetWidth) {
                console.log("it appears the btn is being clipped");
                btnEl.css('visibility', 'hidden');
                btnEl.addClass("hidden");
                //apply class1
            } else {
                //apply class2
                btnEl.css('visibility', 'visible');
                btnEl.removeClass("hidden");
                console.log("it appears the btn is NOT being clipped");
            }
        },
        toolbarSetup: function () {
            // config the css sizes to get more compact display
            var config = localStorage.getItem("/" + this.id + "/size");
            if (config == "small") this.bodyShowSmall();

            var that = this;
            $('#com-chilipeppr-widget-xyz .view-small').click(function () {
                that.bodyShowSmall();
                localStorage.setItem("/" + that.id + "/size", "small");
            });
            $('#com-chilipeppr-widget-xyz .view-large').click(function () {
                that.bodyShowNormal();
                localStorage.setItem("/" + that.id + "/size", "normal");
            });
        },
        bodyShowSmall: function () {
            $('#com-chilipeppr-widget-xyz').addClass("size-small");
            $('#com-chilipeppr-widget-xyz .view-small').addClass("active");
            $('#com-chilipeppr-widget-xyz .view-large').removeClass("active");
        },
        bodyShowNormal: function () {
            $('#com-chilipeppr-widget-xyz').removeClass("size-small");
            $('#com-chilipeppr-widget-xyz .view-small').removeClass("active");
            $('#com-chilipeppr-widget-xyz .view-large').addClass("active");
        },
        options: null,
        setupUiFromCookie: function () {
            // read vals from cookies
            var options = $.cookie('com-chilipeppr-widget-xyz-options');

            if (true && options) {
                options = $.parseJSON(options);
                console.log("just evaled options: ", options);
            } else {
                options = {
                    showA: false,
                    moveBy: 0.01
                };
            }
            this.options = options;
            console.log("options:", options);

            // hilite the correct button
            var cls = ".jogincr1";
            if (options.moveBy == "0.1") cls = ".jogincrpt1";
            if (options.moveBy == "0.01") cls = ".jogincrpt01";
            if (options.moveBy == "0.001") cls = ".jogincrpt001";
            this.changeBaseVal({
                data: {
                    newval: options.moveBy,
                    cls: cls
                }
            });

        },
        saveOptionsCookie: function () {
            var options = {
                showA: false,
                moveBy: this.baseval
            };
            var optionsStr = JSON.stringify(options);
            console.log("saving options:", options, "json.stringify:", optionsStr);
            // store cookie
            $.cookie('com-chilipeppr-widget-xyz-options', optionsStr, {
                expires: 365 * 10,
                path: '/'
            });
        },
        pauseBtnIcon: null,
        isPausedByPlanner: false, // keeps track of whether we've been told to pause sending by the planner buffer
        onPlannerPause: function () {
            console.log("xyz-onPlannerPause. being asked to pause.");
            if (this.pauseBtnIcon === null) this.pauseBtnIcon = $('#com-chilipeppr-widget-xyz div.plannerpause');

            if (!this.isPausedByPlanner) {
                // we are not paused, so go ahead and pause
                //this.onPauseByPlanner();
                this.isPausedByPlanner = true;
                // visuall indicate we were paused by planner, not by a human
                this.pauseBtnIcon.addClass('btnIconWarning');
            } else {
                console.log("got planner pause, but we're already paused");
            }
        },
        onPlannerResume: function () {
            console.log("xyz-onPlannerResume. being asked to resume.");
            if (this.pauseBtnIcon === null) this.pauseBtnIcon = $('#com-chilipeppr-widget-xyz div.plannerpause');

            if (this.isPausedByPlanner) {
                // we are currently paused, so unpause 
                //this.onPauseByPlanner();
                this.isPausedByPlanner = false;
                this.pauseBtnIcon.removeClass('btnIconWarning');
            } else {
                console.log("got planner resume, but we're already resumed which is weird.");
            }
        },
        /*
        onRecvCmd: function (recvline) {
            // get a per line command from the serial port server via pubsub
            //console.log("onRecvCmd. recvline:", recvline);
            // we want to process the status reports
            // sample: 
            // {"sr":{"vel":0.02,"mpoy":10.474,"dist":1,"stat":5}}
            // {"sr":{"vel":0.06,"mpox":0.001,"dist":0}}
            
            if (!(recvline.dataline)) {
                console.log("got recvline but it's not a dataline, so returning.");
                return;
            }
            var msg = recvline.dataline;
            if (msg.match(/^{/)) {
                // it is json
                d = $.parseJSON(msg);
                //console.log("d:", d);
                if (d.sr) {
                    //console.log("it is a status report");
                    this.updateAxesFromStatus(d.sr);
                } else if (d.r && d.r.sr) {
                    //console.log("it is a status report from a direct request");
                    this.updateAxesFromStatus(d.r.sr);
                }
            }

        },
        */
        toggleInMm: function () {
            var gCode;

            if (this.currentUnits == "mm") {
                gCode = "G20";
            } else {
                gCode = "G21";
            }
            console.log("toggleInMm. command:", gCode);
            chilipeppr.publish("/com-chilipeppr-widget-serialport/send", gCode + '\n');
        },
        currentUnits: null,
        updateUnitsFromStatus: function (units) {
            console.log("updateUnitsFromStatus. units:", units);
            $('.com-chilipeppr-xyz-dim').text(units);
            this.currentUnits = units;
        },
        lastCoords: {
            coord: null,
            coordNum: null
        },
        onCoordsUpdate: function (coords) {
            console.log("onCoordsUpdate. coords:", coords);
            if (coords.coordNum != this.lastCoords.coordNum) {
                $('.com-chilipeppr-widget-xyz-coords').text(coords.coord);
                this.lastCoords = coords;
            }
        },
        onDistanceUpdate: function (distance) {
            console.log("onDistanceUpdate. distance:", distance);
            if (distance != this.distance) {
                this.distance = distance;
            }
        },

        axisx: null,
        axisy: null,
        axisz: null,
        axisa: null,
        axes: {},
        //Machine coord version of axes. 
        axismx: null,
        axismy: null,
        axismz: null,
        axisma: null,
        setupAxes: function () {
            this.axisx = {
                intblack: $('#com-chilipeppr-widget-xyz-x .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-x .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-x .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-x .xyz-decimal')
            };
            this.axisy = {
                intblack: $('#com-chilipeppr-widget-xyz-y .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-y .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-y .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-y .xyz-decimal')
            };
            this.axisz = {
                intblack: $('#com-chilipeppr-widget-xyz-z .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-z .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-z .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-z .xyz-decimal')
            };
            this.axisa = {
                intblack: $('#com-chilipeppr-widget-xyz-a .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-a .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-a .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-a .xyz-decimal')
            };
            this.axismx = {
                intblack: $('#com-chilipeppr-widget-xyz-mx .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-mx .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-mx .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-mx .xyz-decimal')
            };
            this.axismy = {
                intblack: $('#com-chilipeppr-widget-xyz-my .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-my .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-my .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-my .xyz-decimal')
            };
            this.axismz = {
                intblack: $('#com-chilipeppr-widget-xyz-mz .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-mz .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-mz .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-mz .xyz-decimal')
            };
            this.axisma = {
                intblack: $('#com-chilipeppr-widget-xyz-ma .xyz-intblack'),
                intgray: $('#com-chilipeppr-widget-xyz-ma .xyz-intgray'),
                negpos: $('#com-chilipeppr-widget-xyz-ma .xyz-negpos'),
                decimal: $('#com-chilipeppr-widget-xyz-ma .xyz-decimal')
            };
            this.axes = {
                x: this.axisx,
                y: this.axisy,
                z: this.axisz,
                a: this.axisa,
                mx: this.axismx,
                my: this.axismy,
                mz: this.axismz,
                ma: this.axisma
            };
        },
        // updateAxesFromStatus: function (axes) {
        //     console.log("updateAxesFromStatus:", axes);
        //     if ('x' in axes && axes.x !== null) {
        //         this.updateAxis("x", axes.x);
        //     }
        //     if ('y' in axes && axes.y !== null) {
        //         this.updateAxis("y", axes.y);
        //     }
        //     if ('z' in axes && axes.z !== null) {
        //         this.updateAxis("z", axes.z);
        //     }
        //     if ('a' in axes && axes.a !== null) {
        //         this.updateAxis("a", axes.a);
        //     }
        //     if ('mpo' in axes) {
        //         axes = axes.mpo;
        //         var scale = 0;
        //         if (this.currentUnits == 'mm') scale = 1;
        //         if (this.currentUnits == 'inch') scale = 1 / 25.4;
        //         if ('x' in axes && axes.x !== null) {
        //             this.updateAxis("mx", this.round(axes.x * scale, 4));
        //         }
        //         if ('y' in axes && axes.y !== null) {
        //             this.updateAxis("my", this.round(axes.y * scale, 4));
        //         }
        //         if ('z' in axes && axes.z !== null) {
        //             this.updateAxis("mz", this.round(axes.z * scale, 4));
        //         }
        //         if ('a' in axes && axes.a !== null) {
        //             this.updateAxis("ma", this.round(axes.a * scale, 4));
        //         }
        //     }
        // },
        updateAxesFromStatus: function(axes) {
            console.log("updateAxesFromStatus:", axes);

            var coords = {
                x: null,
                y: null,
                z: null
            } //create local object to edit

            //first, we may need to convert units to match 3d viewer
            if (axes.unit == "mm" && this.currentUnits === "inch") {
                coords.x = (axes.x / 25.4).toFixed(3);
                coords.y = (axes.y / 25.4).toFixed(3);
                coords.z = (axes.z / 25.4).toFixed(3);
            }
            else if (axes.unit == "inch" && this.currentUnits === "mm") {
                coords.x = (axes.x * 25.4).toFixed(3);
                coords.y = (axes.y * 25.4).toFixed(3);
                coords.z = (axes.z * 25.4).toFixed(3);
            }
            else {
                coords.x = axes.x;
                coords.y = axes.y;
                coords.z = axes.z;
            }

            if ('x' in coords && coords.x != null) {
                this.updateAxis("x", coords.x);
            }
            if ('y' in coords && coords.y != null) {
                this.updateAxis("y", coords.y);
            }
            if ('z' in coords && coords.z != null) {
                this.updateAxis("z", coords.z);
            }
            if ('a' in coords && coords.a != null) {
                this.updateAxis("a", coords.a);
            }
        },

        // keep track of lastval so less dom updates to perform
        lastVal: {
            x: 0,
            y: 0,
            z: 0,
            a: 0,
            mx: 0,
            my: 0,
            mz: 0,
            ma: 0
        },
        updateAxis: function (axis, val) {
            console.log("updateAxis. axis:", axis, "val:", val);
            var ax = this.axes[axis];
            var axl = this.lastVal[axis];

            // if this val is same as last val, return immediately
            // this happens alot as the cnc controller could send lots of redundant position updates
            if (val == axl) {
                //console.log("new val:", val, "is same as last val:", axl, "axis:", axis, "exiting");
                return;
            }
            if (ax.intblack !== null) { //Temporary, until we actually have html for machine axis
                // set the negative indicator, but only do it if there was a change
                // to reduce dom updates for efficiency
                if (val < 0 && axl >= 0) {
                    ax.negpos.removeClass("xyz-dimmed");
                    ax.negpos.addClass("xyz-active");
                } else if (val >= 0 && axl < 0) {
                    ax.negpos.removeClass("xyz-active");
                    ax.negpos.addClass("xyz-dimmed");
                }

                // convert float into integer part and decimal part
                var arr = (Math.abs(val) + "").split(".");
                var intval = arr[0];
                //console.log("arr.length:", arr.length, arr);
                //var decval;
                //if (arr.length > 0) decval = arr[1];
                //else decval = "000";
                var decval = ((arr.length > 1) ? arr[1] : "000");
                decval += decval.length == 1 ? "00" : decval.length == 2 ? "0" : "";
                //console.log("abs intval:", intval, "decval:", decval);

                // set the integer part into dom
                ax.intblack.html(intval);

                // see about what dimmed out 0 padding we need
                // use lastval to see if any delta so we have less dom updates to perform since they're slow
                var axla = Math.abs(axl);
                //console.log("abs last val:", axla);
                if (intval >= 100 && axla < 100) ax.intgray.html("");
                else if (intval < 100 && intval >= 10 && (axla < 10 || axla >= 100)) ax.intgray.html("0");
                else if (intval === 0 && axla > 0) ax.intgray.html("00");

                ax.decimal.html(decval);
            }
            // set lastVal so we have it next time into this method
            this.lastVal[axis] = val;
        },
        menuSetup: function () {
            $('#com-chilipeppr-widget-xyz .xyz-showa').click(this.showHideAxisA.bind(this));
            $('#com-chilipeppr-widget-xyz .showhideaaxis').click(this.showHideAxisA.bind(this));
            $('#com-chilipeppr-widget-xyz .showhidemDRO').click(this.showHidemDRO.bind(this));

            // Setup zeroing G92 - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(0).click("x", this.zeroOutAxisG92.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(0).click("y", this.zeroOutAxisG92.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(0).click("z", this.zeroOutAxisG92.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(0).click("a", this.zeroOutAxisG92.bind(this)).prop('href', 'javascript:');;

            // Setup unzeroing G92 - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(1).click("x", this.unzeroOutAxisG92.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(1).click("y", this.unzeroOutAxisG92.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(1).click("z", this.unzeroOutAxisG92.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(1).click("a", this.unzeroOutAxisG92.bind(this)).prop('href', 'javascript:');;

            // Setup goto Work zero - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(2).click("x", this.gotoZero.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(2).click("y", this.gotoZero.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(2).click("z", this.gotoZero.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(2).click("a", this.gotoZero.bind(this)).prop('href', 'javascript:');

            // Setup zeroing G10 (work) - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(3).click("mx", this.zeroOutAxisG10.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(3).click("my", this.zeroOutAxisG10.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(3).click("mz", this.zeroOutAxisG10.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(3).click("ma", this.zeroOutAxisG10.bind(this)).prop('href', 'javascript:');;

            // Setup goto Machine zero - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(4).click("x", this.gotoZeroM.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(4).click("y", this.gotoZeroM.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(4).click("z", this.gotoZeroM.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(4).click("a", this.gotoZeroM.bind(this)).prop('href', 'javascript:');

            // Setup homing with no limit switches - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(5).click("x", this.zeroOutAxisG28.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(5).click("y", this.zeroOutAxisG28.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(5).click("z", this.zeroOutAxisG28.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(5).click("a", this.zeroOutAxisG28.bind(this)).prop('href', 'javascript:');;

            // Setup homing with limit switches - per axis menu
            $('#com-chilipeppr-widget-xyz-x .dropdown-menu a').eq(6).click("x", this.homeAxis.bind(this)).prop('href', 'javascript:');
            $('#com-chilipeppr-widget-xyz-y .dropdown-menu a').eq(6).click("y", this.homeAxis.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-z .dropdown-menu a').eq(6).click("z", this.homeAxis.bind(this)).prop('href', 'javascript:');;
            $('#com-chilipeppr-widget-xyz-a .dropdown-menu a').eq(6).click("a", this.homeAxis.bind(this)).prop('href', 'javascript:');;

        },
        publishSend: function(gcode) {
            var jsonSend = {
                D: gcode,
                Id: "jog" + this.sendCtr
            };
            chilipeppr.publish("/com-chilipeppr-widget-serialport/jsonSend", jsonSend);
            this.sendCtr++;
            if (this.sendCtr > 999999) this.sendCtr = 0;
        },
        gotoG28Position: function(evt) {
            var cmd="G91 G28 Z0\n"
            if(evt.data == "xyz") {
                cmd+= "G28 X0 Y0\n"
            }
            if(this.distance == 'Absolute') {
                cmd += "G90\n"
            } else {
                cmd += "G91\n"
            }
            console.log(cmd);
            this.publishSend(cmd);            
        },
        gotoZeroM: function (evt) {
            this.gotoZero(evt, 'M');
        },
        gotoZero: function (evt, m) {
            console.log("gotoZero. evt.data:", evt.data, "evt:", evt, "m:", m);
            var cmd = "";
            if (m !== undefined) {
                cmd += "G53 ";
            }
            cmd += "G0 ";
            if (evt.data == "xyz") {
                cmd += "X0 Y0";
                // if a axis showing
                if (this.isAAxisShowing) {
                    cmd += " A0";
                }
            } else {
                cmd += evt.data.toUpperCase() + "0";
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);

        },
        zeroOutAxisG10: function (evt) {
            console.warn("zeroOutAxis10. evt.data:", evt.data, "evt:", evt, "lastVal:", this.lastVal.mx);
            var cmd = '';
            if (evt.data == "xyz") {
                cmd += 'G10 L20 P' + (this.lastCoords.coordNum - 53) + ' X' + (this.lastVal.mx) + ' Y' + (this.lastVal.my) + ' Z' + (this.lastVal.mz);
                if (this.isAAxisShowing) {
                    cmd += ' A' + (this.lastVal.ma);
                }
            } else {
                cmd += 'G10 L20 P' + (this.lastCoords.coordNum - 53) + evt.data.substr(-1).toUpperCase() + (this.lastVal[evt.data]);
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);
            
        },
        zeroOutAxisG28: function (evt) {
            console.log("zeroOutAxis28. evt.data:", evt.data, "evt:", evt);
            var cmd = "G28.3 ";
            if (evt.data == "xyz") {
                cmd += "X0 Y0 Z0";
                if (this.isAAxisShowing) {
                    cmd += " A0";
                }
            } else {
                cmd += evt.data.toUpperCase() + "0";
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);
        },
        zeroOutAxisG92: function (evt) {
            console.log("zeroOutAxis92. evt.data:", evt.data, "evt:", evt);
            var cmd = "G92 ";
            if (evt.data == "xyz") {
                cmd += "X0 Y0 Z0";
                if (this.isAAxisShowing) {
                    cmd += " A0";
                }
            } else {
                cmd += evt.data.toUpperCase() + "0";
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);

        },
        unzeroOutAxisG92: function (evt) {
            console.log("zeroOutAxis92. evt.data:", evt.data, "evt:", evt);
            var cmd = "G92.1 ";
            if (evt.data == "xyz") {
                cmd += "X0 Y0 Z0";
                if (this.isAAxisShowing) {
                    cmd += " A0";
                }
            } else {
                cmd += evt.data.toUpperCase() + "0";
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);

        },
        homeAxis: function (evt) {
            // Homes all axes present in command. At least one axis letter must be present. The value (number) must be provided but is ignored.
            // The homing sequence is fixed and always starts with the Z axis (if requested). The sequence runs ZXYA (but skipping all axes that are not specified in the G28.2 command)
            console.log("homeAxis. evt.data:", evt.data, "evt:", evt);
            var cmd = "G28.2 ";
            if (evt.data == "xyz") {
                cmd += "X0 Y0 Z0";
                if (this.isAAxisShowing) {
                    cmd += " A0";
                }
            } else {
                cmd += evt.data.toUpperCase() + "0";
            }
            cmd += "\n";
            console.log(cmd);
            //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
            this.publishSend(cmd);

        },
        isAAxisShowing: false,
        showHideAxisA: function () {
            var el = $('#com-chilipeppr-widget-xyz-a');
            if (el.hasClass('hidden')) {
                this.isAAxisShowing = true;
                el.removeClass('hidden');
                $('#com-chilipeppr-widget-xyz .showhideaaxis').addClass("active");
            } else {
                this.isAAxisShowing = false;
                el.addClass('hidden');
                $('#com-chilipeppr-widget-xyz .showhideaaxis').removeClass("active");
            }
            $(window).trigger('resize');
        },
        ismDROShowing: false,
        showHidemDRO: function () {
            var el = $('#com-chilipeppr-widget-xyz-mx');
            if ($('#com-chilipeppr-widget-xyz-mx').hasClass('hidden')) {
                this.ismDROShowing = true;
                $('#com-chilipeppr-widget-xyz-mx').removeClass('hidden');
                $('#com-chilipeppr-widget-xyz-my').removeClass('hidden');
                $('#com-chilipeppr-widget-xyz-mz').removeClass('hidden');
                $('#com-chilipeppr-widget-xyz .showhidemDRO').addClass("active");
            } else {
                this.ismDROShowing = false;
                $('#com-chilipeppr-widget-xyz-mx').addClass('hidden');
                $('#com-chilipeppr-widget-xyz-my').addClass('hidden');
                $('#com-chilipeppr-widget-xyz-mz').addClass('hidden');
                $('#com-chilipeppr-widget-xyz .showhidemDRO').removeClass("active");
            }
            $(window).trigger('resize');
        },
        btnSetup: function () {
            // setup planner indicator icon
            $('#com-chilipeppr-widget-xyz div.plannerpause').popover({
                html: true,
                delay: 200,
                animation: true,
                trigger: 'hover',
                placement: 'auto',
                container: 'body'
            });

            // in / mm
            $('#com-chilipeppr-widget-xyz .btnInMm').click(this.toggleInMm.bind(this));

            $('#com-chilipeppr-widget-xyz .showhidemDRO').popover();
            $('#com-chilipeppr-widget-xyz .showhideaaxis').popover();
            $('#com-chilipeppr-widget-xyz .btnInMm').popover();
            $('#com-chilipeppr-widget-xyz .btnmachineDRO').popover();
        },
        jogFocusIndicate: function () {
            $('#com-chilipeppr-widget-xyz').addClass("panel-primary");
        },
        jogFocusUnindicate: function () {
            $('#com-chilipeppr-widget-xyz').removeClass("panel-primary");
        },
        isInCustomMenu: false,
        customMenuSetVal: function (itemNum) {
            console.log("setting custom val from itemNum:", itemNum);
            if (itemNum instanceof Object) itemNum = itemNum.data; // convert evt obj to just the data
            var cls = ".jogincrCustomInput" + itemNum;
            var inputEl = $('#com-chilipeppr-widget-xyz-ftr ' + cls);
            var val = parseFloat(inputEl.val());
            if (val != null) {
                $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomVal').text(val);
                this.changeBaseVal({
                    data: {
                        newval: val,
                        cls: ".jogincrCustomBtn"
                    }
                });
            } else $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomVal').text("-");
        },
        jogSetup: function () {
            // attach to focus and blur events
            // when focused, we'll jog
            var that = this;
            $('#com-chilipeppr-widget-xyz-jog').popover();
            $('#com-chilipeppr-widget-xyz-ftr .btn').popover();

            // setup button events
            $('#com-chilipeppr-widget-xyz-ftr .jogx').click("X+", this.jogBtn.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogy').click("Y+", this.jogBtn.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogz').click("Z+", this.jogBtn.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogxneg').click("X-", this.jogBtn.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogyneg').click("Y-", this.jogBtn.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogzneg').click("Z-", this.jogBtn.bind(this));

            //gotoZero
            $('#com-chilipeppr-widget-xyz-ftr .joggotozerow').click("xyz", this.gotoZero.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogzerooutw').click("xyz", this.zeroOutAxisG10.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .joghomem').click("xyz", this.homeAxis.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .joggotozerom').click("xyz", this.gotoZeroM.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogzerooutm').click("xyz", this.zeroOutAxisG28.bind(this));

            //safe position
            $('#com-chilipeppr-widget-xyz-ftr .safez').click("z", this.gotoG28Position.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .safexyz').click("xyz", this.gotoG28Position.bind(this));



            // setup base value increment buttons
            $('#com-chilipeppr-widget-xyz-ftr .jogincr1').click({
                newval: 1.0,
                cls: ".jogincr1"
            }, this.changeBaseVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrpt1').click({
                newval: 0.1,
                cls: ".jogincrpt1"
            }, this.changeBaseVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrpt01').click({
                newval: 0.01,
                cls: ".jogincrpt01"
            }, this.changeBaseVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrpt001').click({
                newval: 0.001,
                cls: ".jogincrpt001"
            }, this.changeBaseVal.bind(this));

            // setup custom increment button
            var custIncrBtn = $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomBtn');
            custIncrBtn.click(function () {
                var txt = $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomVal').text();
                if (txt != "-") {
                    var val = parseFloat(txt);
                    that.changeBaseVal({
                        data: {
                            newval: val,
                            cls: ".jogincrCustomBtn"
                        }
                    });
                }
            });

            var custDropUpBtn = $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomDropUpBtn');
            custDropUpBtn.on('click', function () {
                console.log("drop up btn clicked");
                that.isInCustomMenu = true;
                //$('#com-chilipeppr-widget-xyz-ftr').blur();
            });

            // show/ hide.bs.dropdown
            var custMenu = $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomDropUpMenu').parent();
            custMenu.on('show.bs.dropdown', function () {
                console.log("drop up custom increment menu shown");
                that.isInCustomMenu = true;
                $('#com-chilipeppr-widget-xyz-ftr').blur();
            });
            custMenu.on('hidden.bs.dropdown', function () {
                console.log("drop up custom increment menu hidden");
                that.isInCustomMenu = false;
                $('#com-chilipeppr-widget-xyz-ftr').blur();
            });

            var custInput = $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomInput');
            custInput.click(function (e) {
                console.log("got click on jogincrCustomInput");
                that.isInCustomMenu = true;
                e.stopPropagation();
                $('#com-chilipeppr-widget-xyz-ftr').blur();
                console.log("in custom menu mode");
            });
            custInput.keydown(function (evt) {
                console.log("keypress in custInput. evt:", evt);
                if (evt.keyCode == 13) {
                    console.log("user hit enter");
                    //custMenu.dropdown('toggle');
                    //custMenu.trigger('hide.bs.dropdown');
                    custDropUpBtn.trigger('click');
                    var domEl = $(evt.target);
                    console.log("domEl:", domEl);
                    var cls = domEl.attr('class');
                    cls.match(/jogincrCustomInput(\d)/);
                    var num = RegExp.$1;
                    that.customMenuSetVal(num);
                }
                //evt.preventDefault();
                //evt.stopPropagation();
                //return false;
            });

            // setup custom menu set buttons
            $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomSet1').click(1, this.customMenuSetVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomSet2').click(2, this.customMenuSetVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomSet3').click(3, this.customMenuSetVal.bind(this));
            $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomSet4').click(4, this.customMenuSetVal.bind(this));

            // setup jog btn
            $('#com-chilipeppr-widget-xyz-jog').click(function () {
                console.log("setting focus/blur to footer");
                var elFtr = $('#com-chilipeppr-widget-xyz-ftr');
                //if ($('#com-chilipeppr-widget-xyz').hasClass('panel-primary'))
                //    elFtr.blur();
                //else
                elFtr.focus();
            });

            var isjogging = false;

            $('#com-chilipeppr-widget-xyz-ftr').focusin(function () {
                if (that.isInCustomMenu) {
                    console.log("got focusin for axes widget, but we appear to be showing the custom increment menu, so ignoring focus.");
                    return;
                }
                //console.log("jog area focus");
                $('#com-chilipeppr-widget-xyz').addClass("panel-primary");
                $('#com-chilipeppr-widget-xyz-ftr').addClass("panel-primary");
                isjogging = true;
                that.accelBaseValHilite({});
                console.log("got focusin on axes widget ftr");
            });
            $('#com-chilipeppr-widget-xyz-ftr').focusout(function () {

                //console.log("jog area blur");
                $('#com-chilipeppr-widget-xyz').removeClass("panel-primary");
                $('#com-chilipeppr-widget-xyz-ftr').removeClass("panel-primary");
                isjogging = false;
                that.accelBaseValHilite({});
                console.log("got focusout on axes widget ftr");
            });
            /*$('#com-chilipeppr-widget-xyz-ftr').keypress(function (evt) {
                console.log("got keypress for jog. evt:", evt, evt.which);
            });*/

            // keep track of lastKeydown as a timestamp so we can yeild sending too fast
            that.lastKeydownTime = 0;


            $('#com-chilipeppr-widget-xyz-ftr').keydown(function (evt) {

                if (that.isInCustomMenu) {
                    console.log("custom menu showing. not doing jog.");
                    return true;
                }

                // this lets the cnc controller know we started jogging
                // the controller may or may not care
                if (!isjogging && evt.which > 30 && evt.which < 41) {
                    isjogging = true;
                    chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/jogstart', "");
                }

                // hilite the acceleration
                that.accelBaseValHilite(evt);

                // if this keydown event does not contain a relevant keypress then just exit
                if (!(evt.which > 30 && evt.which < 41)) {
                    //console.log("exiting cuz not arrow key. evt:", evt);
                    return;
                } else {
                    console.log("evt:", evt);
                }

                //if (evt.which != 16 && evt.which != 17 && evt.which != 18) console.log("got keydown for jog. evt:", evt, evt.which);
                // let's slow down keypresses so we don't overwhelm the jogging
                var curTime = new Date().getTime();
                if (curTime - that.lastKeydownTime < 40) {
                    console.log("yeilding cuz time was too quick");
                    return;
                }
                that.lastKeydownTime = curTime;

                // see if planner buffer full, if so yeild
                if (that.isPausedByPlanner) {
                    console.log("planner buffer full. yeilding.");
                    return;
                }

                var key = evt.which;
                var direction = null;
                /*
                var isFast, is100xFast, is1000xFast, is10000xFast = false;
                if (evt.shiftKey == true) {
                    isFast = true;
                }
                if (evt.ctrlKey == true) {
                    is100xFast = true;
                }
                if (evt.shiftKey == true && evt.ctrlKey) {
                    is1000xFast = true;
                }
                if (evt.shiftKey == true && evt.altKey == true) {
                    is10000xFast = true;
                }
                */

                if (key == 38) {
                    // up arrow. Y+
                    direction = "Y+";
                    $('#com-chilipeppr-widget-xyz-ftr .jogy').addClass("hilite");
                } else if (key == 40) {
                    // down arrow. Y-
                    direction = "Y-";
                    $('#com-chilipeppr-widget-xyz-ftr .jogyneg').addClass("hilite");
                } else if (key == 37) {
                    direction = "X-";
                    $('#com-chilipeppr-widget-xyz-ftr .jogxneg').addClass("hilite");
                } else if (key == 39) {
                    direction = "X+";
                    $('#com-chilipeppr-widget-xyz-ftr .jogx').addClass("hilite");
                } else if (key == 33) {
                    // page up
                    direction = "Z+";
                    $('#com-chilipeppr-widget-xyz-ftr .jogz').addClass("hilite");
                } else if (key == 34) {
                    // page down
                    direction = "Z-";
                    $('#com-chilipeppr-widget-xyz-ftr .jogzneg').addClass("hilite");
                }

                if (direction) {
                    //that.jog(direction, isFast, is100xFast, is1000xFast, is10000xFast);
                    that.jog(direction);
                }
            });

            // when key is up, we're done jogging
            $('#com-chilipeppr-widget-xyz-ftr').keyup(function (evt) {

                if (that.isInCustomMenu) {
                    console.log("custom menu showing. not doing jog.");
                    return true;
                }

                // test if keys that represent real jog (i.e. not shift/ctrl/alt, etc)
                if (evt.which > 30 && evt.which < 41) {
                    // let parent method know jogging is done
                    isjogging = false;

                    // this tells the cnc controller to cancel immediately all moves so jog stops fast
                    chilipeppr.publish('/com-chilipeppr-interface-cnccontroller/jogdone', "");
                }

                //if (!(evt.which > 30 && evt.which < 41)) {
                // remove accel hilite
                that.accelBaseValUnhilite();
                //}                

                var key = evt.which;
                if (key == 38) {
                    // up arrow. Y+
                    $('#com-chilipeppr-widget-xyz-ftr .jogy').removeClass("hilite");
                } else if (key == 40) {
                    // down arrow. Y-
                    $('#com-chilipeppr-widget-xyz-ftr .jogyneg').removeClass("hilite");
                } else if (key == 37) {
                    $('#com-chilipeppr-widget-xyz-ftr .jogxneg').removeClass("hilite");
                } else if (key == 39) {
                    $('#com-chilipeppr-widget-xyz-ftr .jogx').removeClass("hilite");
                } else if (key == 33) {
                    // page up
                    $('#com-chilipeppr-widget-xyz-ftr .jogz').removeClass("hilite");
                } else if (key == 34) {
                    // page down
                    $('#com-chilipeppr-widget-xyz-ftr .jogzneg').removeClass("hilite");
                }

                that.lastKeydownTime = 0;
            });

        },
        jogBtn: function (evt) {
            //console.log("jogBtn:", arguments);
            var direction = evt.data;
            this.accelBaseValHilite(evt);
            /*
            var isFast, is100xFast, is1000xFast, is10000xFast = false;
            //var isSuperFast = false;
            if (evt.shiftKey == true) {
                isFast = true;
            }
            if (evt.ctrlKey == true) {
                is100xFast = true;
            }
            if (evt.altKey == true) {
                is1000xFast = true;
            }
            if (evt.shiftKey == true && evt.altKey == true) {
                is10000xFast = true;
            }
            if (evt.shiftKey == true && evt.ctrlKey) {
                is1000xFast = true;
            }
            */

            //this.jog(direction, isFast, is100xFast, is1000xFast, is10000xFast);
            this.jog(direction);
        },
        baseval: 1.00,
        accelBaseval: 1.00,
        customOrigVal: null,
        accelBaseValHilite: function (evt) {
            //console.log("accelBaseValHilite. this.baseval:", this.baseval);
            //this.accelBaseValUnhilite();
            // see if there's an accelerator key. if so hilite blue to indicate
            // we're accelerating
            var accelval = this.baseval;
            //var baseval = this.baseval;
            var isCustom = false;
            if (accelval != 0.001 && accelval != 0.01 && accelval != 0.1 && accelval != 1) {
                // they have a custom val
                //console.log("doing accelerator on custom val");
                isCustom = true;
            }

            if (evt.shiftKey == true) {
                accelval = this.baseval * 10;
            }
            if (evt.ctrlKey == true || evt.altKey == true) {
                accelval = this.baseval * 100;
            }
            if (evt.shiftKey == true && (evt.ctrlKey == true || evt.altKey == true)) {
                accelval = this.baseval * 1000;
            }

            //console.log("accelval:", accelval);
            this.accelBaseval = accelval;

            $('#com-chilipeppr-widget-xyz-ftr .jogincrements-horiz button').removeClass("hiliteblue");

            if (isCustom) {
                // just tweak the val in red <code> instead of hiliting button
                $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomBtn').addClass("hiliteblue");
                this.customOrigVal = this.baseval;
                $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomVal').text(accelval);
            } else {
                this.customOrigVal = null;
                //$('#com-chilipeppr-widget-xyz-ftr .btnincrements button').removeClass("hiliteblue");
                if (accelval == 1.0) $('#com-chilipeppr-widget-xyz-ftr .jogincr1').addClass("hiliteblue");
                if (accelval == 0.1) $('#com-chilipeppr-widget-xyz-ftr .jogincrpt1').addClass("hiliteblue");
                if (accelval == 0.01) $('#com-chilipeppr-widget-xyz-ftr .jogincrpt01').addClass("hiliteblue");
                if (accelval == 0.001) $('#com-chilipeppr-widget-xyz-ftr .jogincrpt001').addClass("hiliteblue");
            }
        },
        accelBaseValUnhilite: function () {
            console.log("accelBaseValUnhilite");
            if (this.customOrigVal != null) {
                // the previous hilite was for custom
                this.customOrigVal = null;
                $('#com-chilipeppr-widget-xyz-ftr .jogincrCustomVal').text(this.baseval);
            }
            this.accelBaseval = this.baseval;

            $('#com-chilipeppr-widget-xyz-ftr .jogincrements-horiz button').removeClass("hiliteblue");
            //$('#com-chilipeppr-widget-xyz-ftr .btnincrements button').removeClass("hiliteblue");
        },
        changeBaseVal: function (evt) {
            console.log("changeBaseVal. data:", evt.data, evt);
            this.baseval = evt.data.newval;
            this.accelBaseval = this.baseval;
            // reset all hilites
            $('#com-chilipeppr-widget-xyz-ftr .jogincrements-horiz button').removeClass("hilite");
            $('#com-chilipeppr-widget-xyz-ftr .jogincrements-horiz button').removeClass("hiliteblue");
            //$('#com-chilipeppr-widget-xyz-ftr .btnincrements button').removeClass("hilite");
            // set new hilite
            $('#com-chilipeppr-widget-xyz-ftr ' + evt.data.cls).addClass("hilite");

            // if this was set from a click, then save cookie
            if (evt.type == "click") {
                console.log("saving cookie");
                this.saveOptionsCookie();
            }
        },
        jog: function (direction, isFast, is100xFast, is1000xFast, is10000xFast) {
            var key = direction;
            var cmd = "G91 G0 ";
            var feedrate = 200;
            var mult = 1;
            var xyz = "";
            //var val = 0.001;
            var val = 1.00;
            //var baseval = 1.00;
            var baseval = this.accelBaseval;

            // adjust feedrate relative to acceleration
            //feedrate = feedrate * ((this.accelBaseval / this.baseval) / 2);

            if (key == "Y+") {
                // up arrow. Y+
                xyz = "Y";
                val = baseval; //0.001;
            } else if (key == "Y-") {
                // down arrow. Y-
                xyz = "Y";
                val = -1 * baseval; //0.001;
            } else if (key == "X+") {
                // right arrow. X+
                xyz = "X";
                val = baseval; //0.001;
            } else if (key == "X-") {
                // left arrow. X-
                xyz = "X";
                val = -1 * baseval; //0.001;
            } else if (key == "Z+") {
                // page up. Z+
                xyz = "Z";
                val = baseval; //0.001;
            } else if (key == "Z-") {
                // page down. Z-
                xyz = "Z";
                val = -1 * baseval; //0.001;
            }
            val = val * mult;

            if (xyz.length > 0) {
                //cmd += xyz + val + " F" + feedrate + "\nG90\n";
                cmd += xyz + val + "\nG90\n";
                // do last minute check to see if planner buffer is too full, if so ignore this cmd
                if (!(this.isPausedByPlanner)) {
                    //chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);
                    this.publishSend(cmd);
                } else {
                    console.log("planner buffer full, so not sending jog cmd");
                }
            }
        },
        initBody: function (evt) {
            $('#' + this.id + ' .hidebody').click(this.toggleBody.bind(this));
            var config = localStorage.getItem("/" + this.id + "/body");
            if (config == "visible") this.showBody();
            else this.hideBody();
        },
        toggleBody: function (evt) {
            if ($('#' + this.id + '-body').hasClass('hidden')) this.showBody(evt);
            else this.hideBody(evt);
        },
        showBody: function (evt) {
            $('#' + this.id + '-body').removeClass('hidden');
            $('#' + this.id + '-ftr').removeClass('hidden');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-down');
            if (!(evt == null)) localStorage.setItem("/" + this.id + "/body", "visible");
            $(window).trigger('resize');
        },
        hideBody: function (evt) {
            $('#' + this.id + '-body').addClass('hidden');
            $('#' + this.id + '-ftr').addClass('hidden');
            $('#' + this.id + ' .hidebody span').removeClass('glyphicon-chevron-up');
            $('#' + this.id + ' .hidebody span').addClass('glyphicon-chevron-down');
            if (!(evt == null)) localStorage.setItem("/" + this.id + "/body", "hidden");
        },
        forkSetup: function () {
            //$('#com-chilipeppr-widget-xyz-tbar-fork').prop('href', this.fiddleurl);
            //$('#com-chilipeppr-widget-xyz-tbar-standalone').prop('href', this.url);
            //$('#com-chilipeppr-widget-xyz .fork-name').html(this.id);
            $('#com-chilipeppr-widget-xyz .panel-title').popover({
                title: this.name,
                content: this.desc,
                trigger: 'hover',
                placement: "auto",
                html: true,
                delay: 200,
                animation: true
            });

            // load the pubsub viewer / fork element which decorates our upper right pulldown
            // menu with the ability to see the pubsubs from this widget and the forking links
            var that = this;
            chilipeppr.load("https://raw.githubusercontent.com/chilipeppr/widget-pubsubviewer/master/auto-generated-widget.html", function () {
                require(['inline:com-chilipeppr-elem-pubsubviewer'], function (pubsubviewer) {
                    pubsubviewer.attachTo($('#com-chilipeppr-widget-xyz .panel-heading .dropdown-menu'), that);
                });
            });

        },
        round: function (num, places) {
            return +(Math.round(num + "e+" + places) + "e-" + places);
        },

    }
});