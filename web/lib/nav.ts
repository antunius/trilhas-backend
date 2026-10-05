import categoriesJson from "@/content/categories.json";
import type { Category } from "@/types/content";

const CATEGORIES = categoriesJson as Category[];

export type NavLink = {
  label: string;
  href: string;
  badge?: string;
  dividerBefore?: boolean;
};

export type NavSection = {
  id: "learn" | "practice" | "community";
  label: string;
  href: string;
  links: NavLink[];
};

export function getLearnCategories(): Category[] {
  return CATEGORIES.filter(
    (c) => c.navGroup === "learn-primary" || c.navGroup === "learn-secondary",
  ).sort((a, b) => a.order - b.order);
}

export function getPrimaryLearnCategories(): Category[] {
  return CATEGORIES.filter((c) => c.navGroup === "learn-primary").sort(
    (a, b) => a.order - b.order,
  );
}

export function getQuizCategories(): Category[] {
  return CATEGORIES.filter((c) => c.hasQuiz && !c.stub).sort(
    (a, b) => a.order - b.order,
  );
}

export function getNavSections(): NavSection[] {
  const primary = CATEGORIES.filter((c) => c.navGroup === "learn-primary").sort(
    (a, b) => a.order - b.order,
  );
  const secondary = CATEGORIES.filter(
    (c) => c.navGroup === "learn-secondary",
  ).sort((a, b) => a.order - b.order);

  const learnLinks: NavLink[] = [
    ...primary.map((c) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      badge: c.badge,
    })),
    ...secondary.map((c, i) => ({
      label: c.name,
      href: `/category/${c.slug}`,
      badge: c.badge,
      dividerBefore: i === 0,
    })),
  ];

  const practiceLinks: NavLink[] = [
    ...getQuizCategories().map((c) => ({
      label: `Avaliação · ${c.name}`,
      href: `/category/${c.slug}/quiz`,
    })),
    { label: "Meu progresso", href: "/progress" },
  ];

  const communityLinks: NavLink[] = [
    { label: "Perguntas e discussão", href: "/community" },
    { label: "Discord (em breve)", href: "/community#discord" },
  ];

  return [
    { id: "learn", label: "Aprender", href: "/learn", links: learnLinks },
    {
      id: "practice",
      label: "Praticar",
      href: "/practice",
      links: practiceLinks,
    },
    {
      id: "community",
      label: "Comunidade",
      href: "/community",
      links: communityLinks,
    },
  ];
}
