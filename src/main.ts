import express, { RequestHandler } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";

import { appendData, getData } from "./spreadsheet";
import {
  range,
  spreadsheet_id,
  api_keys,
  port as portConfig,
} from "../config.json";
import { title } from "./title";
import { authorizeApiKey } from "./authorization";

const useApiKeys = !!api_keys?.length;
const port = portConfig ?? 3001;

const api = express();
api.use(express.json());
api.use(cors()); // comment this out if you want more security
api.use(morgan("combined"));
api.use(helmet.hidePoweredBy()); // swap with api.use(helmet()) if you want more security

let noopMiddleware: RequestHandler = (req, res, next) => next();
let authorize = noopMiddleware;
if (useApiKeys) {
  authorize = authorizeApiKey;
  // api.use(authorize); // uncomment if you want to authorize _every_ endpoint
}

api.get("/rows", async (req, res) => {
  const data = await getData(spreadsheet_id, range);
  res.json({ rows: data });
});

api.post("/rows", authorize, async (req, res) => {
  if (req.headers["content-type"] !== "application/json") {
    res.send('Missing request header: "Content-Type:application/json"');
    return;
  }

  const data_in = req.body; // empty if content-type is not asserted to be 'application/json'
  if (!data_in) {
    res.send("Failed to parse the request body (JSON)");
    return;
  }
  const rows = data_in.rows;
  if (!(Array.isArray(rows) && Array.isArray(rows[0]))) {
    res.send(
      "Shape of request body JSON does not seem to be { rows: any[][] }"
    );
    return;
  }

  await appendData(spreadsheet_id, range, rows);
  res.json({ success: true });
});

api.all("/", (req, res) => {
  const host = req.get("Host");
  res.send(
    `Are you trying to use the simple-api-to-google-spreadsheet? this is the wrong endpoint! <br/><br/> try <h2>POST ${host}/rows</h2> or <h2>GET ${host}/rows</h2>`
  );
});

api.listen(port, () => {
  console.log(title);
  console.log(
    `spreadsheet: https://docs.google.com/spreadsheets/d/${spreadsheet_id}/edit`
  );
  console.log(`range: ${range}`);
  console.log(`API listening on: http://localhost:${port}`);
});
