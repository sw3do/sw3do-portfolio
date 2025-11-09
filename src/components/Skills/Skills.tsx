"use client";

import { motion } from "motion/react";
import { memo, useEffect, useRef, useState } from "react";
import {
  FaAws,
  FaDocker,
  FaGitAlt,
  FaJava,
  FaLinux,
  FaNodeJs,
  FaPython,
  FaReact,
} from "react-icons/fa";
import { MdBuild, MdDevices, MdSettings } from "react-icons/md";
import {
  SiGo,
  SiJavascript,
  SiNextdotjs,
  SiRust,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";
import { TbBrandGithubCopilot } from "react-icons/tb";

const skills = [
  {
    category: "Frontend",
    color: "cyan",
    icon: MdDevices,
    items: [
      { name: "React", level: 95, icon: FaReact },
      { name: "Next.js", level: 90, icon: SiNextdotjs },
      { name: "TypeScript", level: 92, icon: SiTypescript },
      { name: "Tailwind CSS", level: 88, icon: SiTailwindcss },
      { name: "JavaScript", level: 94, icon: SiJavascript },
    ],
  },
  {
    category: "Backend",
    color: "blue",
    icon: MdSettings,
    items: [
      { name: "Node.js", level: 85, icon: FaNodeJs },
      { name: "Python", level: 80, icon: FaPython },
      { name: "Java", level: 75, icon: FaJava },
      { name: "Go", level: 70, icon: SiGo },
      { name: "Rust", level: 65, icon: SiRust },
    ],
  },
  {
    category: "DevOps & Tools",
    color: "purple",
    icon: MdBuild,
    items: [
      { name: "Docker", level: 82, icon: FaDocker },
      { name: "Git", level: 90, icon: FaGitAlt },
      { name: "AWS", level: 75, icon: FaAws },
      { name: "CI/CD", level: 78, icon: TbBrandGithubCopilot },
      { name: "Linux", level: 85, icon: FaLinux },
    ],
  },
];

const SkillsComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          setTimeout(() => setHasStarted(true), 100);
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

  const getColorClasses = (color: string) => {
    const colors = {
      cyan: {
        border: "border-cyan-500/20",
        borderHover: "hover:border-cyan-500/50",
        bg: "bg-cyan-500/10",
        glow: "shadow-cyan-500/20",
        bar: "bg-linear-to-r from-cyan-500 to-cyan-400",
        text: "text-cyan-400",
      },
      blue: {
        border: "border-blue-500/20",
        borderHover: "hover:border-blue-500/50",
        bg: "bg-blue-500/10",
        glow: "shadow-blue-500/20",
        bar: "bg-linear-to-r from-blue-500 to-blue-400",
        text: "text-blue-400",
      },
      purple: {
        border: "border-purple-500/20",
        borderHover: "hover:border-purple-500/50",
        bg: "bg-purple-500/10",
        glow: "shadow-purple-500/20",
        bar: "bg-linear-to-r from-purple-500 to-purple-400",
        text: "text-purple-400",
      },
    };
    return colors[color as keyof typeof colors] || colors.cyan;
  };

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-cyan-500/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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
            My Expertise
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Mastering modern tools and technologies to build exceptional digital
            experiences
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {skills.map((category, categoryIndex) => {
            const colorClasses = getColorClasses(category.color);

            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.15 }}
                className={`group relative bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border ${colorClasses.border} ${colorClasses.borderHover} transition-all duration-300`}
              >
                {/* Category Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {category.category}
                  </h3>
                  <div
                    className={`w-12 h-12 rounded-xl ${colorClasses.bg} flex items-center justify-center ${colorClasses.text} text-2xl`}
                  >
                    <category.icon className="w-6 h-6" />
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-5">
                  {category.items.map((skill, skillIndex) => (
                    <div key={skill.name} className="group/skill">
                      {/* Skill Name & Icon */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <skill.icon
                            className={`w-5 h-5 ${colorClasses.text}`}
                          />
                          <span className="text-sm sm:text-base font-medium text-white">
                            {skill.name}
                          </span>
                        </div>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={hasStarted ? { opacity: 1 } : { opacity: 0 }}
                          transition={{
                            duration: 0.3,
                            delay:
                              categoryIndex * 0.15 + skillIndex * 0.08 + 0.8,
                          }}
                          className={`text-xs sm:text-sm font-bold ${colorClasses.text}`}
                        >
                          {skill.level}%
                        </motion.span>
                      </div>

                      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={
                            hasStarted
                              ? { width: `${skill.level}%`, opacity: 1 }
                              : { width: 0, opacity: 0 }
                          }
                          transition={{
                            width: {
                              duration: 1.2,
                              delay: categoryIndex * 0.15 + skillIndex * 0.08,
                              ease: [0.4, 0, 0.2, 1],
                            },
                            opacity: {
                              duration: 0.3,
                              delay: categoryIndex * 0.15 + skillIndex * 0.08,
                            },
                          }}
                          className={`h-full ${colorClasses.bar} rounded-full relative`}
                        >
                          <motion.div
                            className="absolute inset-0 bg-white/20"
                            initial={{ x: "-100%" }}
                            animate={
                              hasStarted
                                ? {
                                    x: "100%",
                                  }
                                : { x: "-100%" }
                            }
                            transition={{
                              duration: 1.5,
                              delay: categoryIndex * 0.15 + skillIndex * 0.08,
                              ease: "easeInOut",
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Category Progress */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Overall Proficiency</span>
                    <span className={`font-bold ${colorClasses.text}`}>
                      {Math.round(
                        category.items.reduce(
                          (acc, item) => acc + item.level,
                          0,
                        ) / category.items.length,
                      )}
                      %
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 sm:mt-16 text-center"
        >
          <p className="text-gray-400 text-lg mb-6">
            Always learning and exploring new technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors duration-300">
              🎯 Focused on Excellence
            </div>
            <div className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors duration-300">
              🚀 Continuous Learning
            </div>
            <div className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors duration-300">
              💡 Problem Solver
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Skills = memo(SkillsComponent);
export default Skills;
