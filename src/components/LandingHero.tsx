import { motion } from "motion/react";
import { ArrowRight, Sparkles, Compass, CheckCircle2, Award, Zap } from "lucide-react";

interface LandingHeroProps {
  onStart: () => void;
  onSelectPreset: (current: string, target: string) => void;
}

export default function LandingHero({ onStart, onSelectPreset }: LandingHeroProps) {
  const popularPresets = [
    { current: "Marketing Manager", target: "Frontend Web Developer", tag: "Tech Switch" },
    { current: "Sales Representative", target: "Data Analyst", tag: "Analytics" },
    { current: "Graphic Designer", target: "UI/UX Designer", tag: "Creative" },
    { current: "Accountant", target: "Python Programmer", tag: "Finance Switch" },
  ];

  return (
    <div id="landing-hero-container" className="relative overflow-hidden bg-slate-50/20 py-12 sm:py-20">
      {/* Background visual accents */}
      <div id="bg-glow-1" className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-blue-50/50 blur-3xl opacity-60" />
      <div id="bg-glow-2" className="absolute bottom-10 left-1/4 -z-10 h-96 w-96 rounded-full bg-slate-100 blur-3xl opacity-40" />

      <div id="hero-max-width-wrapper" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="hero-content-grid" className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Text and Actions */}
          <div id="hero-text-block" className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              id="hero-badge"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700"
            >
              <Sparkles className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>AI-Powered Career Transformation</span>
            </motion.div>

            <div id="hero-headlines" className="space-y-4">
              <motion.h1
                id="hero-main-headline"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl font-extrabold text-slate-900 leading-[1.1] sm:text-5xl lg:text-6xl tracking-tight"
              >
                Switch Careers with <br className="hidden sm:inline" />
                <span className="text-blue-600">
                  Confidence
                </span>
              </motion.h1>

              <motion.p
                id="hero-subheading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto lg:mx-0 max-w-lg text-base sm:text-lg text-slate-500 leading-relaxed font-light"
              >
                Generate an AI-powered personalized roadmap to transition into your dream career. Compare skill gaps, access optimized course links, and track your structured milestones in a custom dashboard.
              </motion.p>
            </div>

            {/* Main CTA */}
            <motion.div
              id="hero-cta-group"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <button
                id="btn-generate-roadmap-cta"
                onClick={onStart}
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition duration-150 cursor-pointer"
              >
                <span>Generate My Roadmap</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <a
                id="lnk-learn-more-cta"
                href="#preset-section"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-blue-600 transition duration-150 py-2 px-4"
              >
                Or select a preset switch
              </a>
            </motion.div>

            {/* Landing Proof / Key Points */}
            <motion.div
              id="hero-proof-bullets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center lg:justify-start gap-6"
            >
              <div id="faces-pile" className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold text-white">MK</div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">JD</div>
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-400 flex items-center justify-center text-[10px] font-bold text-white">TL</div>
                </div>
                <p className="text-xs text-slate-600 font-medium">
                  <span className="text-blue-600 font-bold">12,000+</span> professionals already transitioned
                </p>
              </div>
            </motion.div>
          </div>

          {/* Interactive Illustration Card */}
          <div id="hero-illustration-block" className="lg:col-span-5 relative">
            <motion.div
              id="hero-card-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto max-w-[420px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-blue-500/5"
            >
              <div id="illustration-header" className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div id="header-author" className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">
                    AI
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Career Matcher</h3>
                    <p className="text-xs text-slate-400">Status: Active Engine</p>
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-700">
                  Ready
                </span>
              </div>

              {/* Sample Switch visualization */}
              <div id="illustration-switch-box" className="space-y-4">
                <div id="switch-source" className="rounded-xl bg-slate-50 p-3.5 border border-slate-200/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Role</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-semibold text-slate-700">Marketing Analyst</span>
                    <span className="text-xs text-slate-400 font-mono">Exp: 3 yrs</span>
                  </div>
                </div>

                <div id="switch-bridge-line" className="flex justify-center my-1 relative">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-dashed bg-slate-200 -z-10" />
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm border border-slate-100">
                    <Compass className="h-4 w-4 animate-spin-slow" />
                  </div>
                </div>

                <div id="switch-destination" className="rounded-xl bg-blue-50/50 p-3.5 border border-blue-100/40">
                  <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">Dream Target Role</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-blue-900">Frontend React Developer</span>
                    <span className="inline-flex items-center text-xs font-semibold text-blue-700">
                      <Award className="h-3.5 w-3.5 mr-0.5" /> Fast Switch
                    </span>
                  </div>
                </div>

                {/* Progress bar simulation */}
                <div id="simulation-milestones" className="space-y-2 pt-3">
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Transition Progress</span>
                    <span className="font-mono text-blue-600 font-bold">Phase 1 of 3</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-blue-600 rounded-full" />
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg">
                    <Zap className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span>Focus on transferring <strong>Data Analysis & Logic skills</strong>.</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Preset Switch Section */}
        <div id="preset-section" className="mt-20 border-t border-slate-200/60 pt-16">
          <div id="preset-header" className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Explore Popular Career Transitions</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm">Click one of the popular pathways below to pre-populate the roadmap generator form instantly.</p>
          </div>

          <div id="preset-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularPresets.map((preset, index) => (
              <motion.div
                id={`preset-card-${index}`}
                key={index}
                whileHover={{ y: -3, borderColor: "rgba(37, 99, 235, 0.3)" }}
                onClick={() => onSelectPreset(preset.current, preset.target)}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md cursor-pointer transition duration-200 text-left relative overflow-hidden"
              >
                <span className="absolute top-3 right-3 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {preset.tag}
                </span>
                
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current</p>
                <h4 className="text-sm font-semibold text-slate-700 mt-0.5 truncate">{preset.current}</h4>
                
                <div className="flex items-center gap-1.5 my-2">
                  <div className="h-px w-6 bg-slate-100" />
                  <ArrowRight className="h-3 w-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                  <div className="h-px w-6 bg-slate-100" />
                </div>
                
                <p className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Target</p>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate group-hover:text-blue-600 transition-colors">
                  {preset.target}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
