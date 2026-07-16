import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Blog — GS Transport | Conseils VTC à La Réunion",
  description:
    "Conseils, infos pratiques et guides sur le transport VTC à La Réunion. Transferts aéroport, déplacements pro, soirées — tout ce qu'il faut savoir.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#091424] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#1FA3BA] text-sm font-medium tracking-[0.3em] uppercase mb-4">
            Blog & Conseils
          </p>
          <h1 className="font-heading text-white text-4xl md:text-6xl font-light mb-4">
            Voyager mieux à La Réunion
          </h1>
          <p className="text-white/50 max-w-xl">
            Guides pratiques, conseils transport et infos utiles pour vos
            déplacements sur l'île.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {posts.length === 0 ? (
          <p className="text-[#091424]/40 text-center py-20">
            Articles à venir…
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="group flex flex-col">
                {/* Hero image */}
                <Link href={`/blog/${post.slug}`}>
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[#E8E6DB] mb-5 relative">
                    <Image
                      src={post.hero}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-[#1FA3BA] tracking-wide uppercase">
                    {post.category}
                  </span>
                  <span className="text-[#091424]/20">·</span>
                  <span className="flex items-center gap-1 text-xs text-[#091424]/40">
                    <Clock size={11} /> {post.readTime}
                  </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-heading text-[#091424] text-xl font-medium leading-snug mb-3 group-hover:text-[#1FA3BA] transition-colors">
                    {post.title}
                  </h2>
                </Link>

                <p className="text-[#091424]/60 text-sm leading-relaxed mb-4 flex-1">
                  {post.description}
                </p>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-[10px] font-medium text-[#091424]/40 bg-[#E8E6DB] px-2 py-1 rounded-full"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/blog/${post.slug}`}
                  className="flex items-center gap-2 text-sm font-medium text-[#1FA3BA] hover:gap-3 transition-all"
                >
                  Lire l'article <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
    <Footer />
    </>
  );
}
