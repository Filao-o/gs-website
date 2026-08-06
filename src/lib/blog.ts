import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR  = path.join(process.cwd(), "src/content/blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

const CAT = "/Blog/categories";

// Image de fallback par catégorie
const CATEGORY_HERO: Record<string, string> = {
  "Pratique":   `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
  "Conseils":   `${CAT}/coucher-soleil-ile-de-la-reunion.jpg`,
  "Pro":        `${CAT}/route-ile-de-la-reunion.jpg`,
  "Événements": `${CAT}/restaurant-ile-de-la-reunion.jpg`,
  "Zones":      `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
};

// Surcharges par slug
const SLUG_HERO_OVERRIDE: Record<string, string> = {
  // Aéroport / arrivée
  "transfert-aeroport-roland-garros":          `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
  "vtc-aeroport-vol-retard-reunion":           `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
  "navette-hotel-aeroport-reunion":            `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
  "arriver-reunion-premier-conseil-transport": `${CAT}/route-littoral-ile-de-la-reunion.jpg`,
  // Nuit / soirée / événements
  "vtc-nuit-transport-securite-reunion":       `${CAT}/coucher-soleil-ile-de-la-reunion.jpg`,
  "vtc-soiree-evenement-reunion":              `${CAT}/restaurant-ile-de-la-reunion.jpg`,
  "vtc-anniversaire-fete-reunion":             `${CAT}/restaurant-ile-de-la-reunion.jpg`,
  "vtc-concert-spectacle-reunion":             `${CAT}/restaurant-ile-de-la-reunion.jpg`,
  "vtc-noel-reveillon-reunion":                `${CAT}/coucher-soleil-ile-de-la-reunion.jpg`,
  "vtc-mariage-reunion":                       `${CAT}/coucher-soleil-ile-de-la-reunion.jpg`,
  // Hauts / altitude / volcan
  "vtc-cilaos-cirque-reunion":                 `${CAT}/montagne-ile-de-la-reunion.jpg`,
  "vtc-bambous-tampon-reunion":                `${CAT}/montagne-ile-de-la-reunion.jpg`,
  "vtc-saint-joseph-sud-sauvage-reunion":      `${CAT}/volcan-ile-de-la-reunion.jpg`,
  "vtc-securite-route-reunion":                `${CAT}/route-volcan-ile-de-la-reunion.jpg`,
  // Côte / plage / lagon
  "vtc-saint-gilles-les-bains":               `${CAT}/recif-corail-ile-de-la-reunion.jpg`,
  "vtc-saint-leu-tamarin-flic-en-flac":        `${CAT}/recif-corail-ile-de-la-reunion.jpg`,
  "vtc-saint-pierre-saint-leu-ouest":          `${CAT}/recif-corail-ile-de-la-reunion.jpg`,
  // Tourisme / nature
  "vtc-touriste-reunion":                      `${CAT}/cascade-touritique-ile-de-la-reunion.jpg`,
  "vtc-expatrie-reunion":                      `${CAT}/cascade-sud-ile-de-la-reunion.jpg`,
  "transport-famille-enfants-reunion":         `${CAT}/cascade-touritique-ile-de-la-reunion.jpg`,
  "transport-sport-marathon-triathlon-reunion":`${CAT}/montagne-ile-de-la-reunion.jpg`,
};

function resolveHero(slug: string, category: string, mdxHero?: string): string {
  // 1. Image spécifique par slug (si le fichier existe dans public/)
  if (mdxHero) {
    const filePath = path.join(PUBLIC_DIR, mdxHero);
    if (fs.existsSync(filePath)) return mdxHero;
  }
  // 2. Surcharge par slug
  if (SLUG_HERO_OVERRIDE[slug]) return SLUG_HERO_OVERRIDE[slug];
  // 3. Fallback catégorie
  return CATEGORY_HERO[category] ?? "/Blog/categories/route-reunion.jpg";
}

export type Post = {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  hero: string;
  readTime: string;
  content: string;
};

export function getAllPosts(): Omit<Post, "content">[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(".mdx", "");
      const raw  = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug,
        title:       data.title,
        description: data.description,
        date:        data.date,
        category:    data.category,
        tags:        data.tags ?? [],
        hero:        resolveHero(slug, data.category, data.hero),
        readTime:    data.readTime ?? "5 min",
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title:       data.title,
    description: data.description,
    date:        data.date,
    category:    data.category,
    tags:        data.tags ?? [],
    hero:        resolveHero(slug, data.category, data.hero),
    readTime:    data.readTime ?? "5 min",
    content,
  };
}
