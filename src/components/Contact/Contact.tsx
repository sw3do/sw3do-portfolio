"use client";

import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BsCheckCircleFill, BsCircleFill, BsSendFill } from "react-icons/bs";
import {
  FaCheckCircle,
  FaChevronDown,
  FaEnvelope,
  FaExternalLinkAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { HiLocationMarker, HiMail } from "react-icons/hi";
import { IoMdSend } from "react-icons/io";
import { MdEmail, MdLocationOn } from "react-icons/md";
import {
  SiDiscord,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiSpotify,
} from "react-icons/si";
import { useLanyard } from "react-use-lanyard";

interface LanyardActivity {
  type: number;
  application_id?: string;
  name: string;
  details?: string;
  state?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

const socialLinks = [
  {
    name: "Email",
    icon: <MdEmail className="w-6 h-6" />,
    href: "mailto:sw3doo@gmail.com",
    color: "text-red-400",
    hoverColor: "hover:border-red-500/50",
    bgColor: "bg-red-500/10",
    username: "sw3doo@gmail.com",
    description: "Send me an email",
  },
  {
    name: "LinkedIn",
    icon: <SiLinkedin className="w-6 h-6" />,
    href: "https://www.linkedin.com/in/swedo/",
    color: "text-blue-400",
    hoverColor: "hover:border-blue-500/50",
    bgColor: "bg-blue-500/10",
    username: "@swedo",
    description: "Connect on LinkedIn",
  },
  {
    name: "Instagram",
    icon: <SiInstagram className="w-6 h-6" />,
    href: "https://instagram.com/sw3doo",
    color: "text-pink-400",
    hoverColor: "hover:border-pink-500/50",
    bgColor: "bg-gradient-to-r from-purple-500/10 to-pink-500/10",
    username: "@sw3doo",
    description: "Follow on Instagram",
  },
  {
    name: "GitHub",
    icon: <SiGithub className="w-6 h-6" />,
    href: `https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME || ""}`,
    color: "text-gray-300",
    hoverColor: "hover:border-gray-500/50",
    bgColor: "bg-gray-500/10",
    username: `@${process.env.NEXT_PUBLIC_GITHUB_USERNAME || "sw3do"}`,
    description: "Check my repositories",
  },
];

const ContactComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDiscordOpen, setIsDiscordOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const DISCORD_ID = "1220783094613672011";
  const { loading: lanyardLoading, status: lanyardData } = useLanyard({
    userId: DISCORD_ID,
    socket: true,
  });

  useEffect(() => {
    if (!isDiscordOpen || !lanyardData?.listening_to_spotify) return;

    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isDiscordOpen, lanyardData?.listening_to_spotify]);

  const spotifyProgress = useMemo(() => {
    if (!lanyardData?.spotify?.timestamps)
      return { elapsed: "0:00", total: "0:00", percentage: 0 };

    const elapsed = currentTime - lanyardData.spotify.timestamps.start;
    const total =
      lanyardData.spotify.timestamps.end - lanyardData.spotify.timestamps.start;
    const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));

    const formatTime = (ms: number) => {
      const seconds = Math.floor(ms / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return {
      elapsed: formatTime(elapsed),
      total: formatTime(total),
      percentage,
    };
  }, [currentTime, lanyardData?.spotify?.timestamps]);

  const getElapsedTime = useCallback(
    (startTimestamp: number) => {
      const elapsed = currentTime - startTimestamp;
      const seconds = Math.floor(elapsed / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    },
    [currentTime],
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: "sw3do",
        email: formData.email,
        name: formData.email,
        time: new Date().toLocaleString(),
      };

      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "",
      );

      if (result.status === 200) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! I'll get back to you soon.",
        });
        setFormData({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("EmailJS Error:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Failed to send message. Please try again or contact me directly via email.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSubmitStatus({ type: null, message: "" });
      }, 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleDiscord = useCallback(() => {
    setIsDiscordOpen((prev) => !prev);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-500/5 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4"
          >
            <HiMail className="w-4 h-4" />
            Get In Touch
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 px-4">
            Let's Work Together
          </h2>
          <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Have a project in mind? Let's create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 sm:space-y-8"
          >
            <div className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <HiLocationMarker className="w-6 h-6 text-purple-400" />
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <MdEmail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <FaEnvelope className="w-3 h-3" />
                      Email
                    </p>
                    <a
                      href="mailto:sw3doo@gmail.com"
                      className="text-sm sm:text-base font-medium hover:text-purple-400 transition-colors duration-300"
                    >
                      sw3doo@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-gray-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <MdLocationOn className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3" />
                      Location
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      Zossen, Germany
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-4 px-2">
                Connect With Me
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {socialLinks.slice(0, 2).map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className={`group relative bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 ${social.hoverColor} transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${social.bgColor} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={social.color}>{social.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                          {social.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {social.username}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {social.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExternalLinkAlt className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.a>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="sm:col-span-2"
                >
                  <button
                    type="button"
                    onClick={toggleDiscord}
                    className="group relative w-full bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 hover:border-indigo-500/50 transition-all duration-300 hover:scale-[1.02] text-left"
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="relative w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        <SiDiscord className="w-6 h-6 text-indigo-400" />
                        {!lanyardLoading && lanyardData && (
                          <BsCircleFill
                            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-900 ${
                              lanyardData.discord_status === "online"
                                ? "text-green-500"
                                : lanyardData.discord_status === "idle"
                                  ? "text-yellow-500"
                                  : lanyardData.discord_status === "dnd"
                                    ? "text-red-500"
                                    : "text-gray-500"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                            Discord
                          </h4>
                          <motion.div
                            animate={{ rotate: isDiscordOpen ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <FaChevronDown className="w-4 h-4 text-gray-400" />
                          </motion.div>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">
                          {lanyardLoading
                            ? "Loading..."
                            : lanyardData?.discord_user?.username || "@sw3do"}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {lanyardLoading
                            ? "Connecting..."
                            : lanyardData?.discord_status === "online"
                              ? "Online"
                              : lanyardData?.discord_status === "idle"
                                ? "Idle"
                                : lanyardData?.discord_status === "dnd"
                                  ? "Do Not Disturb"
                                  : "Offline"}
                        </p>
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isDiscordOpen && !lanyardLoading && lanyardData && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: "auto", opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <motion.div
                          className="mt-4 bg-linear-to-br from-white/5 to-white/2 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.1, duration: 0.3 }}
                        >
                          <div className="px-4 sm:px-6 pt-5 pb-5">
                            <div className="flex items-start gap-4 mb-4">
                              <motion.div
                                className="relative"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  delay: 0.2,
                                  type: "spring",
                                  stiffness: 200,
                                }}
                              >
                                <Image
                                  src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${lanyardData.discord_user.avatar}.${lanyardData.discord_user.avatar?.startsWith("a_") ? "gif" : "png"}?size=256`}
                                  alt="Discord Avatar"
                                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full"
                                  width={96}
                                  height={96}
                                />
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.4, type: "spring" }}
                                >
                                  <BsCircleFill
                                    className={`absolute bottom-0 right-0 w-6 h-6 rounded-full border-4 border-gray-900 ${
                                      lanyardData.discord_status === "online"
                                        ? "text-green-500"
                                        : lanyardData.discord_status === "idle"
                                          ? "text-yellow-500"
                                          : lanyardData.discord_status === "dnd"
                                            ? "text-red-500"
                                            : "text-gray-500"
                                    }`}
                                  />
                                </motion.div>
                              </motion.div>

                              <div className="flex-1">
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 }}
                                >
                                  <h4 className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center gap-2">
                                    {lanyardData.discord_user.username}
                                    {lanyardData.discord_user.discriminator !==
                                      "0" && (
                                      <span className="text-sm text-gray-500 font-normal">
                                        #
                                        {lanyardData.discord_user.discriminator}
                                      </span>
                                    )}
                                  </h4>
                                  <div className="flex items-center gap-2 text-sm text-gray-400">
                                    <BsCircleFill
                                      className={`w-2 h-2 ${
                                        lanyardData.discord_status === "online"
                                          ? "text-green-500"
                                          : lanyardData.discord_status ===
                                              "idle"
                                            ? "text-yellow-500"
                                            : lanyardData.discord_status ===
                                                "dnd"
                                              ? "text-red-500"
                                              : "text-gray-500"
                                      }`}
                                    />
                                    <span>
                                      {lanyardData.discord_status === "online"
                                        ? "Online"
                                        : lanyardData.discord_status === "idle"
                                          ? "Idle"
                                          : lanyardData.discord_status === "dnd"
                                            ? "Do Not Disturb"
                                            : "Offline"}
                                    </span>
                                  </div>
                                </motion.div>
                              </div>
                            </div>

                            {lanyardData.kv &&
                              Object.keys(lanyardData.kv).length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.4 }}
                                  className="mb-4 bg-gray-900/30 backdrop-blur-sm rounded-xl p-3 border border-white/10"
                                >
                                  <h5 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                                    Custom Status
                                  </h5>
                                  <p className="text-sm text-white">
                                    {Object.values(lanyardData.kv)[0] as string}
                                  </p>
                                </motion.div>
                              )}

                            {lanyardData.listening_to_spotify &&
                              lanyardData.spotify && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 }}
                                  className="mb-4 bg-linear-to-br from-green-500/20 to-green-600/10 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg shadow-green-500/10"
                                >
                                  <div className="flex items-center gap-2 mb-3">
                                    <SiSpotify className="w-5 h-5 text-green-500" />
                                    <span className="text-xs font-bold text-green-400 uppercase tracking-wide">
                                      Listening to Spotify
                                    </span>
                                  </div>
                                  <div className="flex gap-3">
                                    {lanyardData.spotify.album_art_url && (
                                      <Image
                                        src={lanyardData.spotify.album_art_url}
                                        alt={lanyardData.spotify.album}
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shadow-lg"
                                        width={80}
                                        height={80}
                                      />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="text-sm sm:text-base font-bold text-white mb-1 truncate">
                                        {lanyardData.spotify.song}
                                      </h5>
                                      <p className="text-xs text-gray-300 truncate mb-1">
                                        by {lanyardData.spotify.artist}
                                      </p>
                                      <p className="text-xs text-gray-400 truncate">
                                        on {lanyardData.spotify.album}
                                      </p>
                                      {lanyardData.spotify.timestamps && (
                                        <div className="mt-2">
                                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                            <span>
                                              {spotifyProgress.elapsed}
                                            </span>
                                            <span>{spotifyProgress.total}</span>
                                          </div>
                                          <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                              className="h-full bg-green-500 transition-all duration-1000 ease-linear"
                                              style={{
                                                width: `${spotifyProgress.percentage}%`,
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                            {lanyardData.activities &&
                              lanyardData.activities.length > 0 && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 }}
                                  className="space-y-3"
                                >
                                  {lanyardData.activities.map(
                                    (
                                      activity: LanyardActivity,
                                      idx: number,
                                    ) => {
                                      if (activity.type === 2) return null;
                                      return (
                                        <div
                                          key={`activity-${activity.application_id || activity.name}-${idx}`}
                                          className="bg-linear-to-br from-purple-500/20 to-pink-500/10 backdrop-blur-sm border border-purple-500/30 rounded-xl p-4 shadow-lg shadow-purple-500/10"
                                        >
                                          <div className="flex items-center gap-2 mb-3">
                                            <div className="text-xs font-bold text-purple-400 uppercase tracking-wide">
                                              {activity.type === 0
                                                ? "Playing a game"
                                                : activity.type === 1
                                                  ? "Streaming"
                                                  : activity.type === 3
                                                    ? "Watching"
                                                    : activity.type === 5
                                                      ? "Competing"
                                                      : "Activity"}
                                            </div>
                                          </div>
                                          <div className="flex gap-3">
                                            {activity.assets?.large_image && (
                                              <Image
                                                src={
                                                  activity.assets.large_image.startsWith(
                                                    "mp:",
                                                  )
                                                    ? `https://media.discordapp.net/${activity.assets.large_image.replace("mp:", "")}`
                                                    : `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                                                }
                                                alt={activity.name}
                                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg shadow-lg"
                                                width={80}
                                                height={80}
                                              />
                                            )}
                                            <div className="flex-1 min-w-0">
                                              <h5 className="text-sm sm:text-base font-bold text-white mb-1">
                                                {activity.name}
                                              </h5>
                                              {activity.details && (
                                                <p className="text-xs text-gray-300 mb-1 truncate">
                                                  {activity.details}
                                                </p>
                                              )}
                                              {activity.state && (
                                                <p className="text-xs text-gray-400 truncate">
                                                  {activity.state}
                                                </p>
                                              )}
                                              {activity.assets?.small_text && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                  {activity.assets.small_text}
                                                </p>
                                              )}
                                              {activity.timestamps?.start && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                  {getElapsedTime(
                                                    activity.timestamps.start,
                                                  )}{" "}
                                                  elapsed
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    },
                                  )}
                                </motion.div>
                              )}

                            {(!lanyardData.activities ||
                              lanyardData.activities.length === 0) &&
                              !lanyardData.listening_to_spotify && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                  className="text-center py-8"
                                >
                                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800/50 border border-gray-700 mb-3">
                                    <SiDiscord className="w-8 h-8 text-gray-600" />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    No activity right now
                                  </p>
                                </motion.div>
                              )}

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.7 }}
                              className="mt-4 pt-4 border-t border-white/10"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">
                                  Discord ID
                                </span>
                                <code className="px-2 py-1 bg-gray-900/50 text-gray-400 rounded font-mono">
                                  {DISCORD_ID}
                                </code>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {socialLinks.slice(2).map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className={`group relative bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-white/10 ${social.hoverColor} transition-all duration-300 hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${social.bgColor} flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className={social.color}>{social.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                          {social.name}
                        </h4>
                        <p className="text-xs text-gray-500 mb-1 truncate">
                          {social.username}
                        </p>
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {social.description}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExternalLinkAlt className="w-4 h-4 text-gray-400" />
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <IoMdSend className="w-6 h-6 text-cyan-400" />
                Send Message
              </h3>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <FaCheckCircle className="w-4 h-4 text-purple-400" />
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <MdEmail className="w-4 h-4 text-purple-400" />
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2"
                  >
                    <BsSendFill className="w-4 h-4 text-purple-400" />
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <IoMdSend className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-center gap-2 ${
                      submitStatus.type === "success"
                        ? "bg-green-500/10 border border-green-500/20 text-green-400"
                        : "bg-red-500/10 border border-red-500/20 text-red-400"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <BsCheckCircleFill className="w-5 h-5 shrink-0" />
                    ) : (
                      <FaExternalLinkAlt className="w-5 h-5 shrink-0" />
                    )}
                    <p className="text-sm">{submitStatus.message}</p>
                  </motion.div>
                )}
              </div>
            </form>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <BsCheckCircleFill className="w-4 h-4 text-green-400" />
                Usually responds within{" "}
                <span className="text-purple-400 font-semibold">24 hours</span>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Contact = memo(ContactComponent);
export default Contact;
