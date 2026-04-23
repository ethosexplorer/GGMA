import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Vote,
  ChevronRight,
  ChevronLeft,
  Heart,
  Leaf,
  BarChart3,
  Users,
  Globe,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  MessageCircle,
  TrendingUp,
  Zap,
} from 'lucide-react';

// ─── Poll Types ───
interface PollOption {
  id: string;
  label: string;
  emoji?: string;
  votes: number;
}

interface Poll {
  id: string;
  category: 'healing' | 'education' | 'demographics' | 'growth' | 'support';
  question: string;
  subtitle?: string;
  options: PollOption[];
  allowMultiple?: boolean;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}

// ─── Poll Data ───
const POLLS: Poll[] = [
  {
    id: 'natural_healing',
    category: 'healing',
    question: 'Do you believe cannabis is a natural source of healing with minimal side effects?',
    subtitle: 'Medical cannabis has shown therapeutic benefits across dozens of conditions.',
    icon: <Heart size={20} />,
    color: 'emerald',
    bgGradient: 'from-emerald-500 to-green-600',
    options: [
      { id: 'strongly_agree', label: 'Strongly Agree', emoji: '💚', votes: 1847 },
      { id: 'agree', label: 'Agree', emoji: '✅', votes: 1234 },
      { id: 'neutral', label: 'Neutral / Need More Info', emoji: '🤔', votes: 523 },
      { id: 'disagree', label: 'Disagree', emoji: '❌', votes: 187 },
      { id: 'strongly_disagree', label: 'Strongly Disagree', emoji: '🚫', votes: 89 },
    ]
  },
  {
    id: 'medical_conditions',
    category: 'healing',
    question: 'Which conditions do you believe benefit most from medical cannabis?',
    subtitle: 'Select all that apply — your voice helps shape medical research priorities.',
    icon: <Leaf size={20} />,
    color: 'teal',
    bgGradient: 'from-teal-500 to-cyan-600',
    allowMultiple: true,
    options: [
      { id: 'chronic_pain', label: 'Chronic Pain', emoji: '🦴', votes: 2134 },
      { id: 'anxiety_ptsd', label: 'Anxiety / PTSD', emoji: '🧠', votes: 1876 },
      { id: 'cancer_chemo', label: 'Cancer / Chemotherapy', emoji: '🎗️', votes: 1654 },
      { id: 'epilepsy', label: 'Epilepsy / Seizures', emoji: '⚡', votes: 1432 },
      { id: 'insomnia', label: 'Insomnia / Sleep Disorders', emoji: '😴', votes: 1298 },
      { id: 'inflammation', label: 'Inflammation / Arthritis', emoji: '🔥', votes: 1187 },
      { id: 'mental_health', label: 'Depression / Mental Health', emoji: '💜', votes: 987 },
      { id: 'other', label: 'Other (comment below)', emoji: '📝', votes: 345 },
    ]
  },
  {
    id: 'education_level',
    category: 'education',
    question: 'How would you rate your knowledge of medical cannabis?',
    subtitle: 'Education is the foundation of responsible cannabis policy.',
    icon: <Sparkles size={20} />,
    color: 'purple',
    bgGradient: 'from-purple-500 to-indigo-600',
    options: [
      { id: 'expert', label: 'Expert — I work in the industry', emoji: '🎓', votes: 567 },
      { id: 'well_informed', label: 'Well-Informed — I research regularly', emoji: '📚', votes: 1123 },
      { id: 'somewhat', label: 'Somewhat Informed', emoji: '📖', votes: 1456 },
      { id: 'learning', label: 'Just Starting to Learn', emoji: '🌱', votes: 987 },
      { id: 'uninformed', label: 'I want to learn more', emoji: '🔍', votes: 654 },
    ]
  },
  {
    id: 'age_group',
    category: 'demographics',
    question: 'What is your age group?',
    subtitle: 'Understanding demographics helps us serve all communities better.',
    icon: <Users size={20} />,
    color: 'sky',
    bgGradient: 'from-sky-500 to-blue-600',
    options: [
      { id: '18_24', label: '18 – 24', emoji: '🌱', votes: 432 },
      { id: '25_34', label: '25 – 34', emoji: '🌿', votes: 876 },
      { id: '35_44', label: '35 – 44', emoji: '🌳', votes: 1123 },
      { id: '45_54', label: '45 – 54', emoji: '🏡', votes: 987 },
      { id: '55_64', label: '55 – 64', emoji: '🌻', votes: 654 },
      { id: '65_plus', label: '65+', emoji: '🌾', votes: 345 },
    ]
  },
  {
    id: 'med_vs_rec',
    category: 'support',
    question: 'Do you support medical cannabis programs over recreational legalization?',
    subtitle: 'Medical programs ensure patient safety, quality control, and responsible access.',
    icon: <TrendingUp size={20} />,
    color: 'amber',
    bgGradient: 'from-amber-500 to-orange-600',
    options: [
      { id: 'medical_only', label: 'Yes — Medical programs with proper oversight', emoji: '🏥', votes: 2345 },
      { id: 'medical_first', label: 'Medical first, then evaluate', emoji: '📋', votes: 1234 },
      { id: 'both', label: 'Support both equally', emoji: '⚖️', votes: 876 },
      { id: 'recreational', label: 'Prefer recreational approach', emoji: '🌿', votes: 432 },
      { id: 'neither', label: 'Neither / Undecided', emoji: '🤷', votes: 198 },
    ]
  },
  {
    id: 'side_effects',
    category: 'healing',
    question: 'Compared to traditional pharmaceuticals, do you believe cannabis has fewer side effects?',
    subtitle: 'Millions of Americans take medications with significant side effects daily.',
    icon: <Zap size={20} />,
    color: 'rose',
    bgGradient: 'from-rose-500 to-pink-600',
    options: [
      { id: 'much_fewer', label: 'Significantly fewer side effects', emoji: '💚', votes: 1987 },
      { id: 'somewhat_fewer', label: 'Somewhat fewer', emoji: '✅', votes: 1345 },
      { id: 'comparable', label: 'About the same', emoji: '↔️', votes: 567 },
      { id: 'more_research', label: 'Need more research', emoji: '🔬', votes: 876 },
      { id: 'more_effects', label: 'Cannabis has more side effects', emoji: '⚠️', votes: 123 },
    ]
  },
  {
    id: 'nationality_background',
    category: 'demographics',
    question: 'Which background best describes you?',
    subtitle: 'Cannabis healing crosses all cultures. Every voice matters.',
    icon: <Globe size={20} />,
    color: 'indigo',
    bgGradient: 'from-indigo-500 to-violet-600',
    options: [
      { id: 'african_american', label: 'African American / Black', emoji: '✊🏿', votes: 876 },
      { id: 'hispanic_latino', label: 'Hispanic / Latino', emoji: '🌎', votes: 1234 },
      { id: 'caucasian', label: 'Caucasian / White', emoji: '🤝', votes: 1456 },
      { id: 'asian', label: 'Asian / Pacific Islander', emoji: '🌏', votes: 543 },
      { id: 'native', label: 'Native American / Indigenous', emoji: '🏜️', votes: 321 },
      { id: 'middle_eastern', label: 'Middle Eastern / North African', emoji: '🌍', votes: 234 },
      { id: 'multiracial', label: 'Multiracial / Other', emoji: '🌈', votes: 567 },
      { id: 'prefer_not', label: 'Prefer not to say', emoji: '🔒', votes: 345 },
    ]
  },
  {
    id: 'growth_priority',
    category: 'growth',
    question: 'What should be the #1 priority for the medical cannabis industry?',
    subtitle: 'Help shape the future of responsible, patient-first cannabis policy.',
    icon: <BarChart3 size={20} />,
    color: 'emerald',
    bgGradient: 'from-emerald-600 to-teal-700',
    options: [
      { id: 'patient_access', label: 'Expanding patient access', emoji: '🏥', votes: 1876 },
      { id: 'research', label: 'More clinical research', emoji: '🔬', votes: 1543 },
      { id: 'affordability', label: 'Making it affordable', emoji: '💰', votes: 1234 },
      { id: 'education', label: 'Public education & destigmatization', emoji: '📚', votes: 1098 },
      { id: 'quality', label: 'Quality control & lab testing', emoji: '🧪', votes: 876 },
      { id: 'equity', label: 'Social equity & inclusion', emoji: '⚖️', votes: 654 },
    ]
  },
];

