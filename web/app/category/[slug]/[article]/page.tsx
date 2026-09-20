import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleView } from "@/components/ArticleView";
import {
  getArticle,
  getCategory,
  listArticles,
  articleNeighbors,
} from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string; article: string }> };

export async function generateStaticParams() {
  return listArticles().map((a) => ({
    slug: a.categorySlug,
    article: a.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, article: articleSlug } = await params;
  const article = getArticle(slug, articleSlug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/category/${slug}/${articleSlug}`,
    ogType: "article",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug, article: articleSlug } = await params;
  const category = getCategory(slug);
  const article = getArticle(slug, articleSlug);
  if (!category || !article) notFound();
  const { prev, next } = articleNeighbors(slug, articleSlug);
  const siblings = listArticles(slug);
  return (
    <ArticleView
      category={category}
      article={article}
      siblings={siblings}
      prev={prev}
      next={next}
    />
  );
}
