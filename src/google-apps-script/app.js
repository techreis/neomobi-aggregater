const OFFSET = 1;
const TARGET_SHEET_NAME = "TARGET_SHEET_NAME";

const doPost = (e) => {
  const ss = SpreadsheetApp.openById(
    SpreadsheetApp.getActiveSpreadsheet().getId()
  );
  const sheet = ss.getSheetByName(TARGET_SHEET_NAME);
  const params = JSON.parse(e.postData.getDataAsString());
  if (params.type === "basic") {
    setBasicInfo(sheet, params);
  } else if (params.type === "extra") {
    setExtraInfo(sheet, params);
  }
};

// 基本情報書き出し
const setBasicInfo = (sheet, params) => {
  const index = params.index + 1 + OFFSET;
  sheet.getRange(`A${index}`).setValue(params.index + 1); // インデックス
  sheet.getRange(`B${index}`).setValue(params.ticker); // コード
  sheet.getRange(`C${index}`).setValue(params.name); // 会社名
  sheet.getRange(`D${index}`).setValue(params.valuation); // 評価額
  sheet.getRange(`E${index}`).setValue(params.valuationRate); // 評価損益
  sheet.getRange(`F${index}`).setValue(params.ownedQuantity); // 保有株数
  sheet.getRange(`G${index}`).setValue(params.averageAcquisitionUnitPrice); // 平均取得単価
  sheet.getRange(`L${index}`).setValue(params.link); // URL
};

// エクストラ情報書き出し
const setExtraInfo = (sheet, params) => {
  console.log(JSON.stringify(params, null, "  "));
  const idx = sheet
    .getRange(`B${OFFSET + 1}:B${OFFSET + 1000}`)
    .getValues()
    .flat()
    .filter((x) => x)
    .indexOf(Number(params.ticker));
  console.log(`idx=${idx}`);
  if (idx < 0) {
    return;
  }
  const index = idx + 1 + OFFSET;
  sheet.getRange(`H${index}`).setValue(params.probableDividend); // 予想配当金
  sheet.getRange(`I${index}`).setValue(params.dividendYield); // 配当利回り
  sheet.getRange(`J${index}`).setValue(params.timeToSlell); // 買う時の価格
  sheet.getRange(`K${index}`).setValue(params.timeToBuy); // 売る時の価格
};
