import { useState } from "react";
import {
  Mail,
  ExternalLink,
  Globe,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Briefcase,
  Award,
} from "lucide-react";

interface Award {
  id: number;
  title: string;
  organization: string;
  date: string;
  project: string;
  link: string;
}

interface Certification {
  id: number;
  title: string;
  issuer: string;
  date: string;
  link: string;
}

interface Agency {
  name: string;
  tagline: string;
  about: string;
  founded: string;
  location: string;
  teamSize: string;
  timeZone: string;
  email: string;
  website: string;
  phone: string;
  socials: string[];
}

const LandingProfile = () => {
  const [expandedAwards, setExpandedAwards] = useState<boolean>(false);
  const [expandedCertifications, setExpandedCertifications] =
    useState<boolean>(false);

  const agency: Agency = {
    name: "Studio Nexus",
    tagline:
      "Design-driven digital agency building  experiences.",
    about:
      "We are a full-stack digital design agency specializing in product design, web development, and brand systems. We help startups and companies turn complex ideas into beautifully scalable digital products.",
    founded: "2021",
    location: "Global / Remote",
    teamSize: "10-15 Experts",
    timeZone: "CET / EST Availability",
    email: "hello@studionexus.com",
    website: "studionexus.com",
    phone: "+1 (555) 123-4567",
    socials: ["Instagram", "Facebook", "Tiktok"],
  };

  const awards: Award[] = [
    {
      id: 1,
      title: "Awwwards Site of the Day",
      organization: "Awwwards",
      date: "2024",
      project: "EduManage Platform",
      link: "#",
    },
    {
      id: 2,
      title: "CSS Design Awards Winner",
      organization: "CSSDA",
      date: "2023",
      project: "Boutique Bakery",
      link: "#",
    },
    {
      id: 3,
      title: "Webby Award Honoree",
      organization: "The Webby Awards",
      date: "2023",
      project: "Creative Logistics Portal",
      link: "#",
    },
    {
      id: 4,
      title: "Red Dot Design Award",
      organization: "Red Dot",
      date: "2022",
      project: "Brand Identity System",
      link: "#",
    },
  ];

  const certifications: Certification[] = [
    {
      id: 1,
      title: "Google UX Design Professional Certificate",
      issuer: "Google",
      date: "2024",
      link: "#",
    },
    {
      id: 2,
      title: "Meta Front-End Developer Specialization",
      issuer: "Meta",
      date: "2023",
      link: "#",
    },
    {
      id: 3,
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services",
      date: "2023",
      link: "#",
    },
    {
      id: 4,
      title: "Figma for Design Systems",
      issuer: "Design+Code",
      date: "2022",
      link: "#",
    },
  ];

  const getCurrentTime = (): string => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
      hour12: false,
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
        }}
      />
        <div className="p-4 pt-0">
      <div className="mx-auto md:max-w-4xl *:[[id]]:scroll-mt-22 z-10 relative bg-white  ">
          <div className="select-none aspect-2/1 border-x  border-slate-200 dark:border-zinc-800 sm:aspect-3/1 flex items-center justify-center text-black dark:text-white relative bg-black/0 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0 dark:[--pattern-foreground:var(--color-white)]/5 overflow-hidden before:absolute before:top-0 before:w-full before:h-px before:bg-slate-200 dark:before:bg-zinc-800 after:absolute after:bottom-0 after:w-full after:h-px after:bg-slate-200 dark:after:bg-zinc-800">
            <svg
              viewBox="0 0 400 100"
              className="w-full h-contain"
              preserveAspectRatio="none"
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-current font-black"
                style={{
                  fontSize: "68px",
                  letterSpacing: "-2px",
                }}
              >
                About Us
              </text>
            </svg>
          </div>
          <div className="screen-line-after flex border border-t-0  border-edge">
            <div className="shrink-0 border-r border-edge">
              <div className="mx-0.5 my-0.75">
                <div className="relative isolate overflow-visible rounded-full">
                  <div className="relative rounded-[inherit]">
                    <div className="size-30 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background select-none sm:size-40 bg-slate-400/80 flex items-center justify-center text-white text-4xl font-bold">
                      SN
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex grow items-end pb-1 pl-4">
                <div
                  className="line-clamp-1 font-mono text-xs text-zinc-300 select-none max-sm:hidden dark:text-zinc-800"
                  aria-hidden="true"
                >
                  Studio Nexus{" "}
                  <span className="inline dark:hidden text-zinc-950">
                    — Digital Agency
                  </span>
                </div>
              </div>
              <div className="border-t border-edge">
                <div className="flex items-center gap-2 pl-4">
                  <h1 className="-translate-y-px text-3xl font-semibold tracking-tight">
                    {agency.name}
                  </h1>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="size-4.5 text-info select-none"
                    aria-label="Verified"
                  >
                    <path
                      fill="currentColor"
                      d="M24 12a4.454 4.454 0 0 0-2.564-3.91 4.437 4.437 0 0 0-.948-4.578 4.436 4.436 0 0 0-4.577-.948A4.44 4.44 0 0 0 12 0a4.423 4.423 0 0 0-3.9 2.564 4.434 4.434 0 0 0-2.43-.178 4.425 4.425 0 0 0-2.158 1.126 4.42 4.42 0 0 0-1.12 2.156 4.42 4.42 0 0 0 .183 2.421A4.456 4.456 0 0 0 0 12a4.465 4.465 0 0 0 2.576 3.91 4.433 4.433 0 0 0 .936 4.577 4.459 4.459 0 0 0 4.577.95A4.454 4.454 0 0 0 12 24a4.439 4.439 0 0 0 3.91-2.563 4.26 4.26 0 0 0 5.526-5.526A4.453 4.453 0 0 0 24 12Zm-13.709 4.917-4.38-4.378 1.652-1.663 2.646 2.646L15.83 7.4l1.72 1.591-7.258 7.926Z"
                    ></path>
                  </svg>
                </div>
                <div className="h-12.5 border-t border-edge py-1 pl-4 sm:h-9">
                  <p
                    className="inline-block font-pixel-square text-sm text-balance text-muted-foreground"
                    style={{ opacity: 1, transform: "translateY(-1px)" }}
                  >
                    {agency.tagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DECORATIVE PATTERN STRIP */}
          <div className="relative flex h-8 w-full border-x border-edge before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px]efore:[--pattern-foreground:var(--color-edge)]/56"></div>

          {/* AGENCY OVERVIEW PANEL */}
          <section className="screen-line-before screen-line-after border-x border-edge after:content-none">
            <h2 className="sr-only">Overview</h2>
            <div className="p-4 space-y-2.5">
              <div className="flex items-center gap-4 font-mono text-sm">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                  <Globe className="size-4 text-muted-foreground" />
                </div>
                <p className="text-balance">
                  Digital Agency · Founded {agency.founded}
                </p>
              </div>

              <div className="grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
                <div className="flex items-center gap-4 font-mono text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                    <MapPin className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-balance">
                    <a
                      className="underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="#"
                      aria-label={`Location: ${agency.location}`}
                    >
                      {agency.location}
                    </a>
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                    <Clock className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-balance">
                    <span className="cursor-default">{getCurrentTime()}</span>
                    <span className="text-muted-foreground" aria-hidden="true">
                      {" "}
                      // {agency.timeZone}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-4 font-mono text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                    <Users className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-balance">{agency.teamSize}</p>
                </div>

                <div className="flex items-center gap-4 font-mono text-sm group">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                    <Mail className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-balance">
                    <a
                      className="underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`mailto:${agency.email}`}
                      aria-label={`Send email to ${agency.email}`}
                    >
                      {agency.email}
                    </a>
                  </p>
                  <div className="-translate-x-3 opacity-0 transition-opacity ease-out group-hover:opacity-100">
                    <button
                      className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 size-6 rounded-md border-none text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Copy"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="size-3.5"
                      >
                        <rect
                          width="14"
                          height="14"
                          x="8"
                          y="8"
                          rx="2"
                          ry="2"
                        ></rect>
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-sm">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                    <Briefcase className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-balance">
                    <a
                      className="underline-offset-4 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      href="#"
                      aria-label={`Website: ${agency.website}`}
                    >
                      {agency.website}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className="screen-line-before screen-line-after border-x border-edge before:content-none after:content-none">
            <h2 className="sr-only">Social Links</h2>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-1 grid grid-cols-2 md:grid-cols-3">
                <div className="border-r border-edge"></div>
                <div className="border-l border-edge md:border-x"></div>
                <div className="border-l border-edge max-md:hidden"></div>
              </div>
              <div className="grid grid-cols-1  sm:grid-cols-1 md:grid-cols-3">
                {agency.socials.map((social: string, index: number) => (
                  <a
                    key={index}
                    className="group flex cursor-pointer items-center gap-4 p-4 pr-2 transition-[background-color] border-y ease-out hover:bg-accent-muted"
                    href="#"
                    target="_blank"
                    rel="noopener"
                  >
                    <div className="relative size-8 shrink-0">
                      <div className="size-8 rounded-lg bg-linear-to-br from-slate-100 to-slate-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-lg font-bold text-slate-700 dark:text-zinc-300">
                        {social[0]}
                      </div>
                    </div>
                    <h3 className="flex-1 font-medium">{social}</h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-arrow-up-right size-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45"
                      aria-hidden="true"
                    >
                      <path d="M7 7h10v10"></path>
                      <path d="M7 17 17 7"></path>
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </section>

          <div className="relative flex h-8 w-full border-x border-edge before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px]efore:[--pattern-foreground:var(--color-edge)]/56"></div>

          <section
            className="screen-line-before screen-line-after border-x border-edge"
            id="about"
          >
            <header className="screen-line-after px-4">
              <h2 className="text-3xl font-semibold tracking-tight">About</h2>
            </header>
            <div className="p-4">
              <div className="prose max-w-none prose-ncdai prose-zinc dark:prose-invert prose-sm font-mono text-foreground">
                <ul>
                  <li>
                    <strong>Studio Nexus</strong> is a design-driven digital
                    agency founded in {agency.founded}.
                  </li>
                  <li>
                    We specialize in{" "}
                    <strong>
                      product design, web development, and brand systems
                    </strong>{" "}
                    for startups and established companies.
                  </li>
                  <li>
                    Our team of {agency.teamSize} works remotely across{" "}
                    {agency.location}, serving clients worldwide.
                  </li>
                  <li>
                    We've helped launch <strong>50+ digital products</strong>{" "}
                    across EdTech, E-commerce, FinTech, and Healthcare
                    industries.
                  </li>
                  <li>
                    Our work has been recognized by Awwwards, CSS Design Awards,
                    and The Webby Awards.
                  </li>
                </ul>
              </div>
            </div>
          </section>
          <div className="relative flex h-8 w-full border-x border-edge before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"></div>
          <section
            className="screen-line-before screen-line-after border-x border-edge"
            id="awards"
          >
            <header className="screen-line-after px-4">
              <h2 className="text-3xl font-semibold tracking-tight">
                Honors & Awards
                <sup className="-top-[0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                  ({awards.length})
                </sup>
              </h2>
            </header>
            <div className="group/collapsible">
              {awards
                .slice(0, expandedAwards ? awards.length : 3)
                .map((award: Award) => (
                  <div
                    key={award.id}
                    className="border-b border-edge last:border-b-0"
                  >
                    <div className="flex items-center hover:bg-accent-muted">
                      <div className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg border border-muted-foreground/15 bg-muted ring-1 ring-edge ring-offset-1 ring-offset-background">
                        <Award className="size-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 border-l border-dashed border-edge p-4 pr-2">
                        <h3 className="leading-snug font-medium text-balance">
                          {award.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                          <span>{award.organization}</span>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                          <span>{award.date}</span>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                          <span>{award.project}</span>
                        </div>
                      </div>
                      <a
                        className="mr-4 flex size-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                        href={award.link}
                        target="_blank"
                        rel="noopener"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}

              <div className="flex h-12 items-center justify-center pb-px">
                <button
                  onClick={() => setExpandedAwards(!expandedAwards)}
                  className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 rounded-md px-2.5 gap-2 border-none"
                >
                  <span>{expandedAwards ? "Show Less" : "Show More"}</span>
                  {expandedAwards ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>
          </section>
          <div className="relative flex h-8 w-full border-x border-edge before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"></div>
          <section
            className="screen-line-before screen-line-after border-x border-edge"
            id="certs"
          >
            <header className="screen-line-after px-4">
              <h2 className="text-3xl font-semibold tracking-tight">
                Certifications
                <sup className="-top-[0.75em] ml-1 text-sm font-medium tracking-normal text-muted-foreground">
                  ({certifications.length})
                </sup>
              </h2>
            </header>
            <div className="group/collapsible">
              {certifications
                .slice(0, expandedCertifications ? certifications.length : 3)
                .map((cert: Certification) => (
                  <a
                    key={cert.id}
                    className="group flex items-center pr-2 hover:bg-accent-muted border-b border-edge"
                    href={cert.link}
                    target="_blank"
                    rel="noopener"
                  >
                    <div className="mx-4 flex size-6 shrink-0 items-center justify-center rounded-lg select-none border border-muted-foreground/15 ring-1 ring-edge ring-offset-1 ring-offset-background bg-muted text-muted-foreground">
                      <CheckCircle size={14} />
                    </div>
                    <div className="flex-1 space-y-1 border-l border-dashed border-edge p-4 pr-2">
                      <h3 className="leading-snug font-medium text-balance">
                        {cert.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                        <span>{cert.issuer}</span>
                        <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
                        <span>{cert.date}</span>
                      </div>
                    </div>
                    <ExternalLink
                      size={14}
                      className="mr-4 text-muted-foreground transition-[rotate] duration-300 group-hover:rotate-45"
                    />
                  </a>
                ))}

              <div className="flex h-12 items-center justify-center pb-px">
                <button
                  onClick={() =>
                    setExpandedCertifications(!expandedCertifications)
                  }
                  className="group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/80 h-8 rounded-md px-2.5 gap-2 border-none"
                >
                  <span>
                    {expandedCertifications ? "Show Less" : "Show More"}
                  </span>
                  {expandedCertifications ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              </div>
            </div>
          </section>
          <div className="relative flex h-8 w-full border-x border-edge before:absolute before:-left-[100vw] before:-z-1 before:h-8 before:w-[200vw] before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"></div>
        </div>
      </div>
    </div>
  );
};

export default LandingProfile;
