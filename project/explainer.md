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

Our visualizations follow the style of an interactive *partitioned posted*, packed into one web-page.

We use the following **Visual Narrative tools**:

- *Consistent visual platform*: all visualizations pertain to the same city area, so we reuse the same map.
- *Close-ups*: one of the plots provides a zoomed view of a 24 hour period, to let the user easily tell when a sharp increase in dropoffs coincides with a big event, as requested by members of the ML^2 group.
- *Motion and zooming*: happen as part of the zoomed view.
- *Animated transitions*: nicely flowing, interactive visualizations through D3 show how the data story evolves.

We use the following **Narrative Structure tools**:

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

## Discussions





##Contributions

90% of the project was made at Inons office, where we used pair programming, sitting together on one screen to process and understand the data as well as create the visualizations in d3. Therefore in all practical regards, we have contributed equally to the project. 

<img src="explainer.assets/1526022914710.png" style="zoom:35%">







