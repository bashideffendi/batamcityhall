import type { MetadataRoute } from "next";
import { SITE_PRATINJAU, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (SITE_PRATINJAU) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
