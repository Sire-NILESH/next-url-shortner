import { AlertTriangle, Link, MousePointerClick, Users } from "lucide-react";
import SectionCard, { SectionCardData } from "./section-card";
import TotalFlaggedUrlStatStreamed from "./total-flagged-urls-stat-streamed";
import TotalUrlClicksStatStreamed from "./total-url-clicks-stat-streamed";
import TotalUrlStatStreamed from "./total-url-stat-streamed";
import TotalUsersStatStreamed from "./total-users-stat-streamed";

const cardData: SectionCardData[] = [
  {
    title: "Total URLs",
    icon: Link,
    iconPosition: "left",
    valueElement: <TotalUrlStatStreamed timeRange="3M" />,
    badgeText: "Past 3M",
    footer: {
      mainText: "Target is 2,000+ URLs",
      subText: "Total URLs generated in past 3 months",
    },
  },

  {
    title: "Flagged URLs",
    icon: AlertTriangle,
    iconPosition: "left",
    valueElement: <TotalFlaggedUrlStatStreamed timeRange="3M" />,
    badgeText: "Past 3M",
    footer: {
      mainText: "Should be below 500",
      subText: "URLs flagged by the system in past 3 months",
    },
  },

  {
    title: "Total Users",
    icon: Users,
    iconPosition: "left",
    valueElement: <TotalUsersStatStreamed timeRange="3M" />,
    badgeText: "Past 3M",
    footer: {
      mainText: "Target is 500+ new users",
      subText: "Total users joined in past 3 months",
    },
  },

  {
    title: "Total Clicks",
    icon: MousePointerClick,
    iconPosition: "left",
    valueElement: <TotalUrlClicksStatStreamed />,
    badgeText: "All Time",
    footer: {
      mainText: "Keep steady performance",
      subText: "Total clicks recorded till this date",
    },
  },
];

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 bg-card">
      {cardData.map((data, index) => (
        <SectionCard key={index} data={data} data-slot="card" />
      ))}
    </div>
  );
}
