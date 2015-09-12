var fs = require("fs");

module.exports = {
  getEvents: function(groupname, key,  cb) {
    fs.readFile(__dirname + '/../../data/meetup_getGroupEvents.json', 'utf8', function (err, data) {
      if (err) throw err;
      cb(null, JSON.parse(data));
    });
  }
};