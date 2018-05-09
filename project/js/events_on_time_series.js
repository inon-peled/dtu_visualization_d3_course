function read_events_venues_csv(cb) {
    d3.csv('data/events_venues.csv', function (d) {
        return {
            venue: d.venue,
            startTime: new Date(d.start_time),
            lat: parseFloat(d.latitude),
            lon: parseFloat(d.longitude),
            title: d.title_escaped
        };
    }, function (data) {
        // cb(_(data).groupBy('venue').mapValues(function (arr) { return _.sortBy(arr, 'startTime')}).value());
        cb(_(data)
            .groupBy('venue')
            .mapValues(function (arr) { return _.sortBy(arr, 'startTime')})
            .value());
    });
}

function updateEventsOnTimeSeries(fig, func) {

    //Define the group elements holding the display.
    g = fig.selectAll("g")
        .data(bub)
        .enter()
        .append("g")
        .on("click", function (v) {
            updatePicker(fig, v);

            //Find corresponding circle
            f = d3.selectAll(".venueLocation")
            f2 = f.filter(function(d){
                return d.venue === v;
            })

            func.apply(this, f2.data());
        })
        .on("mouseover", function (d) {
            d3.select(this).style("cursor", "pointer");
        });


    //Add rectangles
    g.append("rect")
        .attr("y", function (d, i) {
            return i * (height + 1) + 3;
        })
        .attr("x", 10)
        .attr("height", height)
        .attr("width", width)
        .attr("fill", "grey")
        .attr("fill-opacity", 0.3)

    //Add the text
    g.append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", 15)
        .attr("y", function (d, i) {
            return i * (height + 1) + height - 2;
        })
        .style("font-weight", "bold")
        .style("font-family", "sans-serif")
};

function updatePicker(fig, venue){
    g = fig.selectAll("g")
    g.selectAll("rect")
        .attr("fill", "grey").attr("fill-opacity", 0.3)
    g.selectAll("rect").filter(function (d) {
        return d == venue;
    })
        .attr("fill", "orange")
        .attr("fill-opacity", 0.6);
}