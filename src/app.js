import express from 'express';
import logger from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import config from 'config';
import cors from 'cors';
import errorHandler from './middlewares/error-handler';
const app = express();

import Setup from './setup';
Setup.initialize(config);

import routes from './routes';

app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

// check api version
// app.use(checkApiVersion);

app.use(cors());
// app.options('*', corsMiddleware);


// load routes file with an express app object
routes(app);
// Setup.setupElasticSearchMapping();

// catch 404 and forward to error handler
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// development error handler
// will print stacktrace
app.use(errorHandler);

const server = http.createServer(app);
app.set('port', config.get('app.port'));
const port = app.get('port');
server.listen(port, () => {
	console.log(`Application listening on ${config.get('app.baseUrl')}`);
	console.log(`Environment => ${config.util.getEnv('NODE_ENV')}`);
});

export default app;
