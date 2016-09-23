## Draftraptor

Draftraptor is a raptor that takes care of auctioning off items in fantasy auctions

## Lazy man's deploy to cloud

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Click to deploy to heroku. It will work fine on the free tier. In fact it's not really made to work with more than one 
process. But you don't need to worry about it if you use the free tier.

## Advanced user's guide

Reqs:

* node (> v6 preferred)

Optional:

* A database (by default sqlite will be used)

Instructions:

* `npm install` (include `--dev` for development dependencies)
* In case current version doesn't get automatically built: `npm run build`
* Install database driver  
  (from sequelize documentation http://sequelize.readthedocs.org/en/latest/docs/getting-started/ )  
  `$ npm install pg pg-hstore`  
  `$ npm install mysql // For both mysql and mariadb dialects`  
  `$ npm install sqlite3`  
  `$ npm install tedious // MSSQL`
* Configure by creating config/local.json and setting values to what you wish.
* Migrate database with `npm run migrate`
* Run server with `npm start`

Development mode:

* Run `npm run dev` (or if gulp is installed globally just `gulp`)

