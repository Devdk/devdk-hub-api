Needs node & mongodb

To install:

* npm install
* mongod
* bash seed.sh

To run:

* npm install
* mongod
* node bin/www

To test:

* npm install
* npm install mocha -g
* mongod
* mocha test/**

To host:
* run 'npm run postinstall' on every publish
* Following ENVs must be set, when running the server or command
  1. NODE_ENV=production
  2. MONGO_URI=*URL_TO_MONGO/DB*
  3. MEETUP_KEY=*API Key from [Meetup](https://secure.meetup.com/meetup_api/key/)*
* Run *npm run start* to start the server.
* Set up a cron job to run at a certain interval (like 1 hour): *gulp massimport* - this will fetch meetings from meetup. (Remember to give it the MEETUP_KEY env variable too)

[Live version](https://devdk-hub-api.herokuapp.com/)

