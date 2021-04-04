import { appendData, getData } from "./spreadsheet";

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

(async () => {
  let data = await getData(spreadsheetId, range);
  console.log('data:', data);

  await appendData(spreadsheetId, range, [['hello!', 42, 4.2, 'true', true]]);

  data = await getData(spreadsheetId, range);
  console.log('data:', data);
})();
