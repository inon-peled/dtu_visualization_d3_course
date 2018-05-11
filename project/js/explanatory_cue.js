function createCue(svg, num, explanation, cx, cy) {
    var circleRadius = 20;
    svg
        .append("circle")
        .attr("class", "cueCircle")
        .attr("r", circleRadius)
        .attr("cx", cx)
        .attr("cy", cy)
        .on("mouseover", function () {
            d3.select(".tooltip")
                .transition()
                .style("display", "inline")
                .style("background", "yellow");
            d3.select(".tooltip")
                .classed("notcue", false)
                .classed("cue", true);
            d3.select(".tooltip")
                .html(explanation)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");
        })
        .on("mouseout", function () {
            d3.select(".tooltip")
                .classed("notcue", true)
                .classed("cue", false);
            d3.select(".tooltip")
                .transition()
                .style("display", "none")
;
        });
    svg
        .append("text")
        .attr("class", "cueText")
        .attr("text-anchor", "middle")
        .attr("x", cx)
        .attr("y", cy + circleRadius / 4)
        .text(num);
}