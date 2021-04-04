# simple API to google spreadsheet

This project creates an API server that sits between a google spreadsheet and you!

![image](./README/architecture.png)

> using a spreadsheet as your DB!

## run

:warning: you must do 5 _extremely painful_ manual steps to get this server to work! :warning:

1. **Who are you?!** To run, the server expects a service-account credential JSON file to reside in the project root (where .git is located). The file _must_ be named `service-account-credentials.json`. To create and download this JSON file, follow this guide: https://cloud.google.com/docs/authentication/production#create_service_account

2. **What spreadsheet?!**. You must have a spreadsheet id (to identify _which_ spreadsheet to work with), copy the id from the URL of a spreadsheet _you_ own. When running the application in the final step, substitute the `<spreadsheet_id>` with the _actual_ id of your spreadsheet. You can get this from the URL of a google google spreadsheet.  

For example the URL

```
https://docs.google.com/spreadsheets/d/1qcmxYjLvM4dXmT4aKg3lkc_BJdUhItQrvR1tWXmIbbA/edit
```

has the spreadsheet id:
```
1qcmxYjLvM4dXmT4aKg3lkc_BJdUhItQrvR1tWXmIbbA
```

3. (optional) **What _range_ inside the spreadsheet?!?!** You have to define where the valuable data resides _within_ the spreadsheet, to get an idea of ranges, read https://spreadsheet.dev/range-in-google-sheets. The default of this is `A:B` (assumes data stored in the _first two columns looking for the first contiguous block (no empty rows) of data_). Ranges let you re-use existing spreadsheets that might not look "clean". substitute the `[range='A:B']` part of the last step with your desired range.

4. **Share it!**. For the service-account to get access to this spreadsheet, you must share it with the service-account. Inside the `service-account-credentials.json` file, there should be a property called `client_email`, share the document with this email from the spreadsheet web GUI.

5. **Run it! :heavy_check_mark: :100: :tada:** The server is written in Node.js, so to run it, you must have `node`, `npm`.

```shell
npm i
npm start <spreadsheet_id> [range='A:B']
```


## API doc

:warning: this doc shows example values with a range `A:B` (aka. data stored in the _first two columns_)

:warning: the current version of this API has _no_ authorization, meaning anyone sending a properly formed http request can _tamper_ with your spreadsheet! it's very bare bones.

### POST /rows
headers:

- Content-Type:application/json

body:
```json
{
    "rows": [
            ["2020-01-02", "bad"]
        ]
}
```

### GET /rows

response:
```json
{
    "rows": [
            ["day", "health"],
            ["2020-01-01", "good"],
            ["2020-01-02", "bad"]
        ]
}
```

### CURL test 

![working curl example](./README/working_curl_test.png)