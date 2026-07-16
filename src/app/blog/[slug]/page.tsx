import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — GS Transport`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
    <Navbar />
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] bg-[#091424]">
        <Image
          src={post.hero}
          alt={post.title}
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091424]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 max-w-3xl mx-auto px-6 pb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-semibold text-[#1FA3BA] tracking-wide uppercase">
              {post.category}
            </span>
            <span className="text-white/30">·</span>
            <span className="flex items-center gap-1 text-xs text-white/50">
              <Clock size={11} /> {post.readTime}
            </span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/50">{post.date}</span>
          </div>
          <h1 className="font-heading text-white text-3xl md:text-5xl font-light leading-tight">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-[#091424]/40 hover:text-[#1FA3BA] transition-colors mb-10"
        >
          <ArrowLeft size={14} /> Retour au blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-medium text-[#091424]/40 bg-[#E8E6DB] px-2 py-1 rounded-full"
              >
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>
        )}

        {/* MDX */}
        <article className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:font-light prose-headings:text-[#091424] prose-p:text-[#091424]/70 prose-p:leading-relaxed prose-a:text-[#1FA3BA] prose-strong:text-[#091424]">
          <MDXRemote source={post.content} />
        </article>

        {/* CTA */}
        <div className="mt-16 bg-[#091424] rounded-3xl p-10 text-center">
          <p className="text-[#1FA3BA] text-sm font-medium tracking-[0.3em] uppercase mb-3">
            GS Transport
          </p>
          <h2 className="font-heading text-white text-3xl font-light mb-4">
            Prêt à réserver votre course ?
          </h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto">
            VTC premium disponible 24h/24 de Sainte-Marie à Saint-Leu.
            Réservation en ligne, confirmation immédiate.
          </p>
          <Link
            href="/#reservation"
            className="inline-flex items-center gap-2 bg-[#1FA3BA] text-white font-medium pl-6 pr-4 py-3.5 rounded-full hover:bg-[#1FA3BA]/90 transition-all group"
          >
            Réserver maintenant
            <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <ArrowRight size={14} />
            </span>
          </Link>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}
