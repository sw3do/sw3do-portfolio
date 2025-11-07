"use client";
import { motion, useScroll, useTransform } from "motion/react";
import type React from "react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
//hello
interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

const TimelineComponent = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  const updateHeight = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, []);

  useEffect(() => {
    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    if (ref.current) resizeObserver.observe(ref.current);
    return () => resizeObserver.disconnect();
  }, [updateHeight]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-transparent font-sans px-4 sm:px-6 md:px-10"
    >
      <div className="max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4 md:px-8 lg:px-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 text-white max-w-4xl font-bold">
          My Journey
        </h2>
        <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-sm sm:max-w-md md:max-w-lg">
          A timeline of my development journey and the technologies I&apos;ve
          learned along the way.
        </p>
      </div>

      <div
        ref={ref}
        className="relative max-w-7xl mx-auto pb-8 sm:pb-12 md:pb-16"
      >
        {data.map((item, index) => (
          <div
            key={`timeline-${item.title}-${index}`}
            className="flex justify-start pt-6 sm:pt-8 md:pt-10 gap-4 sm:gap-6 md:gap-8"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-20 sm:top-24 md:top-28 self-start w-20 sm:w-24 md:w-32 lg:w-40 shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 absolute left-2 sm:left-3 rounded-full bg-linear-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-linear-to-br from-purple-500 to-blue-500 border-2 border-gray-900" />
              </div>
              <h3 className="hidden md:block text-base lg:text-lg md:pl-12 lg:pl-14 font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent whitespace-nowrap">
                {item.title}
              </h3>
            </div>

            <div className="relative flex-1 min-w-0">
              <h3 className="md:hidden block text-base sm:text-lg mb-3 font-bold bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}

        <div
          style={{ height }}
          className="absolute left-6 sm:left-7 top-0 overflow-hidden w-0.5 bg-linear-to-b from-transparent via-purple-500/30 to-transparent mask-[linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-0.5 bg-linear-to-t from-purple-500 via-blue-500 to-transparent rounded-full shadow-lg shadow-purple-500/50"
          />
        </div>
      </div>
    </div>
  );
};

export const Timeline = memo(TimelineComponent);
