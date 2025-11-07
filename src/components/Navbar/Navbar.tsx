"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "#about" },
  { name: "Projects", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleNavClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
      href: string,
    ) => {
      if (href === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        closeMenu();
      } else {
        closeMenu();
      }
    },
    [closeMenu],
  );

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-100 transition-all duration-500 ${
          scrolled
            ? "backdrop-blur-xl bg-linear-to-b from-[#000000]/95 to-[#0a0a0a]/90 border-b border-cyan-500/10 shadow-lg shadow-cyan-500/5"
            : "backdrop-blur-sm bg-linear-to-b from-[#000000]/50 to-transparent border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="shrink-0"
            >
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="relative group text-xl sm:text-2xl font-bold"
              >
                <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600">
                  sw3do
                </span>
                <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </a>
            </motion.div>

            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  {link.name}
                  <motion.span className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:block"
            >
              <a
                href="#contact"
                className="px-4 lg:px-6 py-2 lg:py-2.5 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-sm lg:text-base rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                Let's Talk
              </a>
            </motion.div>

            <div className="md:hidden">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMenu}
                className="relative inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none transition-colors duration-200"
                aria-label="Toggle menu"
              >
                <div className="w-6 h-5 flex flex-col justify-between">
                  <motion.span
                    animate={
                      isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }
                    }
                    className="w-full h-0.5 bg-current rounded-full transition-all"
                  />
                  <motion.span
                    animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                    className="w-full h-0.5 bg-current rounded-full transition-all"
                  />
                  <motion.span
                    animate={
                      isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }
                    }
                    className="w-full h-0.5 bg-current rounded-full transition-all"
                  />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence mode="wait">
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 bg-linear-to-br from-[#000000]/80 to-[#0a0a0a]/60 backdrop-blur-md z-90 md:hidden"
              onClick={closeMenu}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 30,
                stiffness: 300,
                mass: 0.8,
              }}
              className="fixed top-16 sm:top-20 right-0 bottom-0 w-64 sm:w-80 bg-linear-to-br from-[#000000] via-[#0a0a0a] to-[#141414] border-l border-cyan-500/20 shadow-2xl shadow-cyan-500/10 z-95 md:hidden overflow-hidden"
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{
                        delay: 0.03 * index,
                        duration: 0.2,
                        ease: "easeOut",
                      }}
                      onClick={(e) => {
                        handleNavClick(e, link.href);
                        closeMenu();
                      }}
                      className="group flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 border border-transparent hover:border-cyan-500/20"
                    >
                      <span className="text-base font-medium">{link.name}</span>
                      <motion.svg
                        className="w-5 h-5 text-cyan-400 opacity-0 group-hover:opacity-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-label="Chevron right icon"
                        role="img"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </motion.svg>
                    </motion.a>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.15, duration: 0.2, ease: "easeOut" }}
                  className="p-4 border-t border-white/10"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      handleNavClick(e, "#contact");
                      closeMenu();
                    }}
                    className="w-full block px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white text-center rounded-lg font-medium hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    <span>Let's Talk</span>
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
                  </button>
                </motion.div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl -z-10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
