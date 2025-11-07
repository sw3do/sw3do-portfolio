import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero/Hero";
import Projects from "@/components/Projects/Projects";
import Skills from "@/components/Skills/Skills";
import { Timeline } from "@/components/Timeline/Timeline";

interface TechBadge {
  name: string;
  colorClass: string;
}

const TimelineCard = ({
  title,
  description,
  techs,
}: {
  title: string;
  description: string;
  techs: TechBadge[];
}) => (
  <div className="space-y-4">
    <div className="bg-linear-to-br from-white/5 to-white/2 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h4 className="text-xl font-bold text-white mb-2">{title}</h4>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {techs.map((tech) => (
          <span
            key={tech.name}
            className={`px-3 py-1 rounded-full text-xs border ${tech.colorClass}`}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const timelineData = [
  {
    title: "2018",
    content: (
      <TimelineCard
        title="Started with Backend & Discord Bots"
        description="Began my programming journey by building custom Discord bots. Learned Node.js, event-based architecture, APIs, and automation logic."
        techs={[
          {
            name: "Node.js",
            colorClass: "bg-green-500/10 text-green-400 border-green-500/20",
          },
          {
            name: "Discord.js",
            colorClass: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          },
          {
            name: "REST APIs",
            colorClass: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          },
        ]}
      />
    ),
  },
  {
    title: "2019 - 2021",
    content: (
      <TimelineCard
        title="High School at Sınav Koleji"
        description="Continued improving backend skills while studying in high school. Built tools, automation scripts, and experimented with database-backed apps."
        techs={[
          {
            name: "MongoDB",
            colorClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
          },
          {
            name: "Express",
            colorClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          },
          {
            name: "Basic UI Development",
            colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          },
        ]}
      />
    ),
  },
  {
    title: "2022 - 2023",
    content: (
      <TimelineCard
        title="Desktop and Mobile Applications"
        description="Expanded into full application development — from desktop tools to mobile apps. Learned cross-platform UI and state management."
        techs={[
          {
            name: "Electron",
            colorClass: "bg-green-500/10 text-green-400 border-green-500/20",
          },
          {
            name: "React Native",
            colorClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          },
          {
            name: "State Management",
            colorClass: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          },
        ]}
      />
    ),
  },
  {
    title: "2024",
    content: (
      <TimelineCard
        title="Building and Publishing Real Projects"
        description="Designed, developed, and deployed full-stack applications like mert.lol, animely.net, ragnewedit, and moxeditor."
        techs={[
          {
            name: "Next.js",
            colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          },
          {
            name: "Svelte",
            colorClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          },
          {
            name: "TypeScript",
            colorClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
          },
          {
            name: "Tailwind CSS",
            colorClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
          },
        ]}
      />
    ),
  },
  {
    title: "2025",
    content: (
      <TimelineCard
        title="A New Chapter in Berlin"
        description="Moved to Berlin and began studying Software Engineering at GISMA University. Focusing on full-stack systems, mobile dev, and AI-assisted products."
        techs={[
          {
            name: "Node.js",
            colorClass: "bg-white/10 text-white/80 border-white/20",
          },
          {
            name: "PocketBase",
            colorClass: "bg-white/10 text-white/80 border-white/20",
          },
          {
            name: "React Native",
            colorClass: "bg-white/10 text-white/80 border-white/20",
          },
          {
            name: "AI / LLM",
            colorClass: "bg-white/10 text-white/80 border-white/20",
          },
        ]}
      />
    ),
  },
];

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <div className="relative w-full overflow-clip">
        <Timeline data={timelineData} />
      </div>
      <Contact />
    </main>
  );
}
