import { getSheetByName } from "./libs/spreadSheet";

export const OFFSET2 = 18;
const TARGET_SHEET_NAME2 = "高配当日本株";

export const doPost2 = (e) => {
  const sheet = getSheetByName(TARGET_SHEET_NAME2);
  // const params = JSON.parse(e.postData.getDataAsString());
  const params = {
    type: "basic",
  };
  if (params.type === "basic") {
    setBasicInfo2(sheet, params);
  } else if (params.type === "extra") {
    setExtraInfo2(sheet, params);
  } else if (params.type === "summary") {
    setSummaryInfo2(sheet, params);
  }
  console.log(e);
};

export const setBasicInfo2 = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  console.log("setBasicInfo called");
};

export const setExtraInfo2 = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  console.log("setExtraInfo called");
};

export const setSummaryInfo2 = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  console.log("setSummaryInfo called");
};