// ─── Featured Poll (top banner) ───
export const FeaturedPoll = () => {
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [commentText, setCommentText] = useState<Record<string, string>>({});

  const poll = POLLS[currentPollIndex];
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (optionId: string) => {
    if (hasVoted[poll.id]) return;

    const currentSelections = selectedOptions[poll.id] || [];
    if (poll.allowMultiple) {
      if (currentSelections.includes(optionId)) {
        setSelectedOptions({ ...selectedOptions, [poll.id]: currentSelections.filter(id => id !== optionId) });
      } else {
        setSelectedOptions({ ...selectedOptions, [poll.id]: [...currentSelections, optionId] });
      }
    } else {
      setSelectedOptions({ ...selectedOptions, [poll.id]: [optionId] });
      // Auto-submit for single-choice polls
      setTimeout(() => setHasVoted({ ...hasVoted, [poll.id]: true }), 300);
    }
  };

  const submitMultiVote = () => {
    if ((selectedOptions[poll.id] || []).length > 0) {
      setHasVoted({ ...hasVoted, [poll.id]: true });
    }
  };

  const nextPoll = () => setCurrentPollIndex((currentPollIndex + 1) % POLLS.length);
  const prevPoll = () => setCurrentPollIndex((currentPollIndex - 1 + POLLS.length) % POLLS.length);

  if (!isExpanded) {
    return (
      <div className="bg-gradient-to-r from-[#1a4731] to-emerald-800 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <button onClick={() => setIsExpanded(true)} className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors text-xs font-bold">
            <Vote size={14} />
            <span>🗳️ Community Voice — Share your opinion on medical cannabis</span>
            <ChevronRight size={14} />
          </button>
          <span className="text-emerald-400 text-[10px] font-bold">{POLLS.length} Active Polls</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#0d2b1e] via-[#1a4731] to-emerald-900 border-b border-emerald-700/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-400 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 relative z-10">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-br ${poll.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
              {poll.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">🗳️ Community Voice</span>
                <span className="text-[10px] text-emerald-500/60 font-bold">Poll {currentPollIndex + 1} of {POLLS.length}</span>
              </div>
              <p className="text-white font-black text-base leading-tight mt-0.5">{poll.question}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevPoll} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextPoll} className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors">
              <ChevronRight size={16} />
            </button>
            <button onClick={() => setIsExpanded(false)} className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center text-emerald-300 transition-colors ml-1">
              <X size={14} />
            </button>
          </div>
        </div>

        {poll.subtitle && (
          <p className="text-emerald-300/80 text-xs mb-4 max-w-2xl">{poll.subtitle}</p>
        )}

        {/* Poll Options */}
        <AnimatePresence mode="wait">
          <motion.div
            key={poll.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2"
          >
            {poll.options.map((option) => {
              const percentage = Math.round((option.votes / totalVotes) * 100);
              const isSelected = (selectedOptions[poll.id] || []).includes(option.id);
              const voted = hasVoted[poll.id];

              return (
                <button
                  key={option.id}
                  onClick={() => handleVote(option.id)}
                  disabled={voted && !poll.allowMultiple}
                  className={`relative overflow-hidden rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${voted ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {/* Progress bar (shown after voting) */}
                  {voted && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      className="absolute inset-y-0 left-0 bg-emerald-500/15 rounded-xl"
                    />
                  )}

                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-lg">{option.emoji}</span>
                    <span className="text-white text-xs font-bold flex-1 leading-tight">{option.label}</span>
                    {voted && (
                      <span className="text-emerald-400 text-xs font-black">{percentage}%</span>
                    )}
                    {isSelected && !voted && (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    )}
                  </div>

                  {voted && (
                    <p className="text-[10px] text-emerald-500/60 font-bold mt-1 relative z-10 ml-7">
                      {(option.votes + (isSelected ? 1 : 0)).toLocaleString()} votes
                    </p>
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* Comment box — shown when 'other' is selected */}
        {(selectedOptions[poll.id] || []).includes('other') && (
          <div className="mt-3 max-w-2xl">
            <textarea
              value={commentText[poll.id] || ''}
              onChange={e => setCommentText({ ...commentText, [poll.id]: e.target.value })}
              placeholder="Share your thoughts... we're listening 💬"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm placeholder:text-emerald-300/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400/50 resize-none"
              rows={2}
            />
          </div>
        )}

        {/* Submit button for multi-select + Stats */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-4">
            {poll.allowMultiple && !hasVoted[poll.id] && (selectedOptions[poll.id] || []).length > 0 && (
              <button
                onClick={submitMultiVote}
                className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-400 transition-all shadow-lg"
              >
                Submit Vote ({(selectedOptions[poll.id] || []).length} selected)
              </button>
            )}
            {hasVoted[poll.id] && (
              <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={14} /> Thank you for voting!
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-emerald-500/60 font-bold">
            <span>{totalVotes.toLocaleString()} total votes</span>
            <span>•</span>
            <span className="capitalize">{poll.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Sticky Side Poll Widget ───
export const StickyPollWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});
  const [showAfterScroll, setShowAfterScroll] = useState(false);

  // Show after scrolling past the hero
  useEffect(() => {
    const handleScroll = () => {
      setShowAfterScroll(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const poll = POLLS[currentPollIndex];
  const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);

  const handleVote = (optionId: string) => {
    if (hasVoted[poll.id]) return;
    setSelectedOptions({ ...selectedOptions, [poll.id]: [optionId] });
    setTimeout(() => setHasVoted({ ...hasVoted, [poll.id]: true }), 300);
  };

  const nextPoll = () => setCurrentPollIndex((currentPollIndex + 1) % POLLS.length);

  if (!showAfterScroll) return null;

  return (
    <div className="fixed left-4 top-1/3 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-2xl shadow-emerald-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform group relative"
          >
            <Vote size={22} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white animate-pulse">
              {POLLS.length}
            </div>
            <div className="absolute left-full ml-3 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-xl pointer-events-none">
              🗳️ Vote Now!
            </div>
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0, x: -20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, x: -20 }}
            className="w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Widget Header */}
            <div className={`bg-gradient-to-r ${poll.bgGradient} p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Vote size={16} className="text-white" />
                  <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Community Voice</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <p className="text-white font-bold text-sm leading-snug">{poll.question}</p>
              <p className="text-white/60 text-[10px] mt-1">Poll {currentPollIndex + 1} of {POLLS.length}</p>
            </div>

            {/* Options */}
            <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
              {poll.options.map((option) => {
                const percentage = Math.round((option.votes / totalVotes) * 100);
                const isSelected = (selectedOptions[poll.id] || []).includes(option.id);
                const voted = hasVoted[poll.id];

                return (
                  <button
                    key={option.id}
                    onClick={() => handleVote(option.id)}
                    disabled={voted}
                    className={`relative w-full overflow-hidden rounded-xl p-3 text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-50 border-2 border-emerald-400'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    {voted && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-y-0 left-0 bg-emerald-100 rounded-xl"
                      />
                    )}
                    <div className="relative z-10 flex items-center gap-2">
                      <span className="text-base">{option.emoji}</span>
                      <span className="text-slate-800 text-xs font-bold flex-1">{option.label}</span>
                      {voted && <span className="text-emerald-600 text-xs font-black">{percentage}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between">
              {hasVoted[poll.id] ? (
                <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 size={12} /> Thanks!
                </span>
              ) : (
                <span className="text-slate-400 text-[10px] font-bold">{totalVotes.toLocaleString()} votes</span>
              )}
              <button onClick={nextPoll} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Next Poll <ArrowRight size={12} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FeaturedPoll;
