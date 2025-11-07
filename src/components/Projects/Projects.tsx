"use client";

import { motion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import { BiGitRepoForked } from "react-icons/bi";
import { FaExternalLinkAlt, FaGithub, FaSearch, FaStar } from "react-icons/fa";
import { GoRepo } from "react-icons/go";
import { HiLanguage } from "react-icons/hi2";
import { MdSort, MdUpdate } from "react-icons/md";
import {
  SiCss3,
  SiDocker,
  SiGo,
  SiHtml5,
  SiJavascript,
  SiPython,
  SiRust,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { type GitHubRepo, githubAPI } from "@/lib/github";

const ProjectsComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"stars" | "updated" | "forks">("stars");
  const [searchQuery, setSearchQuery] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "100px" },
    );

    const section = sectionRef.current;
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const data = await githubAPI.getUserRepos(undefined, {
          sort: "updated",
          per_page: 100,
        });

        const filtered = data.filter(
          (repo) =>
            repo.name !== "sw3do" &&
            repo.name !== "sw3do.is-a.dev" &&
            !repo.fork &&
            repo.stargazers_count > 0,
        );

        setRepos(filtered);
        setFilteredRepos(filtered);
      } catch (error) {
        console.error("Error fetching repos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  useEffect(() => {
    let result = [...repos];

    if (selectedLanguage !== "all") {
      result = result.filter((repo) => repo.language === selectedLanguage);
    }

    if (searchQuery) {
      result = result.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          repo.topics.some((topic) =>
            topic.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        default:
          return 0;
      }
    });

    setFilteredRepos(result);
  }, [repos, selectedLanguage, sortBy, searchQuery]);

  const languages = Array.from(
    new Set(repos.map((repo) => repo.language).filter(Boolean)),
  );

  const getLanguageColor = (language: string | null) => {
    const colors: Record<
      string,
      { bg: string; text: string; border: string; icon: React.ReactNode }
    > = {
      TypeScript: {
        bg: "bg-blue-500/10",
        text: "text-blue-400",
        border: "border-blue-500/20",
        icon: <SiTypescript className="w-3.5 h-3.5" />,
      },
      JavaScript: {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        border: "border-yellow-500/20",
        icon: <SiJavascript className="w-3.5 h-3.5" />,
      },
      Python: {
        bg: "bg-green-500/10",
        text: "text-green-400",
        border: "border-green-500/20",
        icon: <SiPython className="w-3.5 h-3.5" />,
      },
      Java: {
        bg: "bg-orange-500/10",
        text: "text-orange-400",
        border: "border-orange-500/20",
        icon: <GoRepo className="w-3.5 h-3.5" />,
      },
      Go: {
        bg: "bg-cyan-500/10",
        text: "text-cyan-400",
        border: "border-cyan-500/20",
        icon: <SiGo className="w-3.5 h-3.5" />,
      },
      Rust: {
        bg: "bg-orange-600/10",
        text: "text-orange-600",
        border: "border-orange-600/20",
        icon: <SiRust className="w-3.5 h-3.5" />,
      },
      HTML: {
        bg: "bg-red-500/10",
        text: "text-red-400",
        border: "border-red-500/20",
        icon: <SiHtml5 className="w-3.5 h-3.5" />,
      },
      CSS: {
        bg: "bg-purple-500/10",
        text: "text-purple-400",
        border: "border-purple-500/20",
        icon: <SiCss3 className="w-3.5 h-3.5" />,
      },
      Vue: {
        bg: "bg-green-400/10",
        text: "text-green-400",
        border: "border-green-400/20",
        icon: <SiVuedotjs className="w-3.5 h-3.5" />,
      },
      Shell: {
        bg: "bg-gray-500/10",
        text: "text-gray-400",
        border: "border-gray-500/20",
        icon: <MdSort className="w-3.5 h-3.5" />,
      },
      Dockerfile: {
        bg: "bg-blue-600/10",
        text: "text-blue-600",
        border: "border-blue-600/20",
        icon: <SiDocker className="w-3.5 h-3.5" />,
      },
    };
    return (
      colors[language || ""] || {
        bg: "bg-gray-500/10",
        text: "text-gray-400",
        border: "border-gray-500/20",
        icon: <HiLanguage className="w-3.5 h-3.5" />,
      }
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) return `${diffDays}d ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  };

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4"
          >
            <FaGithub className="w-4 h-4" />
            Portfolio
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 px-4">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Showcasing{" "}
            <span className="text-cyan-400 font-semibold">
              {filteredRepos.length}
            </span>{" "}
            projects from my GitHub repositories
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6 sm:mb-8 space-y-3 sm:space-y-4"
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              <input
                type="text"
                placeholder="Search projects, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm sm:text-base"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <button
                type="button"
                onClick={() => setSortBy("stars")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  sortBy === "stars"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <FaStar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Stars</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("updated")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  sortBy === "updated"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <MdUpdate className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Updated</span>
              </button>
              <button
                type="button"
                onClick={() => setSortBy("forks")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  sortBy === "forks"
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                <BiGitRepoForked className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Forks</span>
              </button>
            </div>
          </div>

          {languages.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <HiLanguage className="w-4 h-4 text-gray-500 hidden sm:block" />
              <button
                type="button"
                onClick={() => setSelectedLanguage("all")}
                className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                  selectedLanguage === "all"
                    ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                }`}
              >
                All
              </button>
              {languages.slice(0, 7).map((lang) => {
                const langColors = getLanguageColor(lang);
                return (
                  <button
                    type="button"
                    key={lang}
                    onClick={() => setSelectedLanguage(lang || "all")}
                    className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                      selectedLanguage === lang
                        ? `${langColors.bg} ${langColors.text} border ${langColors.border} shadow-lg`
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <span className={langColors.text}>{langColors.icon}</span>
                    <span className="hidden sm:inline">{lang}</span>
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <div
                key={`skeleton-loader-${i}-${Math.random().toString(36).substr(2, 9)}`}
                className="bg-white/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse"
              >
                <div className="h-5 sm:h-6 bg-white/10 rounded mb-3 sm:mb-4 w-3/4" />
                <div className="h-3 sm:h-4 bg-white/10 rounded mb-2 w-full" />
                <div className="h-3 sm:h-4 bg-white/10 rounded mb-3 sm:mb-4 w-2/3" />
                <div className="flex gap-2 mb-3 sm:mb-4">
                  <div className="h-5 sm:h-6 bg-white/10 rounded w-14 sm:w-16" />
                  <div className="h-5 sm:h-6 bg-white/10 rounded w-14 sm:w-16" />
                </div>
                <div className="h-9 sm:h-10 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filteredRepos.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              No projects found
            </h3>
            <p className="text-sm sm:text-base text-gray-400">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredRepos.slice(0, 12).map((repo, index) => {
              const langColors = getLanguageColor(repo.language);

              return (
                <motion.div
                  key={repo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="group relative"
                >
                  <div className="relative bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] h-full flex flex-col">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-linear-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center border border-cyan-500/30 shrink-0">
                          <GoRepo className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-white truncate group-hover:text-cyan-400 transition-colors duration-300">
                            {repo.name}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                            <MdUpdate className="w-3 h-3" />
                            {formatDate(repo.updated_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 line-clamp-2 grow">
                      {repo.description || "No description available"}
                    </p>

                    <div className="space-y-3 sm:space-y-4">
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <span
                              key={topic}
                              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium bg-white/5 text-gray-400 border border-white/10 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors duration-300"
                            >
                              {topic}
                            </span>
                          ))}
                          {repo.topics.length > 3 && (
                            <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium bg-white/5 text-gray-400 border border-white/10">
                              +{repo.topics.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 sm:gap-4">
                          {repo.language && (
                            <div className="flex items-center gap-1 sm:gap-1.5">
                              <span className={langColors.text}>
                                {langColors.icon}
                              </span>
                              <span
                                className={`text-[10px] sm:text-xs font-medium ${langColors.text} hidden sm:inline`}
                              >
                                {repo.language}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                            <FaStar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500" />
                            <span>{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">
                            <BiGitRepoForked className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>{repo.forks_count}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 group/btn"
                        >
                          <FaGithub className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover/btn:text-white transition-colors" />
                          <span className="text-xs sm:text-sm font-medium text-gray-400 group-hover/btn:text-white transition-colors">
                            Code
                          </span>
                        </a>
                        {repo.homepage && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 sm:p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all duration-300 group/icon"
                            aria-label="View Demo"
                          >
                            <FaExternalLinkAlt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 group-hover/icon:scale-110 transition-transform" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 sm:mt-12 lg:mt-16 text-center px-4"
        >
          <a
            href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || ""}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 bg-linear-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm sm:text-base font-medium hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">
              View All {repos.length} Projects on GitHub
            </span>
            <span className="sm:hidden">All {repos.length} Projects</span>
            <FaExternalLinkAlt className="w-3 h-3 sm:w-4 sm:h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

const Projects = memo(ProjectsComponent);
export default Projects;
