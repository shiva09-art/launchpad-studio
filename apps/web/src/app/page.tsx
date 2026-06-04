"use client";

import React, { useState, useEffect } from "react";

// Inline SVG Icons for premium look
const Icons = {
  Dashboard: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
    </svg>
  ),
  Idea: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  Roadmap: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  ),
  Marketplace: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  Simulation: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Star: () => (
    <svg className="w-4 h-4 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5 text-mint-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Warning: () => (
    <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
};

interface Idea {
  id: string;
  title: string;
  description: string;
  validationScore: number | null;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  } | null;
  leanCanvas: {
    problem: string[];
    solution: string[];
    keyMetrics: string[];
    uvp: string;
    unfairAdvantage: string;
    channels: string[];
    customerSegments: string[];
    costStructure: string[];
    revenueStreams: string[];
  } | null;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"overview" | "ideas" | "kanban" | "experts" | "simulations">("overview");

  // Global Mock States (Syncd with Backend endpoints structure)
  const [startup, setStartup] = useState({
    id: "demo-startup-uuid",
    name: "AeroCore Technologies",
    industry: "SaaS / AI Operations",
    stage: "Idea",
    analytics: {
      startupScore: 72,
      validationScore: 84,
      investorReadiness: 65,
      marketFitScore: 70,
      burnRate: 8500,
      revenueForecast: [
        { month: "Jul", revenue: 0 },
        { month: "Aug", revenue: 1200 },
        { month: "Sep", revenue: 3400 },
        { month: "Oct", revenue: 5800 },
        { month: "Nov", revenue: 9000 },
        { month: "Dec", revenue: 15400 }
      ]
    },
    dna: {
      executionAbility: 75.0,
      technicalCapability: 85.0,
      businessCapability: 60.0,
      fundingReadiness: 50.0
    }
  });

  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: "idea-1",
      title: "Anti-Gravity Collaborative Workspace",
      description: "An AI-powered startup operating platform that bundles lean canvas, kanban board workspace, legal compliance filing, expert consultation scheduling, and financial projections calculations.",
      validationScore: 84,
      swot: {
        strengths: ["Highly integrated feature set", "Low user interface friction", "Embedded AI advisor guidance"],
        weaknesses: ["High initial customer education cost", "Dependency on open LLM performance stability", "Complex pricing structure"],
        opportunities: ["Untapped early founder incubator network market", "Enterprise hub partnerships", "Non-dilutive funding brokerages"],
        threats: ["Fast imitation by Notion or Monday.com", "Strict privacy protection requirements", "Platform dependency shifts"]
      },
      leanCanvas: {
        problem: ["Founders lose months jumping between disconnected apps", "Early market validation lacks structured datasets", "Compliance/legal errors derail early funding deals"],
        solution: ["Unified OS dashboard including validator, workspace, and deal rooms", "AI feedback validator outputting swot, canvas, and competitor indexes", "Automated escrow systems protecting vendor service payments"],
        keyMetrics: ["Founder lifetime value (LTV)", "Active workspace task operations count", "Milestone roadmap achievement rate"],
        uvp: "The unified operational ecosystem that streamlines everything from a conceptual sketch to venture-backed growth.",
        unfairAdvantage: "AI models trained on DNA metrics offering customized execution tracks.",
        channels: ["Product-led loops (PLG)", "Startup incubators", "VC community alliances"],
        customerSegments: ["Pre-seed & Seed stage technology founders", "Indie hackers", "Venture studios"],
        costStructure: ["Compute hosting resources (AWS/MinIO/Postgres)", "Foundational model API token fees", "Development payroll"],
        revenueStreams: ["Subscription tiers ($29 - $149/month)", "Marketplace escrow transaction fees (5%)", "Expert marketplace booking fees (10%)"]
      }
    }
  ]);

  const [activeIdeaId, setActiveIdeaId] = useState("idea-1");
  const activeIdea = ideas.find((i) => i.id === activeIdeaId) || ideas[0];

  // Ideas Submit Form State
  const [newIdeaTitle, setNewIdeaTitle] = useState("");
  const [newIdeaDesc, setNewIdeaDesc] = useState("");
  const [validatingIdeaId, setValidatingIdeaId] = useState<string | null>(null);

  // Kanban Tasks State
  const [milestones, setMilestones] = useState([
    {
      id: "m-1",
      title: "Phase 1: Market Validation & SWOT Review",
      tasks: [
        { id: "t-1", title: "Generate SWOT and Competitor Grid using AI Copilot", status: "DONE" },
        { id: "t-2", title: "Complete Lean Canvas business plan", status: "IN_PROGRESS" },
        { id: "t-3", title: "Draft 10 interview survey questions for target audience", status: "TODO" }
      ]
    },
    {
      id: "m-2",
      title: "Phase 2: MVP Definition & Scope",
      tasks: [
        { id: "t-4", title: "Finalize frontend design system colors", status: "TODO" },
        { id: "t-5", title: "Draft high-level PRD (Product Requirements Document)", status: "TODO" },
        { id: "t-6", title: "Configure local docker-compose dependencies", status: "TODO" }
      ]
    }
  ]);

  // Expert Profiles
  const experts = [
    {
      id: "exp-1",
      name: "Elizabeth VC Advisor",
      role: "Venture Capitalist",
      rating: "4.9",
      reviews: "24",
      skills: ["Seed Funding", "Valuation", "Pitch Decks", "Fintech"],
      rate: "$150/hr",
      bio: "Fintech founder and seed VC advisor. Expert in pitch alignment and deck valuations."
    },
    {
      id: "exp-2",
      name: "Steve Patents Lawyer",
      role: "IP & Tech Attorney",
      rating: "5.0",
      reviews: "48",
      skills: ["Legal", "Patents", "Compliance", "Incorporation"],
      rate: "$200/hr",
      bio: "SaaS attorney helping tech startups with incorporation, patent filings, and GDPR compliance."
    }
  ];

  // Booking session state
  const [selectedExpert, setSelectedExpert] = useState<string | null>(null);
  const [bookingTime, setBookingTime] = useState("2026-06-15T14:00");
  const [bookingNote, setBookingNote] = useState("");
  const [bookingsList, setBookingsList] = useState<any[]>([]);

  // Simulation Sliders State
  const [simCash, setSimCash] = useState(150000);
  const [simBurn, setSimBurn] = useState(12000);
  const [simGrowthRate, setSimGrowthRate] = useState(18); // percentage
  const [simResult, setSimResult] = useState<any[]>([]);

  // Calculate Simulations
  const handleRunSimulation = () => {
    const steps = 6;
    let cash = simCash;
    let revenue = 1500;
    const growth = simGrowthRate / 100;
    const items = [];

    for (let i = 1; i <= steps; i++) {
      revenue = Math.round(revenue * (1 + growth));
      const netBurn = simBurn - revenue;
      cash = Math.max(0, Math.round(cash - netBurn));
      items.push({
        month: `Month ${i}`,
        cash,
        revenue,
        burn: simBurn,
        runway: netBurn > 0 ? Math.round(cash / netBurn) : "Infinite"
      });
    }
    setSimResult(items);
  };

  useEffect(() => {
    handleRunSimulation();
  }, [simCash, simBurn, simGrowthRate]);

  // Handle Idea Submission
  const handleAddIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle || !newIdeaDesc) return;

    const newId = `idea-${Date.now()}`;
    const newIdea = {
      id: newId,
      title: newIdeaTitle,
      description: newIdeaDesc,
      validationScore: null,
      swot: null,
      leanCanvas: null
    };

    setIdeas([newIdea, ...ideas]);
    setActiveIdeaId(newId);
    setNewIdeaTitle("");
    setNewIdeaDesc("");

    // Simulate calling API gateway and triggering validation
    setValidatingIdeaId(newId);
    setTimeout(() => {
      setIdeas((prevIdeas) =>
        prevIdeas.map((idea) => {
          if (idea.id === newId) {
            return {
              ...idea,
              validationScore: 81,
              swot: {
                strengths: ["Solves a major workflow bottleneck", "High developer retention probability", "SaaS subscription pricing readiness"],
                weaknesses: ["Intense workspace market competition", "Dependency on open AI API stability"],
                opportunities: ["Rapid expansion inside tech hubs", "Custom API integration brokerages"],
                threats: ["Notion AI rapid feature copying", "Data security compliance guidelines"]
              },
              leanCanvas: {
                problem: ["Operational fragmentation", "High startup software bills", "Lack of clear traction templates"],
                solution: ["Unified anti-gravity workspace", "Interactive AI validator & projections", "Escrow payment safeguards"],
                keyMetrics: ["Monthly Active Users (MAU)", "Customer Acquisition Cost (CAC)", "Roadmap completion percentage"],
                uvp: "The ultimate command deck transforming concepts into investment-ready businesses.",
                unfairAdvantage: "Custom DNA profiling aligning startups to VC mandates.",
                channels: ["Direct incubator partnerships", "Viral referral integrations"],
                customerSegments: ["Agile pre-seed tech founders", "Growth-minded workspace administrators"],
                costStructure: ["Prisma DB server cluster hosting", "AI LLM model execution tokens"],
                revenueStreams: ["Premium SaaS subscriptions ($49/month)", "Consulting escrow brokerage processing fee (5%)"]
              }
            };
          }
          return idea;
        })
      );
      setValidatingIdeaId(null);
      // Boost startup score slightly
      setStartup((prev) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          validationScore: 81,
          startupScore: 76
        }
      }));
    }, 3500);
  };

  // Move task to next lane in Kanban Board
  const moveTask = (taskId: string) => {
    setMilestones((prev) =>
      prev.map((milestone) => ({
        ...milestone,
        tasks: milestone.tasks.map((task) => {
          if (task.id === taskId) {
            const nextStatus: any =
              task.status === "TODO" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "REVIEW" : task.status === "REVIEW" ? "DONE" : "TODO";
            return { ...task, status: nextStatus };
          }
          return task;
        })
      }))
    );
  };

  // Handle expert consulting booking
  const handleBookExpert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;

    const expert = experts.find((ex) => ex.id === selectedExpert);
    if (!expert) return;

    const jitsiCode = `launchpad-meet-${Math.random().toString(36).substring(2, 8)}`;
    const newBooking = {
      id: `booking-${Date.now()}`,
      expertName: expert.name,
      role: expert.role,
      time: new Date(bookingTime).toLocaleString(),
      note: bookingNote,
      jitsiLink: `https://meet.jit.si/${jitsiCode}`
    };

    setBookingsList([newBooking, ...bookingsList]);
    setBookingNote("");
    setSelectedExpert(null);
  };

  return (
    <div className="flex flex-1 min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 glass-panel border-r border-space-border flex flex-col p-6 space-y-8 z-10">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-accent to-cyan-accent flex items-center justify-center font-bold text-white shadow-lg shadow-violet-accent/20">
              LP
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              Launch Pad
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-1 uppercase font-semibold tracking-widest pl-1">
            Anti-Gravity OS
          </p>
        </div>

        <nav className="flex-1 space-y-1.5">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-violet-accent/20 to-violet-accent/5 text-white border-l-2 border-violet-accent"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icons.Dashboard />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("ideas")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === "ideas"
                ? "bg-gradient-to-r from-violet-accent/20 to-violet-accent/5 text-white border-l-2 border-violet-accent"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icons.Idea />
            <span>Idea Engine</span>
          </button>
          <button
            onClick={() => setActiveTab("kanban")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === "kanban"
                ? "bg-gradient-to-r from-violet-accent/20 to-violet-accent/5 text-white border-l-2 border-violet-accent"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icons.Roadmap />
            <span>Kanban Board</span>
          </button>
          <button
            onClick={() => setActiveTab("experts")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === "experts"
                ? "bg-gradient-to-r from-violet-accent/20 to-violet-accent/5 text-white border-l-2 border-violet-accent"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icons.Marketplace />
            <span>Expert Consult</span>
          </button>
          <button
            onClick={() => setActiveTab("simulations")}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeTab === "simulations"
                ? "bg-gradient-to-r from-violet-accent/20 to-violet-accent/5 text-white border-l-2 border-violet-accent"
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icons.Simulation />
            <span>Runway Projections</span>
          </button>
        </nav>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
          <div className="text-xs text-zinc-400">Launch Stage</div>
          <div className="text-sm font-bold text-cyan-accent mt-1 flex items-center justify-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-accent animate-pulse" />
            <span>{startup.stage} Stage</span>
          </div>
        </div>
      </aside>

      {/* Main Panel Area */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto z-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 border-b border-space-border pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
              <span>{startup.name}</span>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-violet-accent/25 border border-violet-accent/30 text-violet-accent">
                {startup.industry}
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-0.5">Manage and scale your venture metrics dynamically.</p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-3">
              <span className="text-xs text-zinc-400 uppercase font-semibold">Startup Score</span>
              <span className="text-lg font-extrabold text-violet-accent">{startup.analytics.startupScore}%</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-white">
              JD
            </div>
          </div>
        </header>

        {/* Dashboard Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-panel p-6 rounded-2xl glass-panel-glow border-space-border relative overflow-hidden">
                <div className="text-sm text-zinc-400 font-semibold">Validation Score</div>
                <div className="text-3xl font-extrabold text-white mt-2">{startup.analytics.validationScore}%</div>
                <div className="text-xs text-mint-accent mt-2 flex items-center space-x-1">
                  <span>● AI Verified</span>
                </div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-space-border">
                <div className="text-sm text-zinc-400 font-semibold">Investor Readiness</div>
                <div className="text-3xl font-extrabold text-white mt-2">{startup.analytics.investorReadiness}%</div>
                <div className="text-xs text-zinc-400 mt-2">Pitch deck uploaded</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-space-border">
                <div className="text-sm text-zinc-400 font-semibold">Market Fit Score</div>
                <div className="text-3xl font-extrabold text-white mt-2">{startup.analytics.marketFitScore}%</div>
                <div className="text-xs text-cyan-accent mt-2 font-semibold">82% competition advantage</div>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-space-border">
                <div className="text-sm text-zinc-400 font-semibold">Monthly Burn Rate</div>
                <div className="text-3xl font-extrabold text-rose-500 mt-2">${startup.analytics.burnRate}</div>
                <div className="text-xs text-rose-400 mt-2">Target runway: 18 Months</div>
              </div>
            </div>

            {/* Core Anti-Gravity: DNA Engine & Success Predictor */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Founder DNA Panel */}
              <div className="glass-panel p-6 rounded-2xl border-space-border md:col-span-7 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Founder DNA Matrix</h3>
                  <p className="text-xs text-zinc-400 mb-6">Real-time capabilities measurement score across operational metrics.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-xs text-zinc-400">Execution Ability</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-white">{startup.dna.executionAbility}%</span>
                      <span className="text-[10px] text-mint-accent">Stable</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-xs text-zinc-400">Technical Capability</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-white">{startup.dna.technicalCapability}%</span>
                      <span className="text-[10px] text-cyan-accent">Excellent</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-xs text-zinc-400">Business Capability</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-white">{startup.dna.businessCapability}%</span>
                      <span className="text-[10px] text-amber-500">Upgrade Needed</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col justify-between h-28">
                    <span className="text-xs text-zinc-400">Funding Readiness</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-white">{startup.dna.fundingReadiness}%</span>
                      <span className="text-[10px] text-zinc-400">Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Startup Success Predictor */}
              <div className="glass-panel p-6 rounded-2xl border-space-border md:col-span-5 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet-accent/10 rounded-full blur-3xl pointer-events-none" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Success Predictor</h3>
                  <p className="text-xs text-zinc-400 mb-5">Predictive forecasting engine models based on current metrics.</p>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 rounded-full border-4 border-violet-accent/20 border-t-violet-accent flex items-center justify-center font-extrabold text-xl text-white">
                    82.5%
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Survival probability</div>
                    <div className="text-xs text-zinc-400 mt-0.5">High validated scores offset capital restrictions.</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                    <Icons.Warning />
                    <div className="text-xs">
                      <span className="font-bold text-rose-400">Risk Detected:</span> Business capabilities score is below VC standard guidelines. Consider booking Steve Ip Lawyer for legal consultations.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2.5 p-3 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20">
                    <Icons.Check />
                    <div className="text-xs">
                      <span className="font-bold text-cyan-accent">Next recommended hire:</span> Product Marketing Director to bridge gaps between technical modules and users.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Projections Mini-Chart */}
            <div className="glass-panel p-6 rounded-2xl border-space-border">
              <h3 className="text-lg font-bold text-white mb-2">Monthly Revenue Ramp-Up</h3>
              <p className="text-xs text-zinc-400 mb-6">AI projected customer growth subscription scale.</p>
              <div className="flex items-end justify-between h-40 pt-4 px-4 bg-zinc-950/40 rounded-xl border border-white/5">
                {startup.analytics.revenueForecast.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center w-full group">
                    <span className="text-[10px] text-violet-accent opacity-0 group-hover:opacity-100 transition-opacity mb-2">
                      ${item.revenue}
                    </span>
                    <div
                      className="w-10 bg-gradient-to-t from-violet-accent/30 to-violet-accent rounded-t-md hover:from-cyan-accent hover:to-cyan-accent transition-all duration-300"
                      style={{ height: `${Math.max(12, (item.revenue / 16000) * 120)}px` }}
                    />
                    <span className="text-xs text-zinc-500 mt-2 font-semibold">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Idea Engine & Lean Canvas Tab */}
        {activeTab === "ideas" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Idea submission form */}
            <div className="glass-panel p-6 rounded-2xl border-space-border">
              <h3 className="text-lg font-bold text-white mb-4">Validate New Startup Idea</h3>
              <form onSubmit={handleAddIdea} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-xs text-zinc-400 font-semibold uppercase block mb-1.5">Idea Title</label>
                    <input
                      type="text"
                      placeholder="e.g. AI Patent filer"
                      value={newIdeaTitle}
                      onChange={(e) => setNewIdeaTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-accent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-zinc-400 font-semibold uppercase block mb-1.5">Description & Pain Point</label>
                    <input
                      type="text"
                      placeholder="Briefly state what it does, how it works, and whom it serves..."
                      value={newIdeaDesc}
                      onChange={(e) => setNewIdeaDesc(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-violet-accent"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-accent to-cyan-accent text-white font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-violet-accent/20"
                  >
                    Submit to AI Validator
                  </button>
                </div>
              </form>
            </div>

            {/* List and validation details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-2">Active Concepts</h4>
                {ideas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => setActiveIdeaId(idea.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      activeIdeaId === idea.id
                        ? "bg-white/5 border-violet-accent shadow-md shadow-violet-accent/5"
                        : "bg-transparent border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="font-bold text-white text-sm mb-1">{idea.title}</div>
                    <div className="text-xs text-zinc-400 line-clamp-2 mb-2.5">{idea.description}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold">Validator Result</span>
                      {idea.validationScore ? (
                        <span className="text-xs font-bold text-mint-accent">{idea.validationScore}% Score</span>
                      ) : validatingIdeaId === idea.id ? (
                        <span className="text-[10px] text-cyan-accent font-medium animate-pulse">Running AI scans...</span>
                      ) : (
                        <span className="text-xs text-zinc-500">Unvalidated</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* SWOT and Lean Canvas detailed report */}
              <div className="md:col-span-8 space-y-6">
                {activeIdea.validationScore ? (
                  <div className="space-y-8">
                    {/* Validation Score Header */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-accent/10 to-cyan-accent/5 border border-violet-accent/20 flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-extrabold text-white">AI Startup Validator Report</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">Generated validation overview based on target segments and competitive intelligence.</p>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-extrabold text-mint-accent">{activeIdea.validationScore}%</div>
                        <div className="text-[10px] text-zinc-400 uppercase mt-0.5">Viability Index</div>
                      </div>
                    </div>

                    {/* SWOT Grid */}
                    {activeIdea.swot && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider pl-1">SWOT Grid Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-violet-accent/5 border border-violet-accent/15">
                            <span className="text-xs font-bold text-violet-accent uppercase">Strengths</span>
                            <ul className="text-xs text-zinc-300 mt-2 list-disc list-inside space-y-1">
                              {activeIdea.swot.strengths.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                            <span className="text-xs font-bold text-zinc-400 uppercase">Weaknesses</span>
                            <ul className="text-xs text-zinc-300 mt-2 list-disc list-inside space-y-1">
                              {activeIdea.swot.weaknesses.map((w, idx) => (
                                <li key={idx}>{w}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-xl bg-cyan-accent/5 border border-cyan-accent/15">
                            <span className="text-xs font-bold text-cyan-accent uppercase">Opportunities</span>
                            <ul className="text-xs text-zinc-300 mt-2 list-disc list-inside space-y-1">
                              {activeIdea.swot.opportunities.map((o, idx) => (
                                <li key={idx}>{o}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15">
                            <span className="text-xs font-bold text-rose-400 uppercase">Threats</span>
                            <ul className="text-xs text-zinc-300 mt-2 list-disc list-inside space-y-1">
                              {activeIdea.swot.threats.map((t, idx) => (
                                <li key={idx}>{t}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lean Canvas Grid */}
                    {activeIdea.leanCanvas && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider pl-1">Lean Canvas (9 Boxes)</h4>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          {/* Col 1 */}
                          <div className="md:col-span-1 p-3 rounded-lg bg-zinc-900 border border-white/5 min-h-36">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Problem</span>
                            <ul className="text-[10px] text-zinc-300 list-disc list-inside space-y-1">
                              {activeIdea.leanCanvas.problem.map((p, idx) => (
                                <li key={idx}>{p}</li>
                              ))}
                            </ul>
                          </div>
                          {/* Col 2 */}
                          <div className="md:col-span-1 p-3 rounded-lg bg-zinc-900 border border-white/5 min-h-36">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Solution</span>
                            <ul className="text-[10px] text-zinc-300 list-disc list-inside space-y-1">
                              {activeIdea.leanCanvas.solution.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>
                          {/* Col 3 */}
                          <div className="md:col-span-1 p-3 rounded-lg bg-zinc-900 border border-white/5 min-h-36">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">UVP</span>
                            <p className="text-[10px] text-zinc-300">{activeIdea.leanCanvas.uvp}</p>
                          </div>
                          {/* Col 4 */}
                          <div className="md:col-span-1 p-3 rounded-lg bg-zinc-900 border border-white/5 min-h-36">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Unfair Advantage</span>
                            <p className="text-[10px] text-zinc-300">{activeIdea.leanCanvas.unfairAdvantage}</p>
                          </div>
                          {/* Col 5 */}
                          <div className="md:col-span-1 p-3 rounded-lg bg-zinc-900 border border-white/5 min-h-36">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Customer Segments</span>
                            <ul className="text-[10px] text-zinc-300 list-disc list-inside space-y-1">
                              {activeIdea.leanCanvas.customerSegments.map((cs, idx) => (
                                <li key={idx}>{cs}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-panel p-12 rounded-2xl border-space-border text-center flex flex-col items-center justify-center min-h-[300px]">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4 animate-pulse">
                      ⚡
                    </div>
                    {validatingIdeaId === activeIdeaId ? (
                      <div>
                        <h4 className="font-bold text-white">AI Scanner Running...</h4>
                        <p className="text-xs text-zinc-400 mt-1.5">Constructing SWOT matrix, analyzing market competitor risk, and filling out 9 Lean Canvas boards.</p>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-bold text-white">Idea Validation Required</h4>
                        <p className="text-xs text-zinc-400 mt-1.5">No validation has been generated for this concept yet. Submit via form or trigger AI analysis.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Kanban Board Tab */}
        {activeTab === "kanban" && (
          <div className="space-y-8 animate-fadeIn">
            {milestones.map((milestone) => (
              <div key={milestone.id} className="space-y-4">
                <h3 className="text-md font-bold text-white pl-1 flex items-center space-x-2">
                  <span className="w-1.5 h-4 bg-violet-accent rounded-full" />
                  <span>{milestone.title}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* TODO Column */}
                  <div className="glass-panel p-4 rounded-xl border-space-border min-h-[220px]">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>To Do</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] text-zinc-400">
                        {milestone.tasks.filter((t) => t.status === "TODO").length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestone.tasks
                        .filter((task) => task.status === "TODO")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => moveTask(task.id)}
                            className="p-3 rounded-lg bg-zinc-950/60 border border-white/5 hover:border-violet-accent/50 cursor-pointer transition-all active:scale-95"
                          >
                            <div className="text-xs text-white font-medium">{task.title}</div>
                            <div className="text-[10px] text-zinc-500 mt-2 uppercase font-semibold">Click to Move</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* IN_PROGRESS Column */}
                  <div className="glass-panel p-4 rounded-xl border-space-border min-h-[220px]">
                    <div className="text-xs font-bold text-cyan-accent uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>In Progress</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-cyan-accent/15 text-[10px] text-cyan-accent">
                        {milestone.tasks.filter((t) => t.status === "IN_PROGRESS").length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestone.tasks
                        .filter((task) => task.status === "IN_PROGRESS")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => moveTask(task.id)}
                            className="p-3 rounded-lg bg-zinc-950/60 border border-cyan-accent/15 hover:border-cyan-accent cursor-pointer transition-all active:scale-95"
                          >
                            <div className="text-xs text-white font-medium">{task.title}</div>
                            <div className="text-[10px] text-cyan-accent mt-2 uppercase font-semibold">Click to Move</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* REVIEW Column */}
                  <div className="glass-panel p-4 rounded-xl border-space-border min-h-[220px]">
                    <div className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Peer Review</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/10 text-[10px] text-amber-500">
                        {milestone.tasks.filter((t) => t.status === "REVIEW").length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestone.tasks
                        .filter((task) => task.status === "REVIEW")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => moveTask(task.id)}
                            className="p-3 rounded-lg bg-zinc-950/60 border border-amber-500/10 hover:border-amber-500 cursor-pointer transition-all active:scale-95"
                          >
                            <div className="text-xs text-white font-medium">{task.title}</div>
                            <div className="text-[10px] text-amber-400 mt-2 uppercase font-semibold">Click to Move</div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* DONE Column */}
                  <div className="glass-panel p-4 rounded-xl border-space-border min-h-[220px]">
                    <div className="text-xs font-bold text-mint-accent uppercase tracking-wider mb-3 flex items-center justify-between">
                      <span>Done</span>
                      <span className="px-1.5 py-0.5 rounded-full bg-mint-accent/10 text-[10px] text-mint-accent">
                        {milestone.tasks.filter((t) => t.status === "DONE").length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {milestone.tasks
                        .filter((task) => task.status === "DONE")
                        .map((task) => (
                          <div
                            key={task.id}
                            onClick={() => moveTask(task.id)}
                            className="p-3 rounded-lg bg-zinc-950/60 border border-mint-accent/15 hover:border-mint-accent cursor-pointer transition-all active:scale-95 opacity-65"
                          >
                            <div className="text-xs text-zinc-400 font-medium line-through">{task.title}</div>
                            <div className="text-[10px] text-mint-accent mt-2 uppercase font-semibold">Archived</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expert consultations & Marketplace bookings tab */}
        {activeTab === "experts" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Experts list */}
            <div>
              <h3 className="text-md font-bold text-white mb-4 pl-1">Available Marketplace Experts & Agencies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experts.map((exp) => (
                  <div key={exp.id} className="glass-panel p-6 rounded-2xl border-space-border flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-white text-base">{exp.name}</h4>
                          <span className="text-xs text-zinc-400">{exp.role}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icons.Star />
                          <span className="text-xs font-bold text-white">{exp.rating}</span>
                          <span className="text-xs text-zinc-500">({exp.reviews})</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mb-4 line-clamp-3">{exp.bio}</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exp.skills.map((skill, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-space-border pt-4 mt-4">
                      <div>
                        <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Hourly rate</span>
                        <span className="text-sm font-extrabold text-white">{exp.rate}</span>
                      </div>
                      <button
                        onClick={() => setSelectedExpert(exp.id)}
                        className="px-4 py-2 rounded-xl bg-violet-accent text-white text-xs font-bold hover:opacity-90 transition-all active:scale-95"
                      >
                        Book Consultation
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking form */}
            {selectedExpert && (
              <div className="glass-panel p-6 rounded-2xl border-space-border max-w-xl">
                <h3 className="text-sm font-bold text-white mb-4 uppercase">
                  Schedule Video Session with {experts.find((e) => e.id === selectedExpert)?.name}
                </h3>
                <form onSubmit={handleBookExpert} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">Time slot</label>
                      <input
                        type="datetime-local"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 font-semibold block mb-1">Escrow deposit contract</label>
                      <input
                        type="text"
                        disabled
                        value={experts.find((e) => e.id === selectedExpert)?.rate || "$150"}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-zinc-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 font-semibold block mb-1">Consultation requirements notes</label>
                    <textarea
                      placeholder="e.g. Need deck review before investor deal room access..."
                      value={bookingNote}
                      onChange={(e) => setBookingNote(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none h-16 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setSelectedExpert(null)}
                      className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-zinc-300 text-xs font-bold hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-accent to-cyan-accent text-white text-xs font-bold shadow-md shadow-violet-accent/20"
                    >
                      Lock Escrow & Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Bookings log */}
            {bookingsList.length > 0 && (
              <div>
                <h3 className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-3">Scheduled Consultations</h3>
                <div className="space-y-3">
                  {bookingsList.map((bk) => (
                    <div key={bk.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Icons.Calendar />
                        <div>
                          <h4 className="font-bold text-white text-sm">{bk.expertName}</h4>
                          <p className="text-[10px] text-zinc-400">
                            {bk.role} | {bk.time}
                          </p>
                        </div>
                      </div>
                      <a
                        href={bk.jitsiLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-xl bg-cyan-accent/20 text-cyan-accent text-xs font-bold border border-cyan-accent/30 hover:bg-cyan-accent/35 active:scale-95"
                      >
                        Join Jitsi Room
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Projections & runway simulations tab */}
        {activeTab === "simulations" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Sliders layout */}
            <div className="glass-panel p-6 rounded-2xl border-space-border">
              <h3 className="text-md font-bold text-white mb-1 pl-1">Financial Runway Simulator</h3>
              <p className="text-xs text-zinc-400 mb-6 pl-1">Adjust parameters to see cash burn runway and growth projection tables.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase block mb-1.5">Starting cash: ${simCash.toLocaleString()}</label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={simCash}
                    onChange={(e) => setSimCash(Number(e.target.value))}
                    className="w-full accent-violet-accent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase block mb-1.5">Monthly burn: ${simBurn.toLocaleString()}</label>
                  <input
                    type="range"
                    min="2000"
                    max="100000"
                    step="2000"
                    value={simBurn}
                    onChange={(e) => setSimBurn(Number(e.target.value))}
                    className="w-full accent-violet-accent cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-semibold uppercase block mb-1.5">Revenue growth rate: {simGrowthRate}%</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={simGrowthRate}
                    onChange={(e) => setSimGrowthRate(Number(e.target.value))}
                    className="w-full accent-violet-accent cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Simulations table */}
            <div className="glass-panel p-6 rounded-2xl border-space-border">
              <h3 className="text-xs text-zinc-400 font-semibold uppercase tracking-wider mb-4">Runway projection table</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-space-border text-zinc-500 text-xs uppercase font-semibold">
                      <th className="py-3 px-4">Period</th>
                      <th className="py-3 px-4">Remaining Cash</th>
                      <th className="py-3 px-4">Projected Revenue</th>
                      <th className="py-3 px-4">Gross Burn</th>
                      <th className="py-3 px-4">Runway Remaining</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-zinc-300 divide-y divide-white/5">
                    {simResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{row.month}</td>
                        <td className="py-3.5 px-4 font-semibold text-cyan-accent">${row.cash.toLocaleString()}</td>
                        <td className="py-3.5 px-4">${row.revenue.toLocaleString()}</td>
                        <td className="py-3.5 px-4 text-rose-400">${row.burn.toLocaleString()}</td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            row.runway === "Infinite"
                              ? "bg-mint-accent/20 text-mint-accent"
                              : Number(row.runway) < 4
                              ? "bg-rose-500/20 text-rose-400"
                              : "bg-white/10 text-zinc-300"
                          }`}>
                            {row.runway === "Infinite" ? "Infinite" : `${row.runway} Months`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
