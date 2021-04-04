import { google } from 'googleapis';

import privatekey from '../service-account-credentials.json';

let args = process.argv.slice(2);

if (args.length > 2 || args.length < 1) {
  console.error(`
  USAGE:
    npm start <spreadsheet_id> [range='A:B']
  `)
  throw new Error('incorrect parameters');
}

const spreadsheetId = args[0]
const range = args[1] ?? 'A:B'

console.log(`spreadsheet: ${spreadsheetId}`);
console.log(`range: ${range}`);

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  undefined,
  privatekey.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('Successfully connected!');
  }
});

const sheets = google.sheets('v4');

const getData = async () => {
  const promise: Promise<any[][]> = new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        auth: jwtClient,
        spreadsheetId,
        range,
      },
      (err, res) => {
        if (err) return reject('The API returned an error: ' + err);

        if (!res) return reject('Bad response from google API: ' + res);

        const rows = res.data.values;
        if (rows && rows.length) {
          return resolve(rows);
        } else {
          return reject('No data found.');
        }
      }
    );
  });
  return promise;
};

const appendData = async (rowsData: any[][]) => {
  const promise: Promise<void> = new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        auth: jwtClient,
        spreadsheetId,
        range,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: {
          values: rowsData,
        },
      },
      (err, res) => {
        if (err) return reject('The API returned an error: ' + err);

        return resolve();
      }
    );
  });
  return promise;
};

(async () => {
  let data = await getData();
  console.log('data:', data);

  await appendData([['hello!', 42, 4.2, 'true', true]]);

  data = await getData();
  console.log('data:', data);
})();
