import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dawntax.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: Array<{
    path: string;
    changeFrequency: "daily" | "weekly" | "monthly" | "yearly";
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1.0 },
    { path: "/income-tax", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/updates", changeFrequency: "weekly", priority: 0.6 },
    { path: "/calculator/income-tax", changeFrequency: "weekly", priority: 0.9 },
    { path: "/calculator/inherit-gift", changeFrequency: "monthly", priority: 0.8 },
    { path: "/calculator/vat", changeFrequency: "monthly", priority: 0.8 },
    { path: "/calculator/acquisition-tax", changeFrequency: "monthly", priority: 0.8 },
    { path: "/calculator/vehicle", changeFrequency: "monthly", priority: 0.8 },
    { path: "/calculator/insurance", changeFrequency: "monthly", priority: 0.8 },
  ];

  return pages.map((p) => ({
    url: `${BASE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
