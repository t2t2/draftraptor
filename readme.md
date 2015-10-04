## Draftraptor

Draftraptor is a raptor that takes care of auctioning off items in fantasy auctions

## Lazy man's deploy to cloud

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Click to deploy to heroku. It will work fine on the free tier. In fact it's not really made to work with more than one 
process. But you don't need to worry about it if you use the free tier.

## Advanced user's guide

Reqs:

* node (> v4 preferred)

Optional:

* A database (by default sqlite will be used)

Instructions:

* `npm install` (include `--dev` for development dependencies)
* In case current version doesn't get automatically built: `./node_modules/.bin/gulp build:production`
* Install database driver  
  ```
  (from sequelize documentation http://sequelize.readthedocs.org/en/latest/docs/getting-started/ )
  $ npm install --save pg pg-hstore
  $ npm install --save mysql // For both mysql and mariadb dialects
  $ npm install --save sqlite3
  $ npm install --save tedious // MSSQL
  ```
* Run server with `node server.js` + approtiate command line args:
    * `--debug` - Show dbug messages
    * `--password={code}` - Admin access code
    * `-p {port}` - Port to run the app on

Development mode:

* Run `./node_modules/.bin/gulp` (or if gulp is installed globally just `gulp`)

