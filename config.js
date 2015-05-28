module.exports = {
	mongodbUrl: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || process.env.MONGO_URI || 'mongodb://localhost:27017/hub',
  meetupKey:  process.env.MEETUP_KEY
};