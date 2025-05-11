import logger from '../config/logger.js';

const logRequest = (endpoint, req, prompt, response) => {
  if (process.env.NODE_ENV !== 'development') return;

  logger.info(`${endpoint} REQUEST: %s`, JSON.stringify(req, null, 2));
  logger.info(`${endpoint} GENERATED PROMPT: %s`, prompt);
  logger.info(`${endpoint} RESPONSE: %s`, JSON.stringify(response, null, 2));
};

export { logRequest };
