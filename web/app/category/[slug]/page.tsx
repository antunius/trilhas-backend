import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryView } from "@/components/CategoryView";
import {
  getCategory,
  getCategories,
  listArticles,
} from "@/lib/articles";
import { quizCountForCategory } from "@/lib/category-quiz";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return pageMetadata({
    title: cat.name,
    description: cat.description,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const articles = listArticles(slug);
  const quizCount = quizCountForCategory(slug);
  return (
    <CategoryView
      category={category}
      articles={articles}
      quizCount={quizCount}
    />
  );
}
