import { useState } from "react";
import { ArrowRight } from "lucide-react";

// 1. Define the shape of a single Case Study
interface CaseStudy {
  id: string | number;
  client: string;
  industry: string;
  project: string;
  outcome: string;
  services: string[];
  tech: string[];
  img: string;
  category: string;
}

// 2. Define the Props for the component
interface CaseStudySectionProps {
  caseStudies: CaseStudy[];
}

const CaseStudySection = ({ caseStudies }: CaseStudySectionProps) => {
  const [activeWorkTab, setActiveWorkTab] = useState<string>("All");

  const categories = ["All", "Product Design", "Development", "Growth"];

  const filteredWork =
    activeWorkTab === "All"
      ? caseStudies
      : caseStudies.filter(
          (item: CaseStudy) => item.category === activeWorkTab,
        );

  return (
    <section className="bg-white">
      <div className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Selected Case Studies
            </h2>
            <p className="text-lg text-slate-500 dark:text-zinc-400">
              Real business challenges solved with design and engineering.
            </p>
          </div>

          {/* --- MOBILE RESPONSIVE TABS --- */}
          <div className="w-full md:w-auto overflow-hidden">
            <div className="flex flex-nowrap md:flex-wrap gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              {categories.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWorkTab(tab)}
                  className={`shrink-0 whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border ${
                    activeWorkTab === tab
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white"
                      : "bg-transparent text-slate-500 border-slate-200 hover:border-slate-400 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- CASE STUDIES GRID --- */}
        <div className="space-y-12">
          {filteredWork.map((study: CaseStudy) => (
            <div
              key={study.id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center group bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-sm"
            >
              <div className="order-2 lg:order-1 space-y-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                  <span>{study.client}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-700"></span>
                  <span>{study.industry}</span>
                </div>

                <h3 className="text-3xl font-bold leading-tight">
                  {study.project}
                </h3>

                <div className="p-4 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-100 dark:border-zinc-800">
                  <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    The Outcome:
                  </p>
                  <p className="text-slate-600 dark:text-zinc-300 font-medium">
                    {study.outcome}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-zinc-800">
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-2 font-bold">
                      Services
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {study.services.map((s: string, i: number) => (
                        <span key={i} className="text-sm font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase mb-2 font-bold">
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {study.tech.map((t: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-slate-100 dark:bg-zinc-800 text-xs font-bold rounded-md"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white hover:opacity-70 transition-opacity mt-4">
                  View Full Case Study <ArrowRight size={16} />
                </button>
              </div>

              <div className="order-1 lg:order-2 relative overflow-hidden rounded-2xl aspect-video md:aspect-4/3 bg-slate-100 dark:bg-zinc-800">
                <img
                  src={study.img}
                  alt={study.project}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudySection;
