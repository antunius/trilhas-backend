"use client";

import { usePathname } from "next/navigation";
import { MainNav } from "@/components/MainNav";
import { CourseOutline } from "@/components/CourseOutline";
import type { ArticleMeta, Category } from "@/types/content";
import categoriesJson from "@/content/categories.json";
import articlesIndex from "@/content/articles/index.json";

const CATEGORIES = categoriesJson as Category[];
const ARTICLES = articlesIndex as ArticleMeta[];

function parseCategoryRoute(pathname: string): {
  categorySlug: string;
  articleSlug?: string;
} | null {
  const m = pathname.match(/^\/category\/([^/]+)(?:\/([^/]+))?/);
  if (!m) return null;
  const categorySlug = m[1];
  const rest = m[2];
  if (rest === "quiz") return { categorySlug };
  return { categorySlug, articleSlug: rest };
}

/** Main site nav, or course outline when inside /category/... */
export function CourseSidebarNav({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  const pathname = usePathname() || "";
  const route = parseCategoryRoute(pathname);

  if (!route) {
    return <MainNav onNavigate={onNavigate} className={className} />;
  }

  const category = CATEGORIES.find((c) => c.slug === route.categorySlug);
  if (!category || category.stub) {
    return <MainNav onNavigate={onNavigate} className={className} />;
  }

  const articles = ARTICLES.filter(
    (a) => a.categorySlug === route.categorySlug,
  );

  return (
    <div className={`flex flex-col h-full overflow-y-auto px-4 py-5 ${className || ""}`}>
      <CourseOutline
        category={category}
        articles={articles}
        activeSlug={route.articleSlug}
        showQuiz={!!category.hasQuiz}
        onNavigate={onNavigate}
      />
    </div>
  );
}
