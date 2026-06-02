import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GLOBAL_VOICES_MESSAGES, 
  GlobalVoiceMessage 
} from "../data_global_voices";
import { 
  Search, 
  Globe, 
  Tag, 
  MapPin, 
  Clock, 
  Heart, 
  Sparkles, 
  Compass, 
  HeartHandshake, 
  Layers 
} from "lucide-react";

// Estimated relative weights to sort timestamps rationally from most recent to oldest
const getDaysOld = (ts: string): number => {
  const numberPart = parseInt(ts, 10) || 1;
  const isDay = ts.includes("day");
  const isWeek = ts.includes("week");
  const isMonth = ts.includes("month");
  const isYear = ts.includes("year");
  
  if (isDay) return numberPart;
  if (isWeek) return numberPart * 7;
  if (isMonth) return numberPart * 30;
  if (isYear) return numberPart * 365;
  return 1000;
};

export const GlobalVoices: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("All");
  const [selectedTopic, setSelectedTopic] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "name" | "country">("recent");

  // Dynamically build regions from the database to ensure synchronicity
  const regions = useMemo(() => {
    const list = new Set(GLOBAL_VOICES_MESSAGES.map(m => m.region));
    return ["All", ...Array.from(list)];
  }, []);

  // Dynamically build topics
  const topics = useMemo(() => {
    const list = new Set(GLOBAL_VOICES_MESSAGES.map(m => m.topic));
    return ["All", ...Array.from(list)];
  }, []);

  // Filtering + Sorting Pipeline
  const filteredMessages = useMemo(() => {
    let result = [...GLOBAL_VOICES_MESSAGES];

    // 1. Filter by Region
    if (selectedRegion !== "All") {
      result = result.filter(m => m.region === selectedRegion);
    }

    // 2. Filter by Topic
    if (selectedTopic !== "All") {
      result = result.filter(m => m.topic === selectedTopic);
    }

    // 3. Search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.country.toLowerCase().includes(q) || 
        m.city.toLowerCase().includes(q) || 
        m.message.toLowerCase().includes(q)
      );
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === "recent") {
        return getDaysOld(a.timestamp) - getDaysOld(b.timestamp);
      }
      if (sortBy === "oldest") {
        return getDaysOld(b.timestamp) - getDaysOld(a.timestamp);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "country") {
        return a.country.localeCompare(b.country);
      }
      return 0;
    });

    return result;
  }, [selectedRegion, selectedTopic, searchQuery, sortBy]);

  // Framer Motion Animation Variants for Staggered Load
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="bg-[#FCFCFC] min-h-screen text-[#111111] pb-24 selection:bg-[#F4511E]/20 selection:text-[#F4511E]">
      
      {/* PREMIUM HERO SECTION */}
      <section className="relative h-[460px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1920" 
            alt="Diverse supporter communities of Prince Fazza Charity Foundation"
            className="w-full h-full object-cover scale-[1.03] filter brightness-[0.75] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Dark Layer Overlay to optimize readability & premium mood */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-[#111111]/30"></div>
          {/* Decorative graphic patterns */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FCFCFC] to-transparent z-10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#F4511E]/15 border border-[#F4511E]/30 backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4511E] animate-ping" />
            <span className="text-[10px] font-mono font-black uppercase text-[#FF6E40] tracking-widest leading-none">
              Community Appreciation Registry
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-sans tracking-tight leading-[1.05] drop-shadow-sm"
          >
            Global Voices
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="text-base sm:text-lg md:text-xl text-zinc-100 font-light max-w-2xl mx-auto drop-shadow-md leading-relaxed"
          >
            Messages of Hope, Gratitude, and Humanitarian Impact from Around the World
          </motion.p>
        </div>
      </section>

      {/* SEARCH AND FILTERS BENCH */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-[-40px] relative z-30">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_16px_50px_-12px_rgba(0,0,0,0.06)] p-6 md:p-8 space-y-6">
          
          {/* Top Row: Search Input and Sorters */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            {/* Search Country/Name input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search messages by name, country, city, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAFAFA] border border-slate-200/80 hover:border-slate-300 focus:border-[#F4511E] focus:ring-1 focus:ring-[#F4511E] rounded-2xl py-3.5 pl-12 pr-6 text-sm font-semibold transition-all outline-none text-[#111111]"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 transition"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sorters Selection */}
            <div className="flex items-center space-x-3 w-full justify-end">
              <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider flex-shrink-0">
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full lg:w-48 bg-[#FAFAFA] border border-slate-200 hover:border-slate-300 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 outline-none focus:border-[#F4511E]"
              >
                <option value="recent">Most Recent First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name (A-Z)</option>
                <option value="country">Country (A-Z)</option>
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Second Row: Region Filters */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-500">
              <Globe className="w-3.5 h-3.5 text-[#F4511E]" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                Filter by Region:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                    selectedRegion === region
                      ? "bg-[#F4511E] text-white shadow-md shadow-[#F4511E]/20"
                      : "bg-[#FAFAFA] text-slate-700 hover:bg-slate-100 border border-slate-100 hover:border-slate-200"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          {/* Third Row: Topic Filters */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-slate-500">
              <Layers className="w-3.5 h-3.5 text-[#F4511E]" />
              <span className="text-[10px] font-mono font-black uppercase tracking-wider">
                Filter by Project Topic:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                    selectedTopic === topic
                      ? "bg-slate-900 text-white shadow-md"
                      : "bg-[#FAFAFA] text-slate-600 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FEED STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col sm:flex-row items-center justify-between px-4 text-xs font-mono font-bold text-slate-400 gap-2">
          <div className="flex items-center space-x-2">
            <span>SHOWING:</span>
            <span className="text-slate-800 font-extrabold">{filteredMessages.length} Messages</span>
            <span>OF</span>
            <span className="text-slate-800 font-extrabold">{GLOBAL_VOICES_MESSAGES.length} Global Stories</span>
          </div>
          <div>
            <span>// DECLARED REGISTER: UNDER DIRECT RESILIENCE DIRECTIVE</span>
          </div>
        </div>
      </section>

      {/* MESSAGES FEED GRID PANEL */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
        <AnimatePresence mode="popLayout">
          {filteredMessages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-16 text-center max-w-xl mx-auto space-y-4"
            >
              <div className="w-16 h-16 bg-[#F4511E]/10 rounded-2xl flex items-center justify-center mx-auto">
                <Compass className="w-8 h-8 text-[#F4511E]" />
              </div>
              <h3 className="text-lg font-black text-slate-800">No message coordinates match</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                We couldn't find any suppport or impact reports matching your search parameters. Try choosing different filters or clear search query input.
              </p>
              <button
                onClick={() => {
                  setSelectedRegion("All");
                  setSelectedTopic("All");
                  setSearchQuery("");
                }}
                className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-[#F4511E] transition-colors rounded-xl font-mono text-[10px] font-black uppercase text-white py-2 px-5"
              >
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white border border-slate-150/80 rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.04)] hover:border-slate-200/90 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Category Accent top right */}
                  <div className="absolute top-0 right-0 w-1.5 h-full bg-[#F4511E] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="space-y-4">
                    {/* Header: country flag + details */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <span 
                          className="text-3xl select-none" 
                          role="img" 
                          aria-label={`${msg.country} flag`}
                        >
                          {msg.flag}
                        </span>
                        <div className="overflow-hidden">
                          <h4 className="font-extrabold text-[#111111] text-sm leading-tight truncate">
                            {msg.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {msg.city}, {msg.country}
                          </span>
                        </div>
                      </div>

                      {/* Region Badge */}
                      <span className="px-2 py-0.5 rounded bg-slate-50 text-[9px] font-mono font-bold text-slate-400 select-none uppercase">
                        {msg.region}
                      </span>
                    </div>

                    {/* Topic Badge Indicator */}
                    <div className="inline-flex items-center space-x-1.5 text-[#F4511E]">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-black uppercase tracking-wider">{msg.topic}</span>
                    </div>

                    {/* Supporting Quote paragraph - Premium editorial font weight */}
                    <div className="text-slate-700 text-sm font-normal leading-relaxed italic border-l-2 border-slate-100 pl-3">
                      “{msg.message}”
                    </div>
                  </div>

                  {/* Message Footer: Date timestamp */}
                  <div className="mt-6 pt-4 border-t border-slate-100/70 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{msg.timestamp}</span>
                    </div>
                    <div className="flex items-center space-x-1 opacity-40 group-hover:opacity-100 transition duration-300 text-[#F4511E]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-slate-500">
                        REFLECT
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CALL TO ACTION ACCENT */}
      <section className="max-w-4xl mx-auto px-4 mt-20">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,81,30,0.12),transparent_50%)]" />
          
          <div className="relative z-10 space-y-6 max-w-xl mx-auto">
            <HeartHandshake className="w-10 h-10 text-[#F4511E] mx-auto" />
            <h3 className="text-2xl font-black tracking-tight">Help Build Stories of Hope</h3>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold max-w-lg mx-auto leading-relaxed">
              Every message in this register is a direct reflection of compassionate giving in action. Join Prince Fazza Charity Foundation today by donating or matching resources for targeted programs.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  // Direct navigation back to donation flow or trigger donation page
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  const navBt = document.querySelector('[title="Go Back"]');
                  if (navBt) {
                    (navBt as any).click();
                  }
                  // Custom dispatch event to open donation modal locally or trigger state
                  const event = new CustomEvent("trigger-donate-modal");
                  window.dispatchEvent(event);
                }}
                className="inline-flex items-center space-x-2 bg-[#F4511E] hover:bg-[#ff6130] active:scale-[0.98] transition-all rounded-full font-mono text-[10px] font-black uppercase text-white py-3 px-8 shadow-lg shadow-[#F4511E]/20 cursor-pointer"
              >
                <span>SUPPORT OUR MISSIONS</span>
                <span className="font-sans font-extrabold">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
