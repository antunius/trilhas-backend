/** Browser-safe path helpers (no Node fs). */

export function articleHref(a: { categorySlug: string; slug: string }) {
  return `/category/${a.categorySlug}/${a.slug}`;
}

export function categoryHref(slug: string) {
  return `/category/${slug}`;
}
