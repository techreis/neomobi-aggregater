import { getSheetByName } from "./libs/spreadSheet";

const OFFSET = 19;
const TARGET_SHEET_NAME = "高配当日本株";

const doPost = (e) => {
  const sheet = getSheetByName(TARGET_SHEET_NAME);
  const params = JSON.parse(e.postData.getDataAsString());
  if (params.type === "basic") {
    setBasicInfo(sheet, params);
  } else if (params.type === "extra") {
    setExtraInfo(sheet, params);
  } else if (params.type === "summary") {
    setSummaryInfo(sheet, params);
  }
  console.log(e);
};

/**
 * 基本情報書き出し
 * @param sheet
 * @param params
 */
const setBasicInfo = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  const index = params.index + 1 + OFFSET;
  sheet.getRange(`A${index}`).setValue(params.index + 1); // インデックス
  sheet.getRange(`B${index}`).setValue(Number(params.ticker)); // コード
  sheet.getRange(`C${index}`).setValue(params.sector); // セクタ
  sheet
    .getRange(`D${index}`)
    .setValue(`=HYPERLINK("${params.link}","${params.name}")`); // 会社名
  sheet.getRange(`E${index}`).setValue(params.valuation); // 評価額
  sheet.getRange(`F${index}`).setValue(params.valuationGainOrLoss); // 評価損益
  sheet.getRange(`G${index}`).setValue(params.ownedQuantity); // 保有株数
  sheet.getRange(`H${index}`).setValue(params.averageAcquisitionUnitPrice); // 平均取得単価
  console.log("setBasicInfo called");
};

/**
 * エクストラ情報書き出し
 * @param sheet
 * @param params
 */
const setExtraInfo = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  console.log("setExtraInfo called");
  const idx = sheet
    .getRange(`B${OFFSET + 1}:B${OFFSET + 1000}`)
    .getValues()
    .flat()
    .filter((x) => x)
    .indexOf(Number(params.ticker));
  if (idx < 0) {
    return;
  }
  const index = idx + 1 + OFFSET;
  sheet.getRange(`I${index}`).setValue(params.buyPrice); // 売る時の価格
  sheet.getRange(`J${index}`).setValue(params.sellPrice); // 買う時の価格
  sheet.getRange(`K${index}`).setValue(params.expectedDividend); // 予想配当金
  sheet.getRange(`L${index}`).setValue(params.expectedYield); // 配当利回り
};

/**
 * サマリー情報書き出し
 * @param sheet
 * @param params
 */
const setSummaryInfo = (
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  params: any
) => {
  console.log("setSummaryInfo called");
  const totalValuation = params.totalValuation.replace(/,/g, "");
  const purchaseCapacity = params.purchaseCapacity.replace(/,/g, "");
  const stockTotal = parseFloat(totalValuation) + parseFloat(purchaseCapacity);
  sheet.getRange("F2").setValue(stockTotal); // 保有資産合計
  sheet.getRange("H2").setValue(params.purchaseCapacity); // 現金残高
  sheet.getRange("J2").setValue(params.totalValuation); // 株式
  sheet.getRange("L2").setValue(params.totalValuationGainOrLoss); // 評価損益合計
};
