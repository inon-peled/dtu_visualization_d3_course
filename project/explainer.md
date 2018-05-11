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
To avoid visualization clutter, we focus on taxi dropoffs only in Manhattan during three months: April-June 2016.
We extract dropoffs information, and aggregate it into hourly resolution.

The big events dataset was scraped from several online sources, mainly timeoutworld.com and eventful.com, and
comprises of about 30K events in the aforementioned period. Data features include event title, location, and time.
We focus the visualization on 11 large venues in Manhattan, including e.g. MoMA Museum and Beacon Theatre.
For each event, we display only the event title and start time, because this is enough information for highlighting correlations with taxi dropoffs.

## Genre

We will argue that our visualizations takes the form of an interactive *partitioned posted*, since each visualizations consists of multiple elements such as a map, bar plot etc, that together created the overview. It is however packed into a web-page so there is an argument that the visualizations are partitioned posters, but the overall piece is wrapped in magazine style. All though a more fitting term would probably be "blog" style, such as medium.com

**Visual Narrative**:

- We used a *consistent visual platform* between our visualizations since they display datasets confined in the same area, so it makes sense to reuse the same map.
- *Close-ups* was also used since we have a large timeline and wanted the user to be able to go closer in 24hr intervals. The 24hr intervals was specified by the research group. 
- *Motion and zooming* can be argued as being part of the close-ups. 
- *Animated transitions* is heavily levered using the d3-library. It gives a nice flow to the interactive visualization and gives the user a feeling of seeing the data evolve before their eyes. 

**Narrative Structure**:

- We have a *user directed path* in our last visualization and use a more *linear* style in our first one. The user is guided by our markings. The user is however free to explore the data in the way that they find interesting, that be modifying the threshold with the slider or choosing any time interval, both from interesting points and also anywhere on the timeline. 
- *Hover Highlighting* is used to give the user more information about datapoints that they hover over. This is a nice feature since you limit the amount of noise up front, but you allow the visualization to become richer during exploration. 
- *Filtering* is applied to the data from the input of the user. 
- *Explicted instruction* is available as tooltips
- *Stimulating Default View* is limited. If we had a default venue selected with all the information it would seem like a lot at the same time. Now the user is presented with a map and some empty figures so it is much more tempting to click the map to discover how the empty figures will become filled with interesting data. 
- *Captions and headlines* are used to explain the figures to the user.
- *Accompanying Article* is this explainer webpage
- *Introductory Text:* a short text is provided before the figure.
- *Summary*: We try to sum up our conclusions at the end to give the user an idea of some interesting things that can be found from the data. 

## Visualizations



## Discussions





##Contributions

90% of the project was made at Inons office, where we used pair programming, sitting together on one screen to process and understand the data as well as create the visualizations in d3. Therefore in all practical regards, we have contributed equally to the project. 

<img src="explainer.assets/1526022914710.png" style="zoom:35%">







