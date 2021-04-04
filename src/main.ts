import { args } from "./arguments";
import { appendData, getData } from "./spreadsheet";

const {spreadsheetId, range} = args();

(async () => {
  let data = await getData(spreadsheetId, range);
  console.log('data:', data);

  await appendData(spreadsheetId, range, [['hello!', 42, 4.2, 'true', true]]);

  data = await getData(spreadsheetId, range);
  console.log('data:', data);
})();
