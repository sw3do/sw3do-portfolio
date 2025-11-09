"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const _pathname = usePathname();
  const _searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    if (document.readyState === "complete") {
      setTimeout(() => setIsLoading(false), 300);
    } else {
      const handleLoad = () => {
        setTimeout(() => setIsLoading(false), 300);
      };

      window.addEventListener("load", handleLoad, { once: true });
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [isMounted]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-linear-to-br from-gray-900 via-black to-gray-900"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-transparent border-t-cyan-400 border-r-cyan-400/50 rounded-full animate-spin" />
                <div className="absolute inset-0 border-4 border-transparent border-b-purple-500 border-l-purple-500/50 rounded-full animate-spin-reverse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-linear-to-br from-cyan-400 to-purple-500 rounded-full blur-lg animate-pulse" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <div
                  className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </Suspense>
  );
}
