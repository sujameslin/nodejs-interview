// import { ItemRouter } from './api/item/item.router';
// import { TagRouter } from './api/tag/tag.router';
// import { UserRouter } from './api/user/user.router';
const express = require('express');
const Config = require('./config/environment/index');
const UserRouter = require('./api/user/user.router');
const Mongoose = require('mongoose');
const http = require('http');
const Q = require('q');
const bodyParser = require('body-parser');
const compression = require('compression');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');

class App {

  constructor () {
    this.app = express();
    this.initMongoose();
    this.initExpress();
    this.initRoutes();
    this.initErrorHandler();
  }

  run () {
    const defer = Q.defer();

    Mongoose.connect(Config.mongo.uri, Config.mongo.options, error => {
      if (error) {
        return defer.reject(error);
      }

      const server = http.createServer(this.app);
      server.listen(Config.port, () => {
        defer.resolve();
      });
    });

    return defer.promise;
  }

	stop () {
		return Mongoose.connection.close();
	}

  initExpress () {
    this.app.use(compression());
    this.app.use(bodyParser.json({limit: '5mb'}));
    this.app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
    this.app.use(methodOverride());

    if (Config.env !== 'test') {
      this.app.use(App.requestLogger);
    }
  }

  initErrorHandler () {
    this.app.use(errorHandler({log: App.errorNotification}));
  }

  initRoutes () {
    this.app
      .use('/users', UserRouter)
      .use('/', express.Router().get('/', (req, res) => {
        return res.send('pennybox-nodejs-test-task');
      }));
  }

  initMongoose () {
    Mongoose.Promise = Q.Promise;
    Mongoose.set('debug', Config.mongo.debug);

    Mongoose.connection.on('reconnected', () => {
      console.warn('MongoDB reconnected!');
    });
    Mongoose.connection.on('disconnected', () => {
      console.error('MongoDB disconnected!');
    });
  }

  static errorNotification (error,
                            message,
                            req) {
    console.error(`Error in ${req.method} ${req.url}`, {error, message}, req);
  }

  static requestLogger (req,
                        res,
                        next) {
    // console.log('Request', {}, req);
    next();
  }
}

module.exports = App;
