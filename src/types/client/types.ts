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

export type UrlVsFlaggedRouteResType = {
  period: string;
  urls: number;
  flaggedUrls: number;
}[];

export type UsersByProviderResType = {
  providerType: string;
  users: number;
}[];

export type UserGrowthResType = {
  period: string;
  users: number;
}[];

export type ClicksInfoChartResType = {
  period: string;
  clicks: number;
  flaggedClicks: number;
}[];
