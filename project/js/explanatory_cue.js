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
                .html(explanation)
                .style("left", (d3.event.pageX + 20) + "px")
                .style("top", (d3.event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            d3.select(".tooltip")
                .transition()
                .style("display", "none");
        });
    d3.select("#svgMap")
        .append("text")
        .attr("class", "cueText")
        .attr("text-anchor", "middle")
        .attr("x", cx)
        .attr("y", cy + circleRadius / 4)
        .text(num);
}