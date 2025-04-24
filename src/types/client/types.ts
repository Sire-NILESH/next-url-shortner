import { FlagCategoryTypeEnum, ThreatTypeEnum } from "../server/types";

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

export type UserUrl = {
  id: number;
  originalUrl: string;
  shortCode: string;
  name: string | null;
  threat: ThreatTypeEnum;
  flagged: boolean;
  flagCategory: FlagCategoryTypeEnum;
  createdAt: Date;
  clicks: number;
  disabled: boolean;
};
