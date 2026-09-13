"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal,
  Layers,
  Cpu,
  Database,
  GitBranch,
  Layout,
  Server,
  Workflow,
  ChevronRight,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { Category } from "../types";
import { ArchitectureLogo, KafkaLogo } from "@/components/TrackLogo";

export type { Category };

export interface SidebarProps {
  categories?: Category[];
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "kafka", title: "Apache Kafka", icon: "Kafka", href: "/kafka" },
  { id: "arquitetura", title: "Arquitetura & Design", icon: "Architecture", href: "/arquitetura" },
  { id: "algoritmos", title: "Algoritmos & ED", icon: "Cpu" },
  { id: "java", title: "Java Core", icon: "Server" },
  { id: "spring", title: "Spring Ecosystem", icon: "Layers" },
  { id: "kubernetes", title: "Kubernetes & Cloud", icon: "Workflow" },
  { id: "clean-code", title: "Clean Code & SOLID", icon: "GitBranch" },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Terminal: <Terminal className="w-5 h-5" />,
  Kafka: <KafkaLogo className="w-5 h-5" />,
  Architecture: <ArchitectureLogo className="w-5 h-5" />,
  Layers: <Layers className="w-5 h-5" />,
  Cpu: <Cpu className="w-5 h-5" />,
  Database: <Database className="w-5 h-5" />,
  GitBranch: <GitBranch className="w-5 h-5" />,
  Layout: <Layout className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Workflow: <Workflow className="w-5 h-5" />,
};

export const Sidebar: React.FC<SidebarProps> = ({ categories = DEFAULT_CATEGORIES }) => {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-[#121113] border-r border-[#262626] z-50 transition-all duration-300 ease-in-out flex flex-col ${
        isHovered ? "w-[280px]" : "w-[80px]"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-[#262626] overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Terminal className="w-5 h-5 text-primary" />
          </div>
          <div
            className={`transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-semibold text-white tracking-wide block text-sm">
              codetoscale
            </span>
            <span className="text-[10px] text-[#A1A1AA] uppercase tracking-wider block">
              Interactive Guide
            </span>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-3 space-y-1 custom-scrollbar">
        {categories.map((category) => {
          const targetUrl = category.href || `/category/${category.id}`;
          const isActive =
            pathname === targetUrl ||
            pathname.startsWith(`${targetUrl}/`) ||
            pathname.startsWith(`/category/${category.id}`);
          const icon = ICON_MAP[category.icon] || <Layers className="w-5 h-5" />;

          return (
            <Link
              key={category.id}
              href={targetUrl}
              className={`flex items-center h-12 px-3 rounded-lg transition-colors group relative overflow-hidden whitespace-nowrap ${
                isActive
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="w-6 flex justify-center shrink-0">
                {React.isValidElement(icon)
                  ? React.cloneElement(
                      icon as React.ReactElement<{ className?: string }>,
                      {
                        className: `w-5 h-5 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-[#A1A1AA] group-hover:text-white"
                        }`,
                      }
                    )
                  : icon}
              </div>

              <div
                className={`ml-4 flex items-center justify-between flex-1 transition-opacity duration-200 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
              >
                <span className="text-sm font-medium tracking-wide">
                  {category.title}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-[#71717A] transition-transform duration-200 ${
                    isActive
                      ? "transform rotate-90 text-white"
                      : "group-hover:translate-x-0.5"
                  }`}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer / Meta */}
      <div className="p-4 border-t border-[#262626] overflow-hidden whitespace-nowrap">
        <a
          href="https://codetoscale.dev"
          target="_blank"
          rel="noreferrer"
          className="flex items-center h-10 px-2 rounded-lg text-[#71717A] hover:text-[#A1A1AA] hover:bg-white/5 transition-colors"
        >
          <div className="w-6 flex justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <span
            className={`ml-4 text-xs font-medium transition-opacity duration-200 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            Documentation
          </span>
          {isHovered && <ExternalLink className="w-3 h-3 ml-auto" />}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
