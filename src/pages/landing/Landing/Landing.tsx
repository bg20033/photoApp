import { useState } from "react";
import {
  Maximize2,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  PenTool,
  Code,
  TrendingUp,
  Layout,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import LandingProfile from "./LandingProfile";
import CaseStudySection from "./CaseStudySection";
import SplitText from "@/components/splitText";

const AgencyLanding = () => {
  const [activeTab, setActiveTab] = useState("All");

  const categories = [
    "All",
    "UI Design",
    "Photography",
    "Branding",
    "3D Assets",
  ];

  const galleryItems = [
    {
      id: 1,
      category: "UI Design",
      title: "Dashboard Concept",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
      size: "tall",
    },
    {
      id: 2,
      category: "Photography",
      title: "Urban Architecture",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      size: "short",
    },
    {
      id: 3,
      category: "Branding",
      title: "Minimalist Stationery",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
      size: "short",
    },
    {
      id: 4,
      category: "3D Assets",
      title: "Abstract Glass",
      img: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=800&auto=format&fit=crop",
      size: "tall",
    },
    {
      id: 5,
      category: "UI Design",
      title: "Mobile App Flow",
      img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
      size: "short",
    },
    {
      id: 6,
      category: "Photography",
      title: "Studio Portrait",
      img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
      size: "tall",
    },
  ];

  const filteredItems =
    activeTab === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeTab);

  // --- MOCK DATA ---
  const agency = {
    name: "Studio Nexus",
    tagline:
      "Design-driven digital agency building modern web experiences and scalable products.",
    about:
      "We are a full-stack digital design agency specializing in product design, web development, and brand systems. We help startups and companies turn complex ideas into beautifully scalable digital products.",
    founded: "2021",
    location: "Global / Remote",
    teamSize: "10-15 Experts",
    timeZone: "CET / EST ",
    email: "hello@studionexus.com",
    socials: ["LinkedIn", "X", "GitHub", "Dribbble"],
  };

  const clients = [
    "Acme Corp",
    "TechFlow",
    "Global Industries",
    "Nova Startup",
    "Apex Financial",
    "Lumina",
  ];

  const services = [
    {
      category: "Product Design",
      icon: <Layout className="text-blue-500" />,
      items: ["UI/UX Design", "Design Systems", "UX Research", "Prototyping"],
    },
    {
      category: "Development",
      icon: <Code className="text-emerald-500" />,
      items: [
        "Web Development",
        "Mobile Apps",
        "SaaS Platforms",
        "API & Backend",
      ],
    },
    {
      category: "Branding",
      icon: <PenTool className="text-purple-500" />,
      items: [
        "Brand Identity",
        "Visual Systems",
        "Motion Design",
        "Guidelines",
      ],
    },
    {
      category: "Growth",
      icon: <TrendingUp className="text-orange-500" />,
      items: ["SEO", "Conversion Optimization", "Analytics", "Performance"],
    },
  ];

  const processSteps = [
    {
      title: "Discovery",
      desc: "Understanding your goals, target audience, and market context.",
    },
    {
      title: "Research",
      desc: "Deep dive into competitors, user needs, and technological requirements.",
    },
    {
      title: "Design",
      desc: "Crafting intuitive wireframes, UI/UX, and comprehensive design systems.",
    },
    {
      title: "Development",
      desc: "Building robust, scalable architecture with modern tech stacks.",
    },
    {
      title: "Launch",
      desc: "Rigorous testing, deployment, and seamless market introduction.",
    },
    {
      title: "Growth",
      desc: "Ongoing analytics, conversion optimization, and feature scaling.",
    },
  ];
  const MOCK_CASE_STUDIES = [
    {
      id: 1,
      client: "Acme Corp",
      industry: "E-commerce",
      project: "Scaling a Global Marketplace",
      outcome:
        "Increased checkout conversion by 24% and reduced page load times by 40% across all regions.",
      services: ["UX Audit", "UI Design", "Frontend Dev"],
      tech: ["Next.js", "TypeScript", "Tailwind"],
      img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
      category: "Development",
    },
    {
      id: 2,
      client: "Stellar AI",
      industry: "SaaS",
      project: "Defining the Future of AI Collaboration",
      outcome:
        "Designed a cohesive design system that allowed the team to ship features 3x faster.",
      services: ["Brand Identity", "Product Design", "Design Ops"],
      tech: ["Figma", "Storybook", "React"],
      img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?q=80&w=800&auto=format&fit=crop",
      category: "Product Design",
    },
    {
      id: 3,
      client: "Velocity Health",
      industry: "Health Tech",
      project: "Patient-First Growth Strategy",
      outcome:
        "Grew monthly active users from 5k to 50k within 6 months through data-driven A/B testing.",
      services: ["Growth Audit", "Marketing Site", "SEO"],
      tech: ["Google Analytics", "PostHog", "Framer"],
      img: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2340&auto=format&fit=crop",
      category: "Growth",
    },
    {
      id: 4,
      client: "Finflow",
      industry: "Fintech",
      project: "Modernizing Legacy Banking",
      outcome:
        "Rebuilt the core dashboard architecture to support real-time transaction processing.",
      services: ["Architecture", "Backend Dev", "Security"],
      tech: ["Node.js", "PostgreSQL", "AWS"],
      img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2340&auto=format&fit=crop",
      category: "Development",
    },
  ];
  const team = [
    {
      name: "Alex Mercer",
      role: "Lead Designer",
      bio: "Obsessed with grid systems and typography.",
      img: "https://ui-avatars.com/api/?name=AM&background=0D8ABC&color=fff",
    },
    {
      name: "Jordan Lee",
      role: "Technical Director",
      bio: "Full-stack architect specializing in React and AI.",
      img: "https://ui-avatars.com/api/?name=JL&background=10B981&color=fff",
    },
  ];

  return (
    <div className="min-h-screen  text-slate-900 dark:text-slate-100 font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { display: flex; animation: marquee 25s linear infinite; }
        .bg-grid-pattern { background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 24px 24px; }
      `}</style>
      <div className="relative  border-slate-200 dark:border-zinc-800 mt-8 md:mt-10">
        <section className="relative z-10 flex justify-center text-center p-6 pb-10">
          <div
            className="max-w-4xl w-full space-y-8 rounded-3xl border border-slate-200 dark:border-zinc-800
      bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none"
          >
            
            <SplitText
              text={agency.tagline}
              className="text-3xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
              delay={50}
              duration={1.25}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />

            <p className="text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {agency.about}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-slate-200 dark:border-zinc-800">
              {[
                { icon: MapPin, value: agency.location },
                { icon: Users, value: agency.teamSize },
                { icon: Clock, value: agency.timeZone },
                { icon: Calendar, value: `Est. ${agency.founded}` },
              ].map(({ icon: Icon, value }, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <Icon size={20} className="text-slate-400" />
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="max-w-xl mx-auto border-l border-r border-t md:rounded-t-xl bg-white ">
        <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest pt-3 pb-3">
          Trusted by innovative teams worldwide
        </p>
      </div>
      <div className="border-t border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden py-8">
        <div className="flex animate-marquee whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
          {[...clients, ...clients].map((client, i) => (
            <div
              key={i}
              className="mx-12 text-2xl font-bold text-slate-300 dark:text-zinc-700 uppercase flex items-center gap-8"
            >
              <span>{client}</span>
              <span className="w-2 h-2 rounded-full bg-slate-200 dark:bg-zinc-800"></span>
            </div>
          ))}
        </div>
      </div>
      <section className=" bg-white">
        <div className="py-24 px-4 max-w-7xl mx-auto">
          <div className="mb-6 md:w-2/3">
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Core Services
            </h2>
            <p className="text-lg text-slate-500 dark:text-zinc-400">
              Comprehensive digital solutions from initial concept to scalable
              market growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-8 rounded-2xl hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{svc.category}</h3>
                <ul className="space-y-3">
                  {svc.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center text-slate-600 dark:text-zinc-400 font-medium"
                    >
                      <CheckCircle
                        size={14}
                        className="mr-2 text-slate-300 dark:text-zinc-700"
                      />{" "}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 border-y border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight  mb-4">
              How We Work
            </h2>
            <p className="text-lg text-slate-500 dark:text-zinc-400">
              A proven methodology for delivering exceptional digital products.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ">
            {processSteps.map((step, idx) => (
              <div
                key={idx}
                className="relative p-6 border border-slate-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950"
              >
                <div className="text-5xl font-black text-slate-100 dark:text-zinc-800 absolute top-4 right-6 pointer-events-none">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold mb-2 relative z-10">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-zinc-400 relative z-10">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CaseStudySection caseStudies={MOCK_CASE_STUDIES} />
      <section className="bg-white ">
        <div className="py-24 px-4 max-w-7xl mx-auto ">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tight mb-2">
                Visual Vault
              </h2>
              <p className="text-slate-500 dark:text-zinc-400">
                A collection of our creative explorations and captures.
              </p>
            </div>
            <div className="w-full overflow-hidden max-w-md">
              <div
                className={` flex flex-nowrap  overflow-x-auto  custom-scrollbar  w-full  p-1.5  gap-2 bg-slate-100 dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800`}
              >
                {categories.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`shrink-0 whitespace-nowrap px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                      activeTab === tab
                        ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 dark:text-zinc-500 dark:hover:text-zinc-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="columns-1 md:columns-2 lg:columns-3  space-y-1 gap-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="relative break-inside-avoid group rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex justify-between items-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-white">
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">
                          {item.category}
                        </p>
                        <h3 className="text-xl font-bold">{item.title}</h3>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors">
                          <Maximize2 size={18} />
                        </button>
                        <button className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-colors">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredItems.length === 0 && (
            <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-3xl">
              <p className="text-slate-400">No media found in this category.</p>
            </div>
          )}
        </div>
      </section>
      <section className="border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-grid-pattern pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl md:text-7xl pl-3 font-bold tracking-tight mb-5">
            Leadership
          </h1>

          <div className="space-y-2">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 lg:grid-cols-3 items-stretch gap-2"
              >
                <div className="p-6 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/80 backdrop-blur-sm relative overflow-hidden flex flex-col items-start">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-md"
                  />

                  <User
                    size={200}
                    className="absolute top-2 -right-2 text-slate-200 dark:text-zinc-800"
                  />

                  <div className="pt-6">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {member.name}
                    </p>

                    <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">
                      {member.role}
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2 p-10 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 flex items-center">
                  <p className="text-lg leading-relaxed text-slate-700 dark:text-zinc-300">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <div className="">
        <LandingProfile />
      </div>
    </div>
  );
};
export default AgencyLanding;
