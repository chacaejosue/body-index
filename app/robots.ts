import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bodyindex.app";

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
