import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import compression from 'compression';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import v1Routes from './routes/v1/index.js';

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());

app.use(passport.initialize());

app.use('/api/v1', v1Routes);

export default app;
