export const args = () => {
  let args = process.argv.slice(2);

  if (args.length > 2 || args.length < 1) {
    console.error(`
  USAGE:
    npm start <spreadsheet_id> [range='A:B']
  `);
    throw new Error("Invalid arguments");
  }

  const spreadsheetId = args[0];
  const range = args[1] ?? "A:B";

  console.log(`spreadsheet: ${spreadsheetId}`);
  console.log(`range: ${range}`);

  return { spreadsheetId, range }
};
