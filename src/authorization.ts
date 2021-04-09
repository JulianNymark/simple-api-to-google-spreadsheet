import { RequestHandler } from 'express';
import {api_keys} from '../config.json';

export var authorize: RequestHandler = (req, res, next) => {
  const api_key = req.headers['x-api-key'];
  if (!(typeof api_key === 'string')) {
    throw new Error('invalid API key in header "x-api-key"');
  }
  if (!api_keys.includes(api_key)) {
    throw new Error(`API key ${api_key} not authorized`);
  }
  next();
}
