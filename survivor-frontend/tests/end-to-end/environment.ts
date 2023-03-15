import NodeEnvironment from "jest-environment-node";
import puppeteer, { Browser, Page } from "puppeteer";

// https://jestjs.io/docs/puppeteer
class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config: any, _context: any) {
    super(config, _context);
  }

  async setup() {
    await super.setup();

    const browser = await puppeteer.launch();
    this.global.baseUrl = "http://localhost";
    this.global.browser = browser;
    this.global.page = await browser.newPage();
  }

  async teardown() {
    await this.global.browser?.close();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;

declare global {
  var baseUrl: string;
  var page: Page;
  var browser: Browser;
}
