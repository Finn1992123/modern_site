import type { MetadataRoute } from "next";
import { onlineLanguages } from "./online/languages";

const siteUrl = "https://www.modernlanguage.gr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    ...onlineLanguages.map(({ slug }) => ({
      url: `${siteUrl}/online/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    { url: `${siteUrl}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/account-deletion`, changeFrequency: "yearly", priority: 0.1 },
  ];
}
