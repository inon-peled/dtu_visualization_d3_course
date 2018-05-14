(function () {
    var dailyEventCountAllVenues;
    var startDate = new Date('2016-04-01');
    var endDate = new Date('2016-07-01');
    var dateRange = rangeOfDates(startDate, endDate);

    var svgDailyEventsWidth = 1150;
    var dailyYAxis;
    var dailyEventsYScale = d3.scaleLinear();
    var hourlyYAxis;
    var hourlyEventsYScale = d3.scaleLinear();
    var barplotAxisPadding = 60;
    var barplotSvgWidth = 600;
    var barplotSvgHeight = 500;
    var barplotSvgWidthYearly = 600;
    var barplotSvgHeightYearly = 300;
    var svgMap1Width = 600;
    var svgMap1Height = 480;
    var circleRadius = 6;

    //Cures used to guide the user
    function createExplanatoryCues() {
        createCue(d3.select("#svgMa"), 1,
            "Choose a venue of big events from the list or the map",
            svgMap1Width / 2, svgMap1Height / 2);
        createCue(d3.select("#svgHourlyEvents"), 2,
            "This plot shows the total number of events at each hour of the day, aggregated over the whole period<br/><br/>" +
            "Using this plot we can see the distributions of when events typically happen at the different venues <br/><br/>" +
            "Some venues like Beacon Theatre almost exclusively has events happening in the evening, where other venues " +
            "Like MoMa (Museum of Modern Art) has events happening throughout the day.",
            100, 50);
        createCue(d3.select("#svgDailyEvents"), 3,
            "This plot shows the number of events that happened each day over the whole period<br/><br/>" +
            "Some venues tend to have a lot of events, others only have a few larger ones", 30, 30);
    }

    function updateDailyBarplot(d) {
        function dateStr(k) {
            return k.getFullYear() + '-' + k.getMonth() + '-' + k.getDate();
        }

        var dailyCountForVenue = _(dailyEventCountAllVenues)
            .filter(function (o) { return o.venue === _.toLower(d.venue)})
            .keyBy('day')
            .mapValues('value')
            .mapKeys(function (v, k) {return dateStr(new Date(k));})
            .value();
        var dailyCountsWithZeros = [];
        for (var i = 0 ; i < dateRange.length ; i++) {
            dailyCountsWithZeros.push({
                date: dateRange[i],
                value: dailyCountForVenue[dateStr(dateRange[i])] || 0
            });
        }
        dailyEventsYScale.domain([0, d3.max(_(dailyCountsWithZeros).map('value').value())]);
        d3.select("#svgDailyEvents")
            .selectAll(".dailyBar")
            .data(dailyCountsWithZeros)
            .transition()
            .ease(d3.easeLinear)
            .attr("y", function (d) {
                return dailyEventsYScale(d.value);
            })
            .attr("height", function (d) {
                return barplotSvgHeightYearly - dailyEventsYScale(d.value) - barplotAxisPadding;
            })
            .attr("fill", "lightsteelblue");
        d3.select("#svgDailyEvents")
            .select(".yAxis")
            .transition()
            .ease(d3.easeLinear)
            .call(dailyYAxis);


    }

    function rangeOfDates(startDate, stopDate) {
        Date.prototype.addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
        var dateArray = [];
        var currentDate = startDate;
        while (currentDate <= stopDate) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    function createBarPlotDailyEventsCount() {
        var svgBarplot = d3
            .select("#svgDailyEvents")
            .attr("width", svgDailyEventsWidth)
            .attr("height", barplotSvgHeightYearly);

        var xScale = d3.scaleTime()
            .domain([startDate, endDate])
            .rangeRound([barplotAxisPadding, svgDailyEventsWidth]);
        var xAxis = d3
            .axisBottom(xScale);

        dailyEventsYScale
            .range([barplotSvgHeightYearly - barplotAxisPadding, barplotAxisPadding])
            .domain([0, 0]);
        dailyYAxis = d3
            .axisLeft(dailyEventsYScale)
            .tickFormat(function (e) {
                return Math.floor(e) !== e ? "" : e;
            });

        svgBarplot
            .selectAll("rect")
            .data(dateRange)
            .enter()
            .append("rect")
            .attr("class", "dailyBar")
            .attr("x", function (d) {
                return xScale(d);
            })
            .attr("width", (svgDailyEventsWidth - barplotAxisPadding) / dateRange.length );
        svgBarplot.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(" + 0 + ", " + (barplotSvgHeightYearly - barplotAxisPadding) + ")")
            .call(xAxis);
        svgBarplot.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + barplotAxisPadding + ", 0)")
            .call(dailyYAxis);
        svgBarplot.append("text")
            .attr("id", "dailyBarPlotTitle")
            .attr("x", svgDailyEventsWidth / 2 + 20)
            .attr("y", barplotAxisPadding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Daily Events Count");
        svgBarplot.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", barplotAxisPadding - 40)
            .attr("x", -barplotSvgHeightYearly / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("#Events");
    }

    function updateHourlyBarplot(d) {
        hourlyEventsYScale.domain([0, d3.max(d.startTime)]);
        d3.select("#svgHourlyEvents")
            .selectAll(".bar")
            .data(d.startTime)
            .transition()
            .ease(d3.easeLinear)
            .attr("y", function (d) {
                return hourlyEventsYScale(d);
            })
            .attr("height", function (d) {
                return barplotSvgHeight - hourlyEventsYScale(d) - barplotAxisPadding;
            })
            .attr("fill", "blue");
        d3.select("#svgHourlyEvents")
            .select(".yAxis")
            .transition()
            .ease(d3.easeLinear)
            .call(hourlyYAxis);
    }

    function createBarPlotHourlyCountEvents() {
        var xScale = d3
            .scaleBand()
            .domain(_.range(24))
            .rangeRound([barplotAxisPadding, barplotSvgWidth])
            .paddingInner(0.05);
        hourlyEventsYScale
            .range([barplotSvgHeight - barplotAxisPadding, barplotAxisPadding])
            .domain([0, 0]);

        var svgBarplot = d3
            .select("#svgHourlyEvents")
            .attr("width", barplotSvgWidth)
            .attr("height", barplotSvgHeight);

        var xAxis = d3
            .axisBottom(xScale)
            .tickFormat(function (d, i) {
                return i;
            });
        hourlyYAxis = d3
            .axisLeft(hourlyEventsYScale)
            .tickFormat(function (e) {
                return Math.floor(e) !== e ? "" : e;
            });

        svgBarplot
            .selectAll("rect")
            .data(_.times(24, _.constant(0)))
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function (d, i) {
                return xScale(i);
            })
            .attr("width", xScale.bandwidth());
        svgBarplot.append("g")
            .attr("class", "xAxis")
            .attr("transform", "translate(0, " + (barplotSvgHeight - barplotAxisPadding) + ")")
            .call(xAxis);
        svgBarplot.append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + barplotAxisPadding + ", 0)")
            .call(hourlyYAxis);
        svgBarplot.append("text")
            .attr("id", "barplotTitle")
            .attr("x", barplotSvgWidth / 2 + 20)
            .attr("y", barplotAxisPadding / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Hourly Events Count");
        svgBarplot.append("text")
            .attr("class", "axisLabel")
            .attr("transform", "rotate(-90)")
            .attr("y", 15)
            .attr("x", -barplotSvgHeight / 2)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("#Events");
        svgBarplot.append("text")
            .attr("class", "axisLabel")
            .attr("y", barplotSvgHeight - barplotAxisPadding / 2)
            .attr("x", barplotSvgWidth / 2 + 20)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Hour of Day");
    }

    function toggleVenueSelection(d) {
        //Expect circle as input (d)

        f = d3.selectAll(".venueLocation1")
            .classed("selected", false)
            .classed("notSelected", true);
        f2 = f.filter(function(d2){
            return d2.venue === d.venue;
        })
            .classed("selected", true)
            .classed("notSelected", false);

        updatePicker1(d3.select("#svgMa"), d.venue)

        updateHourlyBarplot(d);
        updateDailyBarplot(d);
    }

    function createTooltips() {
        var tooltipDiv = d3
            .select("body")
            .append("div")
            .attr("class", "tooltip");

        d3.selectAll(".venueLocation1")
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
            .translate([svgMap1Width / 2 - 120, svgMap1Height / 2 + 200])
            .scale([38000 * 8]);
    }

    var createMap = function (venueLocations) {
        var boroughColors = d3.scaleOrdinal(d3.schemeCategory10);

        var path = d3.geoPath()
            .projection(getProjection());

        var svgMa = d3.select("#svgMa")
            .attr("width", svgMap1Width)
            .attr("height", svgMap1Height);

        d3.json("data/manhattan.geojson", function (json) {
            svgMa.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d, i) {
                    return "steelblue";
                });
            svgMa.append("text")
                .attr("id", "mapTitle")
                .text("Manhattan")
                .attr("x", 420)
                .attr("y", 330);

            createAllCircles(venueLocations);
            createBarPlotHourlyCountEvents();
            createBarPlotDailyEventsCount();
            createExplanatoryCues();

        });
    };

    var createAllCircles = function (venueLocations) {
        d3.select("#svgMa")
            .selectAll("circle")
            .data(venueLocations, function (d) {
                return d;
            })
            .enter()
            .append("circle")
            .attr("class", "venueLocation1")
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

    function readHourlyInfo() {
        d3.csv("data/venue_info.csv",
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
        d3.csv("data/daily_event_count.csv",
            function (d) {
                return {
                    day: new Date(d.day),
                    value: parseInt(d.daily_total),
                    venue: d.venue
                };
            },
            function (allDailyInfo) {
                dailyEventCountAllVenues = allDailyInfo;
                readHourlyInfo();
            }
        );
    }

    readDailyInfo();
    createPicker1(d3.select("#svgMa"), toggleVenueSelection);


})()