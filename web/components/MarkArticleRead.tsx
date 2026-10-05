"use client";

import { useEffect } from "react";
import { markArticleRead } from "@/lib/progress";

export function MarkArticleRead({
  path,
  categorySlug,
  articleSlug,
}: {
  path: string;
  categorySlug: string;
  articleSlug: string;
}) {
  useEffect(() => {
    markArticleRead(path, categorySlug, articleSlug);
  }, [path, categorySlug, articleSlug]);
  return null;
}
