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
    this.global.databasePorts = {
      trends: 27017,
      forum: 5432,
      chat: 27018,
      reports: 27019,
      resources: 27020,
      auth: 27021,
    };
  }

  async teardown() {
    await this.global.browser?.close();
    await super.teardown();
  }
}

module.exports = PuppeteerEnvironment;

type MicroserviceDatabases =
  | "trends"
  | "forum"
  | "chat"
  | "reports"
  | "resources"
  | "auth";

declare global {
  var baseUrl: string;
  var page: Page;
  var browser: Browser;
  var databasePorts: {
    [K in MicroserviceDatabases]: number;
  };
}
