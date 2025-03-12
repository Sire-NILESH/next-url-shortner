import {
  ChartSpline,
  ClockArrowUp,
  Drama,
  Link,
  QrCode,
  Rocket,
  Settings2,
  ShieldCheck,
} from "lucide-react";

export const featuresData = [
  {
    title: "Blazing Fast Experience",
    description:
      "Shorten long URLs instantly. No delays, just quick and efficient link generation.",
    icon: <Rocket />,
  },
  {
    title: "Advanced Link Analytics",
    description:
      "Track clicks, referrers, geolocation, and device types to gain insights into your audience and optimize engagement.",
    icon: <ChartSpline />,
  },
  {
    title: "Customizable Short Links",
    description:
      "Create branded short links with custom aliases to enhance your brand identity and increase link trust.",
    icon: <Settings2 />,
  },
  {
    title: "Link Safety Checks",
    description:
      "Our system scans and verifies links for security threats, protecting users from harmful or malicious URLs.",
    icon: <ShieldCheck />,
  },
  {
    title: "Free Link Shortening",
    description:
      "Enjoy unlimited free link shortening with no hidden fees. Sign up to unlock additional features like analytics and customization.",
    icon: <Link />,
  },
  {
    title: "QR Code Generation",
    description:
      "Generate QR codes for every short link, making it easy to share URLs offline and across different platforms.",
    icon: <QrCode />,
  },
  {
    title: "99.99% Uptime",
    description:
      "Our infrastructure ensures your links are always accessible, with near-perfect uptime and high reliability.",
    icon: <ClockArrowUp />,
  },
  {
    title: "Privacy-Focused & Secure",
    description:
      "We prioritize user privacy, no tracking of personal data, and all analytics remain anonymized.",
    icon: <Drama />,
  },
];
