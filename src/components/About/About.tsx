"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { memo, useEffect, useRef, useState } from "react";
import { type GitHubUser, githubAPI } from "@/lib/github";

const InfiniteMenu = dynamic(
  () => import("@/components/InfiniteMenu/InfiniteMenu"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] bg-white/5 rounded-2xl animate-pulse flex items-center justify-center">
        <div className="text-gray-400">Loading 3D Menu...</div>
      </div>
    ),
  },
);

const stats = [
  { label: "Years Experience", value: "3+", icon: "🚀" },
  { label: "Projects Completed", value: "50+", icon: "💼" },
  { label: "Happy Clients", value: "30+", icon: "😊" },
  { label: "Code Commits", value: "1000+", icon: "💻" },
];

const skillItems = [
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    link: "https://react.dev",
    title: "React",
    description: "JavaScript Library",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    link: "https://www.typescriptlang.org",
    title: "TypeScript",
    description: "Type Safety",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    link: "https://nextjs.org",
    title: "Next.js",
    description: "React Framework",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    link: "https://nodejs.org",
    title: "Node.js",
    description: "JavaScript Runtime",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    link: "https://tailwindcss.com",
    title: "Tailwind CSS",
    description: "CSS Framework",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    link: "https://www.python.org",
    title: "Python",
    description: "Programming Language",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg",
    link: "https://www.rust-lang.org",
    title: "Rust",
    description: "Systems Programming",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
    link: "https://www.java.com",
    title: "Java",
    description: "Enterprise Development",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    title: "JavaScript",
    description: "Web Language",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    link: "https://go.dev",
    title: "Go",
    description: "Cloud & Backend",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    link: "https://www.docker.com",
    title: "Docker",
    description: "Containerization",
  },
  {
    image:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
    link: "https://git-scm.com",
    title: "Git",
    description: "Version Control",
  },
];

const AboutComponent = () => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const userData = await githubAPI.getUser();
        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching GitHub user:", error);
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

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

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-20"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-4"
          >
            About Me
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Who I Am
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Passionate developer focused on creating exceptional digital
            experiences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-white/10 hover:border-cyan-500/30 transition-colors duration-300">
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">
                My Story
              </h3>
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base lg:text-lg text-gray-300 leading-relaxed">
                <p>
                  {user?.bio ||
                    "I'm a passionate full-stack developer with a love for creating beautiful, functional web applications."}
                </p>
                <p>
                  With expertise in modern web technologies, I specialize in
                  building scalable applications that solve real-world problems.
                  I believe in writing clean, maintainable code and following
                  best practices.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new
                  technologies, contributing to open-source projects, or sharing
                  knowledge with the developer community.
                </p>
              </div>

              {user?.location && (
                <div className="flex items-center gap-2 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-label="Location icon"
                    role="img"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm sm:text-base text-gray-400">
                    {user.location}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center p-4 sm:p-6 rounded-lg sm:rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-2xl sm:text-3xl mb-1.5 sm:mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400 leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Skills & Tech Stack
            </h3>
            <div className="w-full h-[500px] sm:h-[600px] rounded-xl overflow-hidden">
              <InfiniteMenu items={skillItems} />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-linear-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-linear-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Lightning bolt icon"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-white mb-4">
              Let's Work Together
            </h4>
            <p className="text-gray-300 mb-6 text-lg">
              I'm always interested in hearing about new projects and
              opportunities.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
            >
              <span>Get In Touch</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-label="Arrow right icon"
                role="img"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const About = memo(AboutComponent);
export default About;
