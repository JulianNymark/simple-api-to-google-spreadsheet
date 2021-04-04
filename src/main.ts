import express from 'express';

import { args } from "./arguments";
import { appendData, getData } from "./spreadsheet";

const {spreadsheetId, range} = args();

const api = express();
api.use(express.json());
const port = 3001;

api.get('/rows', async (req, res) => {
  const data = await getData(spreadsheetId, range);
  res.json({ rows: data });
});

api.post('/rows', async (req, res) => {
  if (req.headers['content-type'] !== 'application/json') {
    res.send('Missing request header: "Content-Type:application/json"');
    return;
  }

  const data_in = req.body;
  if (!data_in) {
    res.send('Failed to parse the request body (JSON)');
    return;
  }
  const rows = data_in.rows;
  if (!(Array.isArray(rows) && Array.isArray(rows[0]))) {
    res.send('Shape of request body JSON does not seem to be { rows: any[][] }')
    return;
  }

  await appendData(spreadsheetId, range, rows);
  res.json({success: true});
});

api.all('/', (req, res) => {
  const host = req.get('Host');
  res.send(`Are you trying to use the simple-api-to-google-spreadsheet? this is the wrong endpoint! <br/><br/> try <h2>POST ${host}/rows</h2> or <h2>GET ${host}/rows</h2>`);
});

api.listen(port, () => {
  console.log(`API listening http://localhost:${port}`);
});