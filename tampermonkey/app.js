// @ts-check
// ==UserScript==
// @name         SBIネオモバイル株情報抽出
// @version      1.0
// @description  Amazon自動操作
// @author       anonymouse
// @match        https://trade.sbineomobile.co.jp/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

class NeomobiAggregater {
  constructor() {
    this.INTERVAL_WAIT = 1000;
    this.DETAIL_PAGE_LOAD_WAIT = 5000;
    this.util = new Util();
  }

  /**
   * 基本的な情報を取得する
   */
  async getBasicInfo() {
    const results = /** @type {HTMLElement} */ (document.querySelectorAll(
      "[class='panels']"
    ));
    const links = [];
    results.forEach((item, index) => {
      const params = this.generateBasicParams(item, index);
      this.util.post(JSON.stringify(params));
      let link = item.querySelector(".panel .stockInfo .name a");
      link.setAttribute("href", params.link);
      links.push(link);
    });
    let intervalCount = 0;
    const intervalId = setInterval(() => {
      window.open(links[intervalCount].href);
      if (intervalCount === links.length - 1) {
        clearInterval(intervalId);
      }
      intervalCount++;
    }, this.INTERVAL_WAIT);
  }

  /**
   * 追加パラメータを生成する
   */
  generateExtraParams(elem, ticker) {
    const kehais = elem.querySelectorAll("._text-c span");
    const haitos = elem.querySelectorAll("td._text-r span");
    return {
      ticker,
      type: "extra",
      timeToSlell: kehais[0].textContent.trim(), // 買う時の価格
      timeToBuy: kehais[1].textContent.trim(), // 売る時の価格
      probableDividend: haitos[0].textContent.trim(), // 予想配当金
      dividendYield: haitos[1].textContent.trim(), // 配当利回り
    };
  }

  /**
   * 追加の情報を取得する
   */
  async getExtraInfo() {
    const detail = document.querySelector(".showDetail");
    detail.click();
    await this.util.wait(this.DETAIL_PAGE_LOAD_WAIT);
    const modal = document.querySelector(".iziModal-content");
    const params = this.generateExtraParams(modal, location.href.slice(-4));
    this.util.post(JSON.stringify(params));
  }

  /**
   * 基本パラメータを生成する
   */
  generateBasicParams(item, index) {
    return {
      index,
      type: "basic",
      ticker: item
        .querySelector(".panel .stockInfo .ticker")
        .textContent.trim(), // コード
      name: item.querySelector(".panel .stockInfo .name").textContent.trim(), // 会社名
      valuation: item.querySelector(".price .value span").textContent.trim(), // 評価額
      valuationRate: item.querySelector(".price .rate span").textContent.trim(), // 評価損益
      ownedQuantity: item
        .querySelectorAll("table td")[1]
        .textContent.replace(/株/g, "")
        .trim(), // 保有株数
      averageAcquisitionUnitPrice: item
        .querySelectorAll("table td")[4]
        .textContent.replace(/円/g, "")
        .trim(), // 平均取得単価
      link: `https://trade.sbineomobile.co.jp/domestic/stockInfo/brand?securitiesCode=${item
        .querySelector(".panel .stockInfo .ticker")
        .textContent.trim()}`,
    };
  }
}

class Util {
  constructor() {
    this.targetGASURL =
      "https://script.google.com/macros/s/AKfycbysfH1V-G2KaUDsNue2AuEd1rkCOaKsj2Nsg5RpI7NloYKItnp1/exec";
  }
  async wait(msec) {
    return new Promise((r) => setTimeout(r, msec));
  }

  setButton(btnName, boxSelector, callback) {
    const target = /** @type {HTMLElement} */ (document.querySelector(
      boxSelector
    ));
    let btnElement = document.createElement("button");
    btnElement.textContent = btnName;
    btnElement.onclick = callback;
    target.appendChild(btnElement);
  }

  /**
   * GAS側にデータを送信する
   * @param params
   **/
  post(params) {
    GM_xmlhttpRequest({
      method: "POST",
      url: this.targetGASURL,
      data: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
  }
}

(async () => {
  /**
   * MAIN
   * 2020/09/30現在動作
   */
  const neomobi = new NeomobiAggregater();
  const util = new Util();
  const NEOMOBI_DOMAIN = "https://trade.sbineomobile.co.jp";
  const PORTFOLIO = "account/portfolio";
  const STOCK_INFO = "domestic/stockInfo";
  const DETAIL_PAGE_LOAD_WAIT = 10000;
  const DETAIL_PAGE_CLOSE_WAIT = 3000;
  if (location.href.includes(`${NEOMOBI_DOMAIN}/${PORTFOLIO}`)) {
    util.setButton("スタート", "[id=menu]", () => {
      neomobi.getBasicInfo();
    });
    // 一覧ページ
  } else if (location.href.includes(`${NEOMOBI_DOMAIN}/${STOCK_INFO}`)) {
    // 詳細ページ
    await util.wait(DETAIL_PAGE_LOAD_WAIT);
    await neomobi.getExtraInfo();
    await util.wait(DETAIL_PAGE_CLOSE_WAIT);
    window.close();
  }
})();
