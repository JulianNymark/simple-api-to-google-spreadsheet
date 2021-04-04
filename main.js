const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const privatekey = require('./service-account-credentials.json');

// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key,
  [
    "https://www.googleapis.com/auth/spreadsheets",
  ]
);

jwtClient.authorize(function (err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Successfully connected!");
  }
});

function listMajors() {
  const sheets = google.sheets('v4');

  sheets.spreadsheets.values.get(
    {
      auth: jwtClient,
      spreadsheetId: "1qcmxYjLvM4dXmT4aKg3Lkc_BJdUhItQrvR1tWXmIbpA",
      range: 'A1:B1',
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const rows = res.data.values;
      if (rows.length) {
        rows.map((row) => {
          console.log(`${row[0]}, ${row[1]}`);
        });
      } else {
        console.log("No data found.");
      }
    }
  );
}

listMajors();
