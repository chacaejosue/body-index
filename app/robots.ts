import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/logo.svg", "/og-image.png", "/favicon*.png", "/icon*.png"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
