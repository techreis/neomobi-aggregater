export const getActiveSpreadSheet = () =>
  SpreadsheetApp.openById(SpreadsheetApp.getActiveSpreadsheet().getId());

export const getSheetByName = (name: string) =>
  getActiveSpreadSheet().getSheetByName(name);
