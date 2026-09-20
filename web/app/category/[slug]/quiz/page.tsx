import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryQuiz } from "@/components/CategoryQuiz";
import { getCategory } from "@/lib/articles";
import { questionsForCategory } from "@/lib/category-quiz";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return pageMetadata({
    title: `Avaliação · ${cat.name}`,
    description: `Perguntas de validação para ${cat.name}.`,
    path: `/category/${slug}/quiz`,
  });
}

export default async function CategoryQuizPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category || category.stub || !category.hasQuiz) notFound();
  const questions = questionsForCategory(slug, 5);
  if (questions.length === 0) notFound();
  return (
    <CategoryQuiz
      categorySlug={slug}
      categoryName={category.name}
      questions={questions}
    />
  );
}
