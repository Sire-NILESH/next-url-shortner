export type Url = {
  id: number;
  originalUrl: string;
  shortCode: string;
  name: string | null;
  createdAt: Date;
  clicks: number;
};

export type UrlClicksBarChartDataType = {
  url: string;
  clicks: number;
  originalUrl: string;
};

export type UrlClicksPieChartDataType = {
  url: string;
  clicks: number;
  fill: string;
};
