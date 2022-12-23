export interface Viewport {
  label: string;
  width: number;
  height: number;
}

export interface Scenario {
  label: string;
  url: string;
}

export interface ConfigPaths {
  bitmaps_reference: string;
  bitmaps_test: string;
  engine_scripts: string;
  html_report: string;
  json_report: string;
  ci_report: string;
}

export interface CIConfig {
  format: 'junit';
  testReportFileName: string;
  testSuiteName: string;
}

export interface BackstopJSConfig {
  id: string;
  viewports: Viewport[];
  scenarios: Scenario[];
  onBeforeScript?: string;
  onReadyScript?: string;
  paths?: ConfigPaths;
  engine?: 'puppeteer' | 'playwright';
  engineOptions?: any;
  report?: ('browser' | 'CI' | 'json')[];
  ci?: CIConfig;
  debug?: boolean;
  asyncCaptureLimit?: number;
  asyncCompareLimit?: number;
  debugWindow?: boolean;
  scenarioLogsInReports?: boolean;
  misMatchThreshold?: number;
}
