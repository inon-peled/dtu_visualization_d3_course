(function () {

    //Variables
    var sliderMargin = 300;
    var sliderWidth = 1150;
    var sliderHeight = 50;

    var zoomedAxisPadding = 60;
    var zoomedSvgWidth = 600;
    var zoomedSvgHeight = 500;
    var eventLineWidth = 3;
    var dataScatter;
    var zoomedYAxis;
    var zoomedYScale = d3.scaleLinear();
    var zoomedXScale;

    var stdDevFromHistoricalAverage = { };
    var eventsVenues;
    var timeSeriesLine;
    var timeSeriesXAxis;
    var timeSeriesXScale = d3.scaleTime().domain([new Date('2016-apr-01'), new Date('2016-Jul-01')]);
    var timeSeriesYScale = d3.scaleLinear().domain([0, 500]);
    var meanAndStd;

    var hourlyCountDropoffsAllVenues;
    var eventsAxisPadding = 60;
    var svgDailyEventsHeight = 295;
    var svgDailyEventsWidth = 1150;
    var dailyYAxis;
    var hourlyYAxis;
    var hourlyDropoffsYScale = d3.scaleLinear();
    var barplotAxisPadding = 30;
    var barplotSvgWidth = 300;
    var barplotSvgHeight = 180;
    var svgMapWidth = 600;
    var svgMapHeight = 480;
    var circleRadius = 6;
    var zoomedLine;

    var selectedDate;

    // TODO: place invisible line on top of event line for better hovering.

    function monthName(monthNumZeroBased) {
        return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthNumZeroBased];
    }

    //Cures used to guide the user
    function createExplanatoryCues() {
        createCue(d3.select("#svgMap"), 1,
            "Choose a venue of big events from the list or the map.<br/><br/>" +
            "The small bar plot then shows how taxi dropoffs distribute on a typical day around the selected venue.",
            svgMapWidth / 2, svgMapHeight / 2);
        createCue(d3.select("#svgSlider"), 2,
            "Slide to define a magnitude of difference from historical average of dropoffs.<br/><br/>" +
            "Difference is measured in standard deviations. Historical average pertains to time-of-day (e.g. 20:00) and day-of-week (e.g. Monday).",
            sliderMargin / 2, sliderHeight / 2);
        createCue(d3.select("#svgHourlyTimeSeries"), 3,
            "The highlighted points show extraordinary taxi dropoffs, per the slider value.<br/><br/>" +
            "Click anywhere on the figure or on individual points for a zoomed display of the same day " +
            "-- with contemporaneous big events.", 720, 45);
        createCue(d3.select("#svgZoomed"), 4, "See how extraordinary counts of taxi dropoffs co-occur with " +
            "big events near the selected venue.<br/><br/>Hover over event lines for more information.<br/><br/>" +
            "<b>Findings:</b><ol>" +
            "<li>All venues are active during noon and afternoon. Some venues (e.g. Lincoln Theatre) are most active late at night, others (e.g. Radio City Music Hall) at morning.</li>" +
            "<li>Hourly dropoffs vary more wildly for some venues (e.g. MoMA Museum, Terminal 5) than others (e.g. The Town Hall, Carnegie Hall).</li>" +
            "<li>There are many cases in which dropoffs significantly deviate (at least 2 std. dev.) from historical average one hour before a nearby big event. " +
            "However, this happens more often for some venues (e.g. MoMA Museum) than for others (e.g. Playstation Theatre).</li>" +
            "</ol>", 150, 70);
    }


    function clearZoomed(){ //Clear the zoomed view
        d3.select("#zoomedPath")
            .attr("opacity", 0);
        d3.select('#svgZoomed')
            .selectAll(".eventLine")
            .remove();
        d3.select("#svgZoomed")
            .selectAll(".dot")
            .remove();
        d3.select("#svgZoomed")
            .selectAll(".eventGroup")
            .remove();
    }

    function showZoomed(clickedDateTime) {
        if (d3.select(".selected").empty()) {
            return;
        }

        //Find out which venue is selected and filter data
        var venue = d3.select(".selected").data()[0].venue;
        var data = hourlyCountDropoffsAllVenues
            .filter(function(d) {
                return d.venue.toLowerCase() === venue.toLowerCase();
            })
            .filter(function (d) {
                return hasSameDate(d.date, clickedDateTime);
            });
        if (!_.isEmpty(data)) {
            var overlappingEvents = eventsVenues[venue].filter(function (d) {
                return hasSameDate(d.startTime, clickedDateTime)
            });
            updateZoomed(overlappingEvents, clickedDateTime, _.map(data, 'dropoffs'));
        }
    }

    function zeroPad(value, width) {
        var valueStr = value + '';
        return valueStr.length >= width ? valueStr : new Array(width - valueStr.length + 1).join('0') + valueStr;
    }

    function hasSameDate(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }

    //Update the zoomed plot
    function updateZoomed(overlappingEvents, clickedDateTime, hourlyDropoffsData) {
        zoomedYScale.domain([0, d3.max(hourlyDropoffsData)]);

        d3.select("#zoomedPath")
            .datum(hourlyDropoffsData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 2.5)
            .attr("opacity", 0.5)
            .transition()
            .attr("d", zoomedLine);

        d3.select("#svgZoomed")
            .select(".yAxis")
            .transition()
            .ease(d3.easeLinear)
            .call(zoomedYAxis);
        d3.select("#zoomedTitle")
            .text("Hourly Dropoffs and Events on " + clickedDateTime.getFullYear() + "-" +
                monthName(clickedDateTime.getMonth()) + "-" + zeroPad(clickedDateTime.getDate(), 2));

        function eventLineLocation(d) {
            return zoomedXScale(d.startTime.getHours() + (d.startTime.getMinutes() / 60));
        }

        d3.select('#svgZoomed')
            .selectAll(".eventGroup")
            .remove();

        //Create group element
        g = d3.select("#svgZoomed")
            .selectAll(".eventLine")
            .data(overlappingEvents)
            .enter()
            .append("g")
            .attr("class", "eventGroup")
            .on("mouseover", function (d) {
                d3.select(".tooltip")
                    .transition()
                    .style("display", "inline");
                d3.select(".tooltip")
                    .html(zeroPad(d.startTime.getHours(), 2) + ":" + zeroPad(d.startTime.getMinutes(), 2) + ", " + d.title)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 20) + "px");
                d3.select(this).select("line")
                    .transition()
                    .style("stroke", "purple")
                    .attr("stroke-width", eventLineWidth * 3);
            })
            .on("mouseout", function (d) {
                d3.select(".tooltip")
                    .transition()
                    .style("display", "none");
                d3.select(this).select("line")
                    .transition()
                    .style("stroke", "red")
                    .attr("stroke-width", eventLineWidth);
            })

        //Create line and add a rect around to help with zoom
        var pad = 20
        g.append("rect")
            .attr("x", function(d){
                return eventLineLocation(d) - pad/2;
            })
            .attr("y", zoomedAxisPadding)
            .attr("height", zoomedSvgHeight - 2 * zoomedAxisPadding)
            .attr("width", pad)
            .attr("opacity", 0)

        g.append("line")
            .attr("x1", function(d){
                return eventLineLocation(d);
            })
            .attr("x2", function(d){
                return eventLineLocation(d);
            })
            .attr("class", "eventLine")
            .style("stroke", "red")
            .attr("y2", barplotAxisPadding + 20)    // y position of the second end of the line
            .attr("y1", zoomedYScale(0))      // y position of the first end of the line
            .attr("stroke-width", eventLineWidth)
            .attr("opacity", 1.0)

        ZoomCircles();
    }

    //Add circles the the zoomed plot
    function ZoomCircles(){

        if (typeof selectedDate != "undefined") {

            var zoomedDataScatter = dataScatter.filter(function (d) {
                return hasSameDate(d.date, selectedDate)
            });


            d3.select("#svgZoomed")
                .selectAll(".dot")
                .remove();

            var dotti = d3.select("#svgZoomed")
                .selectAll(".dot")
                .data(zoomedDataScatter);

            dotti.enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", function(d) { return zoomedXScale(d.date.getHours()); })
                .attr("cy", function(d) { return zoomedYScale(parseInt(d.dropoffs)); })
                .style("fill", filler)
                .transition()
                .attr("r", radii)


        }

        function filler(d){
            var picked = d3.select("#svgHourlyTimeSeries").selectAll(".pointselected")
            if (picked.empty()){
                return "blue";
            }
            else if(picked.data()[0].date == d.date){
                return "orange";
            }else{
                return "blue";
            }
        }

        function radii(d){
            var picked = d3.select("#svgHourlyTimeSeries").selectAll(".pointselected")
            if (picked.empty()){
                return 3.5;
            }
            else if(picked.data()[0].date == d.date){
                return 3.5*2;
            }else{
                return 3.5;
            }
        }


    }

    //Create the zoomed plot
    function createZoomed() {
        zoomedXScale = d3
            .scaleLinear()
            .domain([0,24])
            .rangeRound([zoomedAxisPadding, zoomedSvgWidth]);

        zoomedYScale
            .range([zoomedSvgHeight - zoomedAxisPadding, zoomedAxisPadding])
            .domain([0, 0]);

        var svgZoomed = d3
            .select("#svgZoomed")
            .attr("width", zoomedSvgWidth)
            .attr("height", zoomedSvgHeight);

        var xAxis = d3
            .axisBottom(zoomedXScale)
            .tickFormat(function (d, i) {
                return d + ':00';
            });
        zoomedYAxis = d3
            .axisLeft(zoomedYScale)
            .tickFormat(function (e) {
                return Math.floor(e) !== e ? "" : e;
            });

        zoomedLine = d3.line()
            .x(function(d, i){
                return zoomedXScale(i);
            })
            .y(function(d){
                return zoomedYScale(d)
            });

        svgZoomed.append("path")
            .attr("id", "zoomedPath");

        svgZoomed.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0, " + (zoomedSvgHeight - zoomedAxisPadding) + ")")
            .call(xAxis);
        svgZoomed.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + zoomedAxisPadding + ", 0)")
            .call(zoomedYAxis);
        svgZoomed.append("text")
            .attr("id", "zoomedTitle")
            .attr("class", "plotTitle")
            .attr("x", zoomedSvgWidth / 2 + 20)
            .attr("y", zoomedAxisPadding / 2)
            .text("Daily Dropoffs and Events");
        svgZoomed.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 65)
            .attr("x", -zoomedSvgHeight / 5)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("#Dropoffs");
    }

    function updateTimeSeriesPlot() {
        if (d3.select(".selected").empty()) {
            return;
        }

        var venue = d3.select(".selected").data()[0].venue.toLowerCase();
        var data = hourlyCountDropoffsAllVenues.filter(function(d){
            return d.venue.toLowerCase() == venue;
        });

        dataScatter = data.filter(function(d){
            var ms = meanAndStd[venue][d.date.getDay()][d.date.getHours()];
            return d.dropoffs >= ms.mean + stdDevFromHistoricalAverage.value * ms.std;
        });
        timeSeriesXScale.domain(d3.extent(data, function(d) { return d.date; }));
        timeSeriesYScale.domain(d3.extent(data, function(d) { return d.dropoffs; }));

        d3.select("#timeSeriesPath")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.5)
            .attr("d", timeSeriesLine);


        //Select the dots
        var dots = d3.select("#svgHourlyTimeSeries")
            .selectAll(".dot")
            .data(dataScatter)

        //Make new dots
        dots.enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 3.5)
            .attr("cx", function(d) { return timeSeriesXScale(d.date); })
            .attr("cy", function(d) { return timeSeriesYScale(parseInt(d.dropoffs)); })
            .style("fill", "blue")
            .on("mouseover", timeDotsOver)
            .on("click", timeDotsClick)
            .on("mouseout", timeDotsOut)
            .merge(dots) //Merge with existing data
            .attr("r", 3.5)
            .attr("cx", function(d) { return timeSeriesXScale(d.date); })
            .attr("cy", function(d) { return timeSeriesYScale(parseInt(d.dropoffs)); })
            .style("fill", "blue")
            .on("mouseover", timeDotsOver)
            .on("click", timeDotsClick)
            .on("mouseout", timeDotsOut)

        dots.exit()
            .remove();

        //Create axis
        d3.select("#timeSeriesGXAxis")
            .call(d3.axisBottom(timeSeriesXScale));


        d3.select("#timeSeriesGYAxis")
            .call(d3.axisLeft(timeSeriesYScale))


        //Functions for the mouse
        function timeDotsClick(){
            d3.selectAll(".dot")
                .classed("pointselected", false)
                .style("fill", "blue")
                .attr("r", 3.5)
            d3.select(this).attr("r", 8).style("fill", "orange").classed("pointselected", true);
            selectedDate = timeSeriesXScale.invert(d3.select(this).attr("cx"))
            if (selectedDate.getHours() > 22){
                selectedDate.setHours(selectedDate.getHours() + 1)
            }
            showZoomed.call(this, selectedDate);
        }

        function timeDotsOver(){
            d3.select(this).transition().duration(200).attr("r", 8);
        }

        function timeDotsOut(){
            if(!d3.select(this).classed("pointselected")){
                d3.select(this).transition().duration(200).attr("r", 3.5)
            }
        }
    }

    function createTimeSeriesPlot() {
        var svgTimeSeries = d3
            .select("#svgHourlyTimeSeries")
            .attr("width", svgDailyEventsWidth)
            .attr("height", svgDailyEventsHeight);

        timeSeriesXScale.rangeRound([eventsAxisPadding, svgDailyEventsWidth]);
        timeSeriesXAxis = d3
            .axisBottom(timeSeriesXScale);

        timeSeriesYScale
            .range([svgDailyEventsHeight - eventsAxisPadding, eventsAxisPadding]);
        dailyYAxis = d3
            .axisLeft(timeSeriesYScale)
            .tickFormat(function (e) {
                return Math.floor(e) !== e ? "" : e;
            });

        timeSeriesLine = d3.line()
            .x(function (d) {
                return timeSeriesXScale(d.date);
            })
            .y(function (d) {
                return timeSeriesYScale(parseInt(d.dropoffs));
            });

        svgTimeSeries.append("path")
            .attr("id", "timeSeriesPath");

        svgTimeSeries.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -svgDailyEventsHeight / 3)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("#Dropoffs");

        svgTimeSeries.append("text")
            .attr("id", "timelineTitle")
            .attr("class", "plotTitle")
            .attr("x", svgDailyEventsWidth / 2 + 20)
            .attr("y", eventsAxisPadding - 10)
            .text("Hourly Dropoffs over Time");

        //Create axis
        svgTimeSeries.append("g")
            .attr("id", "timeSeriesGXAxis")
            .attr("transform", "translate(0," + (svgDailyEventsHeight - eventsAxisPadding) + ")");

        svgTimeSeries.append("g")
            .attr("id", "timeSeriesGYAxis")
            .attr("transform", "translate(" + (eventsAxisPadding - 5) + ", 0)");

        //Create axis
        d3.select("#timeSeriesGXAxis")
            .call(d3.axisBottom(timeSeriesXScale));

        d3.select("#timeSeriesGYAxis")
            .call(d3.axisLeft(timeSeriesYScale));

        var block = svgTimeSeries.append("g")
            .attr("id", "block")
            .append("rect")
            .attr("width", svgDailyEventsWidth)
            .attr("height", svgDailyEventsHeight)
            .style("opacity", 0);

        block.on("click", function(d){
            selectedDate = timeSeriesXScale.invert(d3.mouse(this)[0])
            if (selectedDate.getHours() > 22){
                selectedDate.setHours(selectedDate.getHours() + 1)
            }
            d3.selectAll(".dot")
                .classed("pointselected", false)
                .style("fill", "blue")
                .attr("r", 3.5)
            showZoomed.apply(this, [selectedDate])
        });
    }

    function updateHourlyBarplot(d) {
        hourlyDropoffsYScale.domain([0, d3.max(d.startTime)]);
        d3.select("#svgHourlyDropoffs")
            .selectAll(".bar")
            .data(d.startTime)
            .transition()
            .ease(d3.easeLinear)
            .attr("y", function (d) {
                return hourlyDropoffsYScale(d);
            })
            .attr("height", function (d) {
                return barplotSvgHeight - hourlyDropoffsYScale(d) - barplotAxisPadding;
            })
            .attr("fill", "blue");
        d3.select("#svgHourlyDropoffs")
            .select(".yAxis")
            .transition()
            .ease(d3.easeLinear)
            .call(hourlyYAxis);
    }

    function createBarPlotHourlyCountDropoffs() {
        var svgBarplot = d3.select("#svgMap")
            .append("g")
            .attr("id", "gHourlyDropoffsBarPlot")
            .append("svg")
            .attr("id", "svgHourlyDropoffs")
            .attr("width", barplotSvgWidth)
            .attr("height", barplotSvgHeight);

        d3.select("#gHourlyDropoffsBarPlot")
            .attr("transform", "translate(0, 300)");

        var pad = 10
        var xScale = d3
            .scaleBand()
            .domain(_.range(24))
            .rangeRound([(barplotAxisPadding + pad), barplotSvgWidth])
            .paddingInner(0.1);
        hourlyDropoffsYScale
            .range([barplotSvgHeight - barplotAxisPadding, barplotAxisPadding])
            .domain([0, 0]);

        var xAxis = d3
            .axisBottom(xScale)
            .tickFormat(function (d, i) {
                return i % 4 === 0 ? (i + ':00') : '';
            })

        hourlyYAxis = d3
            .axisLeft(hourlyDropoffsYScale)
            .ticks(4);

        //Construct tooltips for bar plot
        var tooltipDiv = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip");

        //Construct bawr plot
        svgBarplot
            .selectAll("rect")
            .data(_.times(24, _.constant(0)))
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("width", xScale.bandwidth())
            .on("mouseover", function(d, i){
                d3.select(this)
                    .classed("bar", false)
                    .classed("barSelected", true)

                tooltipDiv.transition()
                    .style("display", "inline")
                    .style("background", "yellow");
                tooltipDiv
                    .html(d)
                    .style("left", (d3.event.pageX + 20) + "px")
                    .style("top", (d3.event.pageY - 20) + "px");
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .classed("bar", true)
                    .classed("barSelected", false)
                tooltipDiv.transition()
                    .style("display", "none");
            });


        //Axis
        svgBarplot.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0, " + (barplotSvgHeight - barplotAxisPadding) + ")")
            .call(xAxis);
        svgBarplot.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + (barplotAxisPadding + pad + 5) + ", 0)")
            .call(hourlyYAxis);

        //Titles and labels
        svgBarplot.append("text")
            .attr("id", "barplotTitle")
            .attr("class", "plotTitle")
            .attr("x", barplotSvgWidth / 2 + 20)
            .attr("y", barplotAxisPadding / 2)
            .text("Average Hourly Dropoffs");
        svgBarplot.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -90)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("#Dropoffs");
    }

    function toggleVenueSelection(d) {
        clearZoomed()
        selectedDate = undefined;
        f = d3.selectAll(".venueLocation")
            .classed("selected", false)
            .classed("notSelected", true);
        f2 = f.filter(function(d2){
            return d2.venue === d.venue;
        })
            .classed("selected", true)
            .classed("notSelected", false);

        updatePicker(d3.select("#svgMap"), d.venue)
        updateHourlyBarplot(d);
        // updateDailyBarplot(d);
        updateTimeSeriesPlot(d.venue.toLowerCase());
    }

    function createTooltips() {
        var tooltipDiv = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip");

        d3.selectAll(".venueLocation")
            .on("mouseover", function (d) {
                if (d3.select(this).attr("r") > 0) {
                    tooltipDiv.transition()
                        .style("display", "inline")
                        .style("background", "yellow");
                    tooltipDiv
                        .html(d.venue)
                        .style("left", (d3.event.pageX + 20) + "px")
                        .style("top", (d3.event.pageY - 20) + "px");
                    d3.select(this)
                        .transition()
                        .attr("r", circleRadius * 2);
                }
            })
            .on("mouseout", function (d) {
                tooltipDiv.transition()
                    .style("display", "none");
                if (d3.select(this).attr("r") > 0) {
                    d3.select(this)
                        .transition()
                        .attr("r", circleRadius);
                }
            })
            .on("click", toggleVenueSelection);


    }

    function getProjection() {
        return d3.geoMercator()
            .center([-74.05, 40.72]) // Approximate center point of NYC.
            .translate([svgMapWidth / 2 - 120, svgMapHeight / 2 + 200])
            .scale([38000 * 8]);
    }

    var createMap = function (venueLocations) {
        var path = d3.geoPath()
            .projection(getProjection());

        var svgMap = d3.select("#svgMap")
            .attr("width", svgMapWidth)
            .attr("height", svgMapHeight);

        d3.json("data/manhattan.geojson", function (json) {
            svgMap.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d, i) {
                    return "steelblue";
                });
            svgMap.append("text")
                .attr("id", "mapTitle")
                .text("Manhattan")
                .attr("x", 420)
                .attr("y", 330);
            createAllCircles(venueLocations);
            createZoomed();
            createTimeSeriesPlot();
            createPicker(d3.select("#svgMap"), toggleVenueSelection);
            createBarPlotHourlyCountDropoffs();
            createSlider(2, stdDevFromHistoricalAverage, d3.select("#svgSlider"),
                sliderMargin, sliderWidth, sliderHeight, [updateTimeSeriesPlot, ZoomCircles]);
            createExplanatoryCues();
        });
    };

    var createAllCircles = function (venueLocations) {
        d3.select("#svgMap")
            .selectAll("circle")
            .data(venueLocations, function (d) {
                return d;
            })
            .enter()
            .append("circle")
            .attr("class", "venueLocation")
            .classed("notSelected", true)
            .attr("cx", function (d) {
                return getProjection()([d.lon, d.lat])[0];
            })
            .attr("cy", function (d) {
                return getProjection()([d.lon, d.lat])[1];
            })
            .attr("r", circleRadius);
        createTooltips();
    };

    function readMeanHourly() {
        d3.csv("data/venue_dropoffs_hourly.csv",
            function (d) {
                var info = {
                    venue: d.venue,
                    lat: parseFloat(d.lat),
                    lon: parseFloat(d.lon),
                    startTime: []
                };
                for (var i = 0; i < 24; i++) {
                    info.startTime.push(parseInt(d[i]));
                }
                return info;
            },
            function (venueLocations) {
                createMap(venueLocations);
            });
    }

    function readDailyInfo() {
        d3.json("data/mean_and_std_dropoffs.json", function (meanAndStdData) {
                meanAndStd = meanAndStdData;
                d3.csv("data/dropoffs_time_series_hourly.csv",
                    function (d) {
                        return {
                            date: new Date(d.date + " " + parseInt(d.hour) + ":00"),
                            dropoffs: parseInt(d.dropoffs),
                            venue: d.venue
                        };
                    },
                    function (allHourlyInfo) {
                        hourlyCountDropoffsAllVenues = allHourlyInfo.filter(function (d) {
                            return (d.date.getMonth() >= 3) && (d.date.getMonth() < 6);
                        });
                        readMeanHourly();
                    }
                );
            }
        );
    }

    function readEventsVenues() {
        read_events_venues_csv(function (data) {
            eventsVenues = data;
            readDailyInfo();
        });
    }

    readEventsVenues();
})()