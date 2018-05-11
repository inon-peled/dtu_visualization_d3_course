# Project Explainer Page

## Motivation

This project presents two datasets which pertain to Manhattan, NYC: taxi dropoffs, and big events.

The motivation for this project is to create an interactive research tool for the *machine learning for mobility* (ML^2) group at DTU Transport.
Currently, the group does a lot of manual labor to explore correlations between changes in taxi dropoffs and big events in NYC.
This project provides a tool which relieves such manual labor. The tool will greatly help the ML^2 group,
by making it much easier and quicker to spot possible correlations, and thus accelerate future research.

## Basic stats

The original taxi dataset comprises of about 120M rows of trip data, taken from the Open NYC website.
Data features include pickup and dropoff location and time, as well as trip price.
To avoid visual clutter, we focus on taxi dropoffs only in Manhattan during three months: April-June 2016.
We extract dropoffs information, and aggregate it into hourly resolution.

The big events dataset was scraped from several online sources, mainly timeoutworld.com and eventful.com, and
comprises of about 30K events in the aforementioned period. Data features include event title, location, and time.
We focus the visualization on 11 large venues in Manhattan, including e.g. MoMA Museum and Beacon Theatre.
For each event, we display only the event title and start time, because this is enough information for highlighting correlations with taxi dropoffs.

## Genre

Our visualizations follow the style of an interactive *partitioned posted*, packed into one web-page.

Let us now detail which tools we use and why. We use the following **Visual Narrative tools**:

- *Consistent visual platform*: all visualizations pertain to the same city area, so we reuse the same map.
- *Close-ups*: one of the plots provides a zoomed view of a 24 hour period, to let the user easily tell when a sharp increase in dropoffs coincides with a big event, as requested by members of the ML^2 group.
- *Motion and zooming*: happen as part of the zoomed view.
- *Animated transitions*: nicely flowing, interactive visualizations through D3 show how the data story evolves.

We also use the following **Narrative Structure tools**:

- *User directed path*: circled numbers guide the user through opearting the interactive plots in a linear style. The user is then free to explore the data as they wish.
- *Hover Highlighting*: multiple elements in the web page provide more information when hovered on, including events. This way, the user can obtain more information at their own pace, without cluttering the page with persistent text.
- *Filtering*: per user selection, e.g. using the slider.
- *Explicted instruction*: available as tooltips.
- *Stimulating Default View* is limited, to encourage the user to select a venue of interest.
- *Captions and headlines*: explain the figures to the user.
- *Accompanying Article*: the explainer webpage
- *Introductory Text:* a short introductory text is provided at page top.
- *Summary*: we offer some conclusions, as we found through our interactive tool, thus showing its effectiveness.

## Visualizations

Following are the visualizations we use, and how they serve the data story of correlations between taxi dropoffs and big events.

1. A map and list for selecting an events venue. These two elements work together to allow easily selection, and then keep the selected venue clearly highlighted.
2. Bar plot of average hourly taxi dropoffs within 500m of the selected venue. This gives the user a quick overview of when the venue is most active, as reflected in demand for public transportation.
3. A timeline of hourly dropoffs in Apr-June 2016. This provides an overview of how demand for taxi evolves over time around the venue.
4. A slider for defining a magnitude of deviation from historical average of dropoffs. This allows the researcher to define points of interest in the timeline, i.e. time points when the hourly count of dropoffs surges.
5. A zoomed display of one day, corresponding to a click on the timeline plot, and overlayed with co-ocurring events. This is the plot which lets the user tell whether a surge in taxi dropoffs correlates with any big events within 500m of the selected venue.

## Discussion

On the bright side, we managed to yield a useful research tool, per the needs and requests of the Machine Learning for Mobility Group in DTU Transport.
It is also nice that we kept visual clutter low, while letting the user access and additionally useful information interactively.
We think that the tool effectively packs hundreds of thousand of data records into a well flowing display.

However, the tool can be further improved. We could display more than 3 months of data, if e.g. we use some scrolling mechanism.
We could also display taxi pickups, not only dropoffs.
Finally, the data for this project is preprocessed offline, and it would be a great to provide some online tool for processing new data, which Open NYC releases about twice a year.

##Contributions

90% of the project was made at Inons office, where we used pair programming, sitting together on one screen to process and understand the data as well as create the visualizations in d3. Therefore in all practical regards, we have contributed equally to the project. 

<img src="explainer.assets/1526022914710.png" style="zoom:35%">







