import { RequestHandler } from 'express';
import {api_keys as api_keys_config } from '../config.json';

const api_keys = api_keys_config as string[];

export var authorizeApiKey: RequestHandler = (req, res, next) => {
  const api_key = req.headers['x-api-key'];
  if (!(typeof api_key === 'string')) {
    throw new Error('invalid API key in header "x-api-key"');
  }
  if (api_keys.length > 0 && !api_keys.includes(api_key)) {
    throw new Error(`API key ${api_key} not authorized`);
  }
  next();
}
