import { MetadataRoute } from "next";
import { ALL_STATES } from "@/lib/places-data";
import { blogPosts } from "@/data/blog-data";

const SITE_URL = "https://rrmholidays.com";

/* Vehicle data — IDs used as slugs in /vehicles/[id] route */
const VEHICLE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/* Static pages on the site */
const STATIC_PAGES = [
  "",
  "/destinations",
  "/vehicles",
  "/trip-planner",
  "/blog",
  "/reviews",
  "/smart-deals",
  "/route-planner",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  /* Static pages */
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  /* Blog post pages */
  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  /* State pages + their place pages */
  const destinationEntries: MetadataRoute.Sitemap = [];

  for (const state of ALL_STATES) {
    /* State listing page */
    destinationEntries.push({
      url: `${SITE_URL}/destinations/${state.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    /* Individual place pages */
    for (const place of state.places) {
      destinationEntries.push({
        url: `${SITE_URL}/destinations/${state.slug}/${place.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  /* Vehicle detail pages */
  const vehicleEntries: MetadataRoute.Sitemap = VEHICLE_IDS.map((id) => ({
    url: `${SITE_URL}/vehicles/${id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries, ...destinationEntries, ...vehicleEntries];
}
