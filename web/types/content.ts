export type CategoryIcon =
  | "Code2"
  | "Boxes"
  | "Network"
  | "Database"
  | "GitBranch"
  | "GitMerge"
  | "Layers"
  | "Cpu"
  | "Server"
  | "Workflow"
  | "Brain"
  | "MessageSquare"
  | "BookOpen"
  | "Newspaper"
  | "Sparkles";

export type NavGroup = "learn-primary" | "learn-secondary" | "practice";

export type CourseSection = {
  id: string;
  name: string;
  order: number;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: CategoryIcon;
  order: number;
  navGroup: NavGroup;
  badge?: string;
  stub?: boolean;
  hasQuiz?: boolean;
  sections?: CourseSection[];
};

export type ArticleLevel = "iniciante" | "intermediario" | "avancado";

export type ArticleMeta = {
  slug: string;
  categorySlug: string;
  title: string;
  /** Short label for course sidebar (Hello Interview–style). */
  navTitle?: string;
  summary: string;
  level: ArticleLevel;
  order: number;
  section?: string;
  /** Sub-heading inside a section (small caps label in the sidebar). */
  group?: string;
  legacyPath?: string;
  /** Relative path under content/articles */
  file: string;
};

export type ArticleDoc = ArticleMeta & {
  body: string;
};
