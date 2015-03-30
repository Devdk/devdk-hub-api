var async = require('async'),
	fs 	  = require('fs'),
	readline = require('readline');

var config = require('./config');

var MongoClient = require('mongodb').MongoClient;

var inputFileName = 'datadumb/meetings.json';
var outputFileName = 'datadumb/tmp_meetings.json';

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log("WARNING: This program will remove all the meetings in the mongo database: hub/meetings, and reimport them from the dump.");
rl.question("Press enter to continue", function(answer) {
	rl.close();
	
	startImport();
})

function startImport() {
	// Executes each step, and supplying the next with its output
	async.waterfall(
	[
		readFile,
		parseJson,
		convertData,
		importIntoMongo
	], function(err, result) {
		if (err) throw err;
		console.log("Done");
	});
}

function readFile(callback) {
	console.log("Reading datadumb");
	fs.readFile(inputFileName, 'utf8', function(err, data) {
		if(err) throw err;
		callback(null, data);
	});	
}

function parseJson(data, callback) {
	console.log("Parsing JSON");

	// Dumps for geehub is a strange form of invalid JSON. Each line is its own record, in a array.
	// Because we don't really care for speed, we will just parse each line
	var records = data.split('\n').filter(function(line) { return line.length > 0; }).map(JSON.parse);
	callback(null, records);
}

function convertData(data, callback) {
	console.log("Converting data");

	var records = data.map(function(meeting) {
		return {
			imported_id: meeting.Id,
			title: meeting.Title,
			starts_at: Date.parse(meeting.StartsAt),
			created_at: Date.parse(meeting.CreatedAt),
			description: meeting.Description,
			url: meeting.Url,
			tags: meeting.Tags.map(function(tag) { return tag.Name; }),
			organizers: meeting.Organizers.map(function(organizer) { return organizer.Name; }),
			city: meeting.City != null ? meeting.City.Name : null,
			deleted_at: meeting.DeletedAt ? Date.parse(meeting.DeletedAt) : null
		}
	});

	callback(null, records);
}

function importIntoMongo(meetings, callback) {
	console.log("Inserting into MongoDB");

	MongoClient.connect(config.mongodbUrl, function(err, db) {
		if(err) throw err;
		var collection = db.collection("meetings");
		collection.remove();
		collection.insert(meetings, function(err) {
			db.close();
			callback(err);
		});

	});
}


