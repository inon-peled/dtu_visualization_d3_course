function createPicker(fig, func) {

    var height = 20
    var width = 200

    var bub = ["Madison Square Garden", "MoMA Museum", "Beacon Theatre",
        "Bowery Ballroom",
        "Carnegie Hall",
        "Javits Center",
        "Lincoln Center",
        "Playstation Theater",
        "Radio City Music Hall",
        "Terminal 5",
        "The Town Hall"];

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