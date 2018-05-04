function plotTimeLineOfDropoffs(margin, width, height, svgId, venueName) {
    var parseTime = d3.timeParse("%Y-%m-%d %H");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    var valueline = d3.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.dropoffs);
        });

    d3.csv("./data/dropoffs_time_series_hourly.csv", function (error, data) {
        if (error) throw error;

        data = _.filter(data, function (d) { return d.venue === venueName; });

        // format the data
        data.forEach(function (d) {
            d.date = parseTime(d.date + ' ' + d.hour);
            d.dropoffs = +d.dropoffs;
        });

        // Scale the range of the data
        x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        y.domain([0, d3.max(data, function (d) {
            return d.dropoffs;
        })]);

        // Add the valueline path.
        d3.select("#" + svgId).select("#gPath")
            .data([data])
            .attr("class", "line")
            .attr("d", valueline);

        // Add the X Axis
        d3.select("#" + svgId).select("#gX")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        d3.select("#" + svgId).select("#gY")
            .call(d3.axisLeft(y));

    });
}
