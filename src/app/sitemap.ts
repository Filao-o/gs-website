import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://gstransport.re";
  return [
    { url: base,                              lastModified: new Date(), changeFrequency: "weekly",  priority: 1 },
    { url: `${base}/#reservation`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/blog`,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${base}/mentions-legales`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/cgu`,                     lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${base}/confidentialite`,         lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
