// import fs from 'fs';
// import readline from 'readline';
import { google } from 'googleapis';

import privatekey from '../service-account-credentials.json';

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

const getData = async (range: string) => {
  const promise: Promise<any[][]> = new Promise((resolve, reject) => {
    sheets.spreadsheets.values.get(
      {
        auth: jwtClient,
        spreadsheetId: '1qcmxYjLvM4dXmT4aKg3Lkc_BJdUhItQrvR1tWXmIbpA',
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

const appendData = async (range: string, rowsData: any[][]) => {
  const promise: Promise<void> = new Promise((resolve, reject) => {
    sheets.spreadsheets.values.append(
      {
        auth: jwtClient,
        spreadsheetId: '1qcmxYjLvM4dXmT4aKg3Lkc_BJdUhItQrvR1tWXmIbpA',
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
  let data = await getData('A:B');
  console.log('data:', data);

  await appendData('A:B', [['hello!', 42, 4.2, 'true', true]]);

  data = await getData('A:B');
  console.log('data:', data);
})();
