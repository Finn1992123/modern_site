import type { MetadataRoute } from "next";

const siteUrl = "https://www.modernlanguage.gr";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/online/checkout",
        "/online/dashboard",
        "/online/login",
        "/online/my-courses",
        "/online/register",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
