module.exports = {
	mongodbUrl: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/hub',
  meetupKey:  process.env.MEETUP_KEY
};