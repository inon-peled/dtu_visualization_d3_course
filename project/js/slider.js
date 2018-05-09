function createSlider(svg, margin, width, height, cb) {
    // TODO: make current slider value accessible from outside, so that switching to a different venue can also update the scatter plot of deviations from historical average.
    var x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width - 2 * margin])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin + "," + (height / 2) + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { updateHandle(x.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
        .selectAll("text")
        .data(x.ticks(10))
        .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return d; });

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    slider.transition()
        .duration(750);

    function updateHandle(h) {
        handle.attr("cx", x(h));
        cb(h);
    }
}
