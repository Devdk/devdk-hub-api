var _ = require('lodash');
var api = require("./api");

/**
 * Mapper that maps from a meetup event to a internal meeting.
 */
function meetupEventToMeeting(groupInformation, result) {
  
  // TODO: Needs unit test
  var city = groupInformation.city;
  var venue = result.venue;
  if(venue) {
    var lat = venue.lat;
    var lon = venue.lon;
    
    var cities = [
      { name: "Aarhus", lat: 56.178104, lon: 10.1817985 },
      { name: "Odense", lat: 55.3842478, lon: 10.3978195 },
      { name: "København", lat: 55.6712674, lon: 12.5608388 },
      { name: "Esbjerg", lat: 55.5225198, lon: 8.4635049 },
      { name: "Aalborg", lat: 57.0268098, lon: 9.90782 }
    ];
    
    cities.forEach(function(city) {
      city.distance = getDistance(lat, lon, city.lat, city.lon);
    });
    
    var closeCities = cities.filter(function(city) { return city.distance <= 50; });
    
    if(closeCities.length > 0) {
      var closest = _.min(closeCities, function(city) {
        return city.distance;
      });
      
      city = closest.name;
    } else {
      // Sometimes Meetup does not set the lat lon,
      // so we will try to figure it out from the city of their venue.
      if(venue.city == "Copenhagen") {
        city = "København";
      }
      else if(venue.city == "Aarhus") {
        city = "Aarhus";
      }
      else if(venue.city == "Esbjerg") {
        city = "Esbjerg";
      }
      else if(venue.city == "Odense") {
        city = "Odense";
      }
      else if(venue.city == "København") {
        city = "København";
      }
      else {
        city = groupInformation.city; 
      }
    }
  }
  // END TODO
  
  return {
    title: result.name,
    organizers: [
      groupInformation.organizerName
    ],
    city: city,
    tags: groupInformation.tags,
    description: result.description,
    url: result.event_url,
    meetup_id: result.id,
    starts_at: result.time,
    source: {
      source_type: "meetup",
      source_id: result.id,
      source_time: new Date(),
      data: result 
    }
  };
}

/**
 * Gets a list of internal meetings using a instance of groupInformation.
 * 
 * @param groupInformation a instance of a groupInformation object that contains the information needed for the group.
 * @param callback The callback. Will get a array of internal meeting objects.
 */
module.exports.getMeetingsFromGroup = function(groupInformation, meetupKey, callback) {
  api.getEvents(groupInformation.meetupUrl, meetupKey, function(err, data) {
    if(err) {
      return callback(err);
    }
    
    // We map each item from the meetup record type to the internal record type
    var output = data.results.map(function(x) { return meetupEventToMeeting(groupInformation, x); });
    
    callback(null, output);
  });
};

function getDistance(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}