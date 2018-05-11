# Project Explainer Page

## Motivation

We are working with two datasets in this project:

1. New York taxi data: A dataset containing a lot of information, e.g dropoffs, price, time etc of trips with the yellow New York Taxis. 
2. New York event data: A dataset that has been scraped from eventful, containing information about events happening all over new york. For the events we focused on a small group of selected venues. 

The motivation for this project is to create a research tool for the *machine learning for mobility*-group at DTU. Right now the group use a lot of manual labor to explore event data in NYC. They construct a large amount of plots to see which events could be interesting to look at in regards to impact on the flow of traffic in the vicinity of the event. We wish to make a interactive tool, that let's the user explore interesting points in time, simply by moving a slider that controls how extreme deviations from the normal he wants to see and then he can just simply click on these points to get a zoomed in view of both the flow of traffic at that time frame, as well as data about the events at that time. 

This tool will be a great help to the group, as it will be much easier to find relevant points in the big dataset, enabling acceleration of future research. 

## Basic stats



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







