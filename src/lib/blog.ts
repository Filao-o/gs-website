import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR  = path.join(process.cwd(), "src/content/blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");

// Image de fallback par catégorie
const CATEGORY_HERO: Record<string, string> = {
  "Pratique":    "/Blog/categories/aeroport.jpg",
  "Conseils":    "/Blog/categories/suv-premium.jpg",
  "Pro":         "/Blog/categories/pro-bureau.jpg",
  "Événements":  "/Blog/categories/soiree.jpg",
  "Zones":       "/Blog/categories/route-reunion.jpg",
};

// Surcharges par slug pour les articles qui méritent une image spécifique
const SLUG_HERO_OVERRIDE: Record<string, string> = {
  "vtc-mariage-reunion":                   "/Blog/categories/mariage.jpg",
  "vtc-nuit-transport-securite-reunion":   "/Blog/categories/nuit.jpg",
  "vtc-noel-reveillon-reunion":            "/Blog/categories/soiree.jpg",
  "vtc-anniversaire-fete-reunion":         "/Blog/categories/soiree.jpg",
  "vtc-concert-spectacle-reunion":         "/Blog/categories/soiree.jpg",
  "vtc-cilaos-cirque-reunion":             "/Blog/categories/cirque-altitude.jpg",
  "vtc-bambous-tampon-reunion":            "/Blog/categories/cirque-altitude.jpg",
  "vtc-saint-joseph-sud-sauvage-reunion":  "/Blog/categories/cirque-altitude.jpg",
  "vtc-saint-gilles-les-bains":            "/Blog/categories/plage-ouest.jpg",
  "vtc-saint-leu-tamarin-flic-en-flac":   "/Blog/categories/plage-ouest.jpg",
  "vtc-saint-pierre-saint-leu-ouest":      "/Blog/categories/plage-ouest.jpg",
  "transport-famille-enfants-reunion":     "/Blog/categories/famille.jpg",
  "vtc-touriste-reunion":                  "/Blog/categories/famille.jpg",
  "vtc-expatrie-reunion":                  "/Blog/categories/famille.jpg",
  "transfert-aeroport-roland-garros":      "/Blog/categories/aeroport.jpg",
  "vtc-aeroport-vol-retard-reunion":       "/Blog/categories/aeroport.jpg",
  "navette-hotel-aeroport-reunion":        "/Blog/categories/aeroport.jpg",
  "arriver-reunion-premier-conseil-transport": "/Blog/categories/aeroport.jpg",
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
