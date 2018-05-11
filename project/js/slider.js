function createSlider(initialValue, valueKeeper, svg, margin, width, height, cb) {
    svg.attr("height", height).attr("width", width);

    svg
        .append("text")
        .attr("class", "plotTitle")
        .text("Deviation from Historical Average:")
        .attr("x", 300)
        .attr("y", 30);

    var x = d3.scaleLinear()
        .domain([0, 5])
        .range([0, width - 2 * margin])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + (1.46 * margin) + "," + (height / 2) + ")");

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
        .attr("r", 9)
        .attr("cx", x(initialValue));

    valueKeeper.value = initialValue;

    slider.transition()
        .duration(750);

    function updateHandle(h) {
        handle.attr("cx", x(h));
        valueKeeper.value = h;
        for(i = 0; i < cb.length; i++){
            cb[i]();
        }
    }
}
