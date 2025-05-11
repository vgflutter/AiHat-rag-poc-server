import http from 'http';
import config from './config/config.js';
import logger from './config/logger.js';
import app from './app.js';
import { getLocalIp } from './utils/detected.js';
import dotenv from 'dotenv';

dotenv.config();
let server;

server = http.createServer(app);
server.listen(config.port, () => {
  logger.info(`Server running on http://${getLocalIp()}:${config.port}`);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Stop!');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM ricevuto');
  if (server) {
    server.close();
  }
});
