function read_events_venues_csv(cb) {
    d3.csv('data/events_venues.csv', function (d) {
        return {
            venue: d.venue,
            startTime: new Date(d.start_time),
            lat: parseFloat(d.latitude),
            lon: parseFloat(d.longitude),
            title: d.title_escaped
        };
    }, function (data) {
        // cb(_(data).groupBy('venue').mapValues(function (arr) { return _.sortBy(arr, 'startTime')}).value());
        cb(_(data)
            .groupBy('venue')
            .mapValues(function (arr) { return _.sortBy(arr, 'startTime')})
            .value());
    });
}

function dailyEventsOfVenue(eventVenueData, venue, date) {
    return eventVenueData[venue].filter(function (d) {
        return d.startTime.getFullYear() === date.getFullYear() &&
            d.startTime.getDate() === date.getDate() &&
            d.startTime.getMonth() === date.getMonth();
    });
}
